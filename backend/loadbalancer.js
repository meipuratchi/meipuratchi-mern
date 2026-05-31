/**
 * ============================================================
 *  MEIPURATCHI — Load Balancer
 *  Listens on port 5000, distributes traffic to 5 backend
 *  workers on ports 5001–5005 using Round-Robin algorithm.
 * ============================================================
 */

const http  = require('http');
const httpProxy = require('http-proxy');

// ── Backend worker pool ──────────────────────────────────────
const WORKERS = [
  { id: 1, host: 'localhost', port: 5001 },
  { id: 2, host: 'localhost', port: 5002 },
  { id: 3, host: 'localhost', port: 5003 },
  { id: 4, host: 'localhost', port: 5004 },
  { id: 5, host: 'localhost', port: 5005 },
];

const LB_PORT = 5000;

// ── State ────────────────────────────────────────────────────
let currentIndex = 0;

// Per-worker stats
const stats = {};
WORKERS.forEach(w => {
  stats[w.port] = { requests: 0, errors: 0, active: 0 };
});

// ── Round-Robin selector ─────────────────────────────────────
function getNextWorker() {
  const worker = WORKERS[currentIndex % WORKERS.length];
  currentIndex++;
  return worker;
}

// ── Proxy ────────────────────────────────────────────────────
const proxy = httpProxy.createProxyServer({
  timeout: 10000,
  proxyTimeout: 10000,
});

proxy.on('error', (err, req, res) => {
  const port = res._port || '?';
  stats[port] && stats[port].errors++;
  stats[port] && stats[port].active--;
  console.error(`[LB] ❌ Proxy error → server:${port} — ${err.message}`);
  if (!res.headersSent) {
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Bad Gateway', message: 'Backend worker unavailable' }));
  }
});

proxy.on('proxyRes', (proxyRes, req, res) => {
  const port = res._port;
  if (port && stats[port]) {
    stats[port].active = Math.max(0, stats[port].active - 1);
  }
});

// ── Load Balancer Server ─────────────────────────────────────
const server = http.createServer((req, res) => {

  // ── Internal stats endpoint ──────────────────────────────
  if (req.url === '/__lb/stats') {
    const payload = {
      loadBalancer: { port: LB_PORT, algorithm: 'round-robin', totalRequests: currentIndex },
      workers: WORKERS.map(w => ({
        id:       `server${w.id}-backend`,
        port:     w.port,
        requests: stats[w.port].requests,
        errors:   stats[w.port].errors,
        active:   stats[w.port].active,
      })),
    };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(payload, null, 2));
  }

  // ── Route to next worker ─────────────────────────────────
  const worker = getNextWorker();
  const target = `http://${worker.host}:${worker.port}`;

  stats[worker.port].requests++;
  stats[worker.port].active++;
  res._port = worker.port; // attach for error/response handlers

  console.log(`[LB] → server${worker.id}-backend (port ${worker.port})  ${req.method} ${req.url}`);

  proxy.web(req, res, { target });
});

server.listen(LB_PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║       MEIPURATCHI LOAD BALANCER — READY          ║');
  console.log('╠══════════════════════════════════════════════════╣');
  console.log(`║  Listening on  →  http://localhost:${LB_PORT}          ║`);
  console.log('║  Algorithm     →  Round-Robin                    ║');
  console.log('║  Workers       →  5 (ports 5001–5005)            ║');
  console.log('║  Stats         →  http://localhost:5000/__lb/stats║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log('');
  WORKERS.forEach(w =>
    console.log(`  ✅ server${w.id}-backend  →  http://localhost:${w.port}`)
  );
  console.log('');
});
