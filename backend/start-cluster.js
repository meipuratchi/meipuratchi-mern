/**
 * ============================================================
 *  MEIPURATCHI — Cluster Starter
 *  Spawns 5 backend workers (ports 5001–5005) then starts
 *  the load balancer on port 5000.
 *  Run with:  node start-cluster.js
 * ============================================================
 */

const { spawn } = require('child_process');
const path = require('path');

const WORKERS = [
  { id: 1, port: 5001 },
  { id: 2, port: 5002 },
  { id: 3, port: 5003 },
  { id: 4, port: 5004 },
  { id: 5, port: 5005 },
];

const STARTUP_DELAY_MS = 800; // wait between each worker start
const processes = [];

function color(code, text) {
  return `\x1b[${code}m${text}\x1b[0m`;
}

const COLORS = [34, 35, 36, 33, 32]; // blue, magenta, cyan, yellow, green

function spawnWorker(worker, index) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const env = {
        ...process.env,
        PORT: String(worker.port),
        WORKER_ID: String(worker.id),
        WORKER_NAME: `server${worker.id}-backend`,
      };

      const proc = spawn('node', ['server.js'], {
        cwd: path.resolve(__dirname),
        env,
        stdio: ['ignore', 'pipe', 'pipe'],
      });

      processes.push(proc);

      const tag = color(COLORS[index], `[server${worker.id}-backend:${worker.port}]`);

      proc.stdout.on('data', (data) => {
        data.toString().trim().split('\n').forEach(line => {
          console.log(`${tag} ${line}`);
        });
      });

      proc.stderr.on('data', (data) => {
        data.toString().trim().split('\n').forEach(line => {
          console.error(`${tag} ${color(31, line)}`);
        });
      });

      proc.on('exit', (code) => {
        console.log(`${tag} ${color(31, `exited with code ${code}`)}`);
      });

      console.log(`${tag} Starting on port ${worker.port}...`);
      resolve();
    }, index * STARTUP_DELAY_MS);
  });
}

async function startAll() {
  console.log('');
  console.log(color(1, '╔══════════════════════════════════════════════════╗'));
  console.log(color(1, '║     MEIPURATCHI — Starting Cluster               ║'));
  console.log(color(1, '╚══════════════════════════════════════════════════╝'));
  console.log('');

  // Start all workers
  for (let i = 0; i < WORKERS.length; i++) {
    await spawnWorker(WORKERS[i], i);
  }

  // Wait for all workers to be ready, then start LB
  const lbDelay = WORKERS.length * STARTUP_DELAY_MS + 2000;
  console.log('');
  console.log(color(33, `[cluster] Waiting ${lbDelay / 1000}s for workers to connect to MongoDB...`));

  setTimeout(() => {
    console.log('');
    console.log(color(33, '[cluster] Starting Load Balancer on port 5000...'));
    console.log('');

    const lb = spawn('node', ['loadbalancer.js'], {
      cwd: path.resolve(__dirname),
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    processes.push(lb);

    lb.stdout.on('data', (data) => {
      data.toString().trim().split('\n').forEach(line => {
        console.log(color(37, `[load-balancer] ${line}`));
      });
    });

    lb.stderr.on('data', (data) => {
      data.toString().trim().split('\n').forEach(line => {
        console.error(color(31, `[load-balancer] ${line}`));
      });
    });

    lb.on('exit', (code) => {
      console.log(color(31, `[load-balancer] exited with code ${code}`));
    });

  }, lbDelay);
}

// Graceful shutdown
function shutdown() {
  console.log('');
  console.log(color(33, '[cluster] Shutting down all processes...'));
  processes.forEach(p => p.kill('SIGTERM'));
  setTimeout(() => process.exit(0), 1000);
}

process.on('SIGINT',  shutdown);
process.on('SIGTERM', shutdown);

startAll();
