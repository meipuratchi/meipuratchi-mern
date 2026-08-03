import { useState, useCallback } from 'react';
import axios from 'axios';
import API_URL from '../config';
import './Tickets.css';

const API = `${API_URL}/api/tickets`;

const STATUS_COLOR = {
  'open':        { bg: '#fff8e0', color: '#b37000', border: '#f5a623' },
  'in-progress': { bg: '#e8f4ff', color: '#1565c0', border: '#42a5f5' },
  'resolved':    { bg: '#e8f9ee', color: '#1b5e20', border: '#43a047' },
  'closed':      { bg: '#f3f4f6', color: '#555f6d', border: '#b0b8c4' },
};
const PRIORITY_COLOR = {
  low:    '#43a047', medium: '#e09520', high: '#ef5350', urgent: '#c62828',
};
const TYPE_ICON = {
  support: '🛟', task: '📋', bug: '🐛', query: '❓', other: '📌',
};

function Badge({ label, style }) {
  return (
    <span className="tkt-badge" style={style}>{label}</span>
  );
}

function TicketCard({ ticket }) {
  const [open, setOpen] = useState(false);
  const sc = STATUS_COLOR[ticket.status] || STATUS_COLOR.open;

  return (
    <div className="tkt-card" style={{ borderLeftColor: sc.border }}>
      <div className="tkt-card-header" onClick={() => setOpen(v => !v)}>
        <div className="tkt-card-left">
          <span className="tkt-type-icon">{TYPE_ICON[ticket.type] || '📌'}</span>
          <div>
            <p className="tkt-title">{ticket.title}</p>
            <div className="tkt-meta">
              <Badge label={ticket.status} style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }} />
              <Badge label={ticket.priority} style={{ background: PRIORITY_COLOR[ticket.priority] + '18', color: PRIORITY_COLOR[ticket.priority], border: `1px solid ${PRIORITY_COLOR[ticket.priority]}44` }} />
              <span className="tkt-meta-text">{ticket.type}</span>
              {ticket.assignee && <span className="tkt-meta-text">→ <strong>{ticket.assignee}</strong></span>}
              {ticket.deadline && (
                <span className="tkt-meta-text">📅 {new Date(ticket.deadline).toLocaleDateString('en-IN')}</span>
              )}
            </div>
          </div>
        </div>
        <div className="tkt-card-right">
          <span className="tkt-date">{new Date(ticket.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
          <span className="tkt-chevron">{open ? '▲' : '▼'}</span>
        </div>
      </div>

      {open && (
        <div className="tkt-card-body">
          <p className="tkt-desc">{ticket.description}</p>
          <div className="tkt-details">
            <span><strong>Raised by:</strong> {ticket.raisedBy} <em>({ticket.raisedByType})</em></span>
            {ticket.email && <span><strong>Email:</strong> {ticket.email}</span>}
            {ticket.phone && <span><strong>Phone:</strong> {ticket.phone}</span>}
          </div>
          {ticket.note && (
            <div className="tkt-note">
              <strong>Note:</strong> {ticket.note}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Tickets() {
  const [key, setKey]         = useState('');
  const [authed, setAuthed]   = useState(false);
  const [authErr, setAuthErr] = useState('');
  const [checking, setChecking] = useState(false);

  const [tickets, setTickets]   = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading]   = useState(false);

  // Filters
  const [statusF, setStatusF]   = useState('');
  const [assigneeF, setAssigneeF] = useState('');
  const [typeF, setTypeF]       = useState('');
  const [searchQ, setSearchQ]   = useState('');

  // Verify org key then load tickets
  const verify = async (e) => {
    e.preventDefault();
    setChecking(true);
    setAuthErr('');
    try {
      await axios.post(`${API}/org/verify`, { key });
      setAuthed(true);
      loadTickets(key);
    } catch (err) {
      setAuthErr(err.response?.data?.message || 'Invalid key. Please check with your organisation admin.');
    } finally {
      setChecking(false);
    }
  };

  const loadTickets = useCallback(async (orgKey) => {
    setLoading(true);
    try {
      const r = await axios.get(`${API}/org`, {
        headers: { 'x-org-key': orgKey || key },
      });
      setTickets(r.data.tickets || []);
      setEmployees(r.data.employees || []);
    } catch {
      setAuthErr('Session expired. Please re-enter your key.');
      setAuthed(false);
    } finally {
      setLoading(false);
    }
  }, [key]);

  // Filtered list
  const filtered = tickets.filter(t => {
    if (statusF   && t.status   !== statusF)   return false;
    if (assigneeF && t.assignee !== assigneeF) return false;
    if (typeF     && t.type     !== typeF)     return false;
    if (searchQ) {
      const q = searchQ.toLowerCase();
      if (![t.title, t.raisedBy, t.assignee, t.description].join(' ').toLowerCase().includes(q)) return false;
    }
    return true;
  });

  // Stats
  const counts = { open: 0, 'in-progress': 0, resolved: 0, closed: 0 };
  tickets.forEach(t => { if (counts[t.status] !== undefined) counts[t.status]++; });

  if (!authed) {
    return (
      <div className="tkt-page">
        <div className="tkt-login-wrap">
          <div className="tkt-login-card">
            <div className="tkt-login-icon">🎫</div>
            <h1>Organisation Tickets</h1>
            <p>Enter your organisation access key to view all tickets.</p>
            <form onSubmit={verify} className="tkt-login-form">
              <input
                type="password"
                value={key}
                onChange={e => setKey(e.target.value)}
                placeholder="Enter organisation key…"
                required
                autoFocus
              />
              {authErr && <p className="tkt-login-err">{authErr}</p>}
              <button type="submit" disabled={checking}>
                {checking ? 'Verifying…' : 'Access Tickets →'}
              </button>
            </form>
            <p className="tkt-login-hint">Key provided by your organisation admin.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tkt-page">
      <div className="tkt-header">
        <div className="tkt-header-inner">
          <div>
            <h1>🎫 Organisation Tickets</h1>
            <p>{tickets.length} total tickets</p>
          </div>
          <button className="tkt-logout-btn" onClick={() => { setAuthed(false); setKey(''); setTickets([]); }}>
            🔒 Lock
          </button>
        </div>
      </div>

      <div className="tkt-body">
        {/* Stats row */}
        <div className="tkt-stats">
          {[
            { label: 'Open',        count: counts['open'],        color: '#f5a623' },
            { label: 'In Progress', count: counts['in-progress'], color: '#42a5f5' },
            { label: 'Resolved',    count: counts['resolved'],    color: '#43a047' },
            { label: 'Closed',      count: counts['closed'],      color: '#9e9e9e' },
          ].map(s => (
            <div className="tkt-stat-card" key={s.label} style={{ borderTopColor: s.color }}>
              <span className="tkt-stat-num" style={{ color: s.color }}>{s.count}</span>
              <span className="tkt-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="tkt-filters">
          <input
            className="tkt-search"
            type="text"
            placeholder="Search title, raised by, assignee…"
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
          />
          <select value={statusF} onChange={e => setStatusF(e.target.value)} className="tkt-select">
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select value={typeF} onChange={e => setTypeF(e.target.value)} className="tkt-select">
            <option value="">All Types</option>
            <option value="support">Support</option>
            <option value="task">Task</option>
            <option value="query">Query</option>
            <option value="bug">Bug</option>
            <option value="other">Other</option>
          </select>
          <select value={assigneeF} onChange={e => setAssigneeF(e.target.value)} className="tkt-select">
            <option value="">All Assignees</option>
            {employees.map(e => (
              <option key={e._id} value={e.username}>{e.displayName} (@{e.username})</option>
            ))}
          </select>
          <button className="tkt-refresh-btn" onClick={() => loadTickets(key)}>↻ Refresh</button>
        </div>

        {/* Results */}
        <div className="tkt-results-bar">
          <strong>{filtered.length}</strong> ticket{filtered.length !== 1 ? 's' : ''} shown
        </div>

        {loading ? (
          <div className="tkt-loading">Loading tickets…</div>
        ) : filtered.length === 0 ? (
          <div className="tkt-empty">No tickets match the current filters.</div>
        ) : (
          <div className="tkt-list">
            {filtered.map(t => <TicketCard key={t._id} ticket={t} />)}
          </div>
        )}
      </div>
    </div>
  );
}
