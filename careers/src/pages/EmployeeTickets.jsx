import { useState, useCallback } from 'react';
import axios from 'axios';
import API_URL from '../config';
import './EmployeeTickets.css';

const API = `${API_URL}/api/tickets`;

const STATUS_COLOR = {
  'open':        { bg: '#fff8e0', color: '#b37000', border: '#f5a623' },
  'in-progress': { bg: '#e8f4ff', color: '#1565c0', border: '#42a5f5' },
  'resolved':    { bg: '#e8f9ee', color: '#1b5e20', border: '#43a047' },
  'closed':      { bg: '#f3f4f6', color: '#555f6d', border: '#b0b8c4' },
};
const TYPE_ICON = { support: '🛟', task: '📋', bug: '🐛', query: '❓', other: '📌' };

function TicketItem({ ticket, onUpdate }) {
  const [open, setOpen]     = useState(false);
  const [status, setStatus] = useState(ticket.status);
  const [note, setNote]     = useState(ticket.note || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
  const sc = STATUS_COLOR[status] || STATUS_COLOR.open;

  const save = async () => {
    setSaving(true);
    try {
      await axios.patch(`${API}/employee/${ticket._id}`, { status, note }, {
        headers: {
          username: localStorage.getItem('emp_username'),
          authkey:  localStorage.getItem('emp_authkey'),
        },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      onUpdate();
    } catch {
      alert('Failed to update. Please try again.');
    } finally { setSaving(false); }
  };

  return (
    <div className="et-ticket" style={{ borderLeftColor: sc.border }}>
      <div className="et-ticket-head" onClick={() => setOpen(v => !v)}>
        <div className="et-ticket-left">
          <span className="et-type-icon">{TYPE_ICON[ticket.type] || '📌'}</span>
          <div>
            <p className="et-title">{ticket.title}</p>
            <div className="et-meta">
              <span className="et-badge" style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                {ticket.status}
              </span>
              <span className="et-meta-text">{ticket.type}</span>
              {ticket.deadline && (
                <span className="et-deadline">
                  📅 {new Date(ticket.deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="et-ticket-right">
          <span className="et-date">{new Date(ticket.createdAt).toLocaleDateString('en-IN')}</span>
          <span className="et-chevron">{open ? '▲' : '▼'}</span>
        </div>
      </div>

      {open && (
        <div className="et-ticket-body">
          <p className="et-desc">{ticket.description}</p>
          <div className="et-update-row">
            <div className="et-field">
              <label>Update Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)}>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div className="et-field et-field-grow">
              <label>Resolution Note</label>
              <input
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Add a note about this ticket…"
              />
            </div>
            <button className="et-save-btn" onClick={save} disabled={saving}>
              {saving ? 'Saving…' : saved ? '✅ Saved' : 'Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EmployeeTickets() {
  const [username, setUsername] = useState('');
  const [authKey, setAuthKey]   = useState('');
  const [employee, setEmployee] = useState(null);
  const [tickets, setTickets]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [loginErr, setLoginErr] = useState('');
  const [statusF, setStatusF]   = useState('');

  const login = async (e) => {
    e.preventDefault();
    setLoginErr('');
    setLoading(true);
    try {
      const r = await axios.post(`${API}/employee/login`, { username, authKey });
      const emp = r.data.employee;
      setEmployee(emp);
      localStorage.setItem('emp_username', emp.username);
      localStorage.setItem('emp_authkey',  authKey);
      loadTickets(emp.username, authKey);
    } catch (err) {
      setLoginErr(err.response?.data?.message || 'Invalid username or key');
    } finally { setLoading(false); }
  };

  const loadTickets = useCallback(async (uname, key) => {
    try {
      const r = await axios.get(`${API}/employee/mine`, {
        headers: {
          username: uname || localStorage.getItem('emp_username'),
          authkey:  key   || localStorage.getItem('emp_authkey'),
        },
      });
      setTickets(r.data.tickets || []);
    } catch {
      setLoginErr('Session expired. Please log in again.');
      setEmployee(null);
    }
  }, []);

  const logout = () => {
    setEmployee(null);
    setTickets([]);
    localStorage.removeItem('emp_username');
    localStorage.removeItem('emp_authkey');
  };

  const filtered = statusF ? tickets.filter(t => t.status === statusF) : tickets;
  const counts = { open: 0, 'in-progress': 0, resolved: 0, closed: 0 };
  tickets.forEach(t => { if (counts[t.status] !== undefined) counts[t.status]++; });

  // ── Login screen ──
  if (!employee) {
    return (
      <div className="et-page">
        <div className="et-login-wrap">
          <div className="et-login-card">
            <img src="/mei_logo.png" alt="Meipuratchi" className="et-logo" />
            <h1>Employee Portal</h1>
            <p>Login with your Meipuratchi employee credentials to view and manage your assigned tickets.</p>
            <form onSubmit={login} className="et-login-form">
              <div className="et-field">
                <label>Username</label>
                <input
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="your.username"
                  required autoFocus
                />
              </div>
              <div className="et-field">
                <label>Auth Key</label>
                <input
                  type="password"
                  value={authKey}
                  onChange={e => setAuthKey(e.target.value)}
                  placeholder="Your auth key (from admin)"
                  required
                />
              </div>
              {loginErr && <p className="et-login-err">{loginErr}</p>}
              <button type="submit" disabled={loading}>
                {loading ? 'Logging in…' : 'Login →'}
              </button>
            </form>
            <p className="et-login-hint">
              Credentials provided by your organisation admin after onboarding.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Tickets dashboard ──
  return (
    <div className="et-page">
      {/* Header */}
      <div className="et-header">
        <div className="et-header-inner">
          <div className="et-header-user">
            <div className="et-avatar">{employee.displayName?.[0]?.toUpperCase() || 'E'}</div>
            <div>
              <p className="et-emp-name">{employee.displayName}</p>
              <p className="et-emp-meta">@{employee.username}{employee.department ? ` · ${employee.department}` : ''}</p>
            </div>
          </div>
          <button className="et-logout-btn" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="et-body">
        {/* Stats */}
        <div className="et-stats">
          {[
            { label: 'Open',        count: counts['open'],        color: '#f5a623' },
            { label: 'In Progress', count: counts['in-progress'], color: '#42a5f5' },
            { label: 'Resolved',    count: counts['resolved'],    color: '#43a047' },
            { label: 'Closed',      count: counts['closed'],      color: '#9e9e9e' },
          ].map(s => (
            <div className="et-stat-card" key={s.label} style={{ borderTopColor: s.color }}>
              <span className="et-stat-num" style={{ color: s.color }}>{s.count}</span>
              <span className="et-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="et-filter-row">
          <h2>My Assigned Tickets ({tickets.length})</h2>
          <div className="et-filter-right">
            <select value={statusF} onChange={e => setStatusF(e.target.value)} className="et-select">
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <button className="et-refresh-btn" onClick={() => loadTickets()}>↻ Refresh</button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="et-empty">
            {tickets.length === 0
              ? 'No tickets assigned to you yet.'
              : 'No tickets match the selected filter.'}
          </div>
        ) : (
          <div className="et-list">
            {filtered.map(t => (
              <TicketItem key={t._id} ticket={t} onUpdate={() => loadTickets()} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
