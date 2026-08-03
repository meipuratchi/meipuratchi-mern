import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import API_URL from '../config';
import './AdminTickets.css';

const T_API = `${API_URL}/api/tickets`;
const E_API = `${API_URL}/api/employees`;
const h = key => ({ 'x-admin-key': key });

const STATUS_COLORS = {
  open:        '#e09520',
  'in-progress': '#1976d2',
  resolved:    '#28a745',
  closed:      '#6c757d',
};
const PRIORITY_COLORS = {
  low: '#28a745', medium: '#e09520', high: '#ef5350', urgent: '#c62828',
};

function StatusBadge({ status }) {
  return (
    <span className="at-badge" style={{ background: STATUS_COLORS[status] + '22', color: STATUS_COLORS[status] }}>
      {status}
    </span>
  );
}
function PriorityBadge({ priority }) {
  return (
    <span className="at-badge" style={{ background: PRIORITY_COLORS[priority] + '22', color: PRIORITY_COLORS[priority] }}>
      {priority}
    </span>
  );
}

// ── Create Ticket Form ──────────────────────────────────────
function CreateTicketForm({ adminKey, employees, onCreated }) {
  const [form, setForm] = useState({
    title: '', description: '', assignee: '', deadline: '', priority: 'medium', type: 'task',
  });
  const [loading, setLoading] = useState(false);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return toast.error('Title and description required');
    setLoading(true);
    try {
      await axios.post(`${T_API}/admin`, form, { headers: h(adminKey) });
      toast.success('Ticket created');
      setForm({ title: '', description: '', assignee: '', deadline: '', priority: 'medium', type: 'task' });
      onCreated();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setLoading(false); }
  };

  return (
    <form className="at-form" onSubmit={submit}>
      <h3 className="at-form-title">➕ Create Task Ticket</h3>
      <div className="at-form-row">
        <div className="at-form-field">
          <label>Title *</label>
          <input value={form.title} onChange={set('title')} placeholder="Ticket title..." required />
        </div>
        <div className="at-form-field">
          <label>Type</label>
          <select value={form.type} onChange={set('type')}>
            <option value="task">Task</option>
            <option value="support">Support</option>
            <option value="bug">Bug</option>
            <option value="query">Query</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      <div className="at-form-field">
        <label>Description *</label>
        <textarea value={form.description} onChange={set('description')} placeholder="Describe the task..." rows={3} required />
      </div>
      <div className="at-form-row">
        <div className="at-form-field">
          <label>Assign To</label>
          <select value={form.assignee} onChange={set('assignee')}>
            <option value="">— Unassigned —</option>
            {employees.map(e => (
              <option key={e._id} value={e.username}>{e.displayName} (@{e.username})</option>
            ))}
          </select>
        </div>
        <div className="at-form-field">
          <label>Priority</label>
          <select value={form.priority} onChange={set('priority')}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <div className="at-form-field">
          <label>Deadline</label>
          <input type="date" value={form.deadline} onChange={set('deadline')} />
        </div>
      </div>
      <button type="submit" className="at-btn-primary" disabled={loading}>
        {loading ? 'Creating...' : 'Create Ticket'}
      </button>
    </form>
  );
}

// ── Ticket Edit Modal ───────────────────────────────────────
function EditModal({ ticket, employees, adminKey, onClose, onSaved }) {
  const [form, setForm] = useState({
    status:   ticket.status,
    assignee: ticket.assignee || '',
    priority: ticket.priority,
    note:     ticket.note || '',
    deadline: ticket.deadline ? ticket.deadline.split('T')[0] : '',
  });
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    setLoading(true);
    try {
      await axios.patch(`${T_API}/admin/${ticket._id}`, form, { headers: h(adminKey) });
      toast.success('Updated');
      onSaved();
      onClose();
    } catch { toast.error('Failed to update'); }
    finally { setLoading(false); }
  };

  return (
    <div className="at-modal-overlay" onClick={onClose}>
      <div className="at-modal" onClick={e => e.stopPropagation()}>
        <div className="at-modal-header">
          <h3>Edit Ticket</h3>
          <button onClick={onClose} className="at-modal-close">✕</button>
        </div>
        <p className="at-modal-sub"><strong>{ticket.title}</strong></p>
        <div className="at-form-row">
          <div className="at-form-field">
            <label>Status</label>
            <select value={form.status} onChange={set('status')}>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div className="at-form-field">
            <label>Priority</label>
            <select value={form.priority} onChange={set('priority')}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
        <div className="at-form-row">
          <div className="at-form-field">
            <label>Assign To</label>
            <select value={form.assignee} onChange={set('assignee')}>
              <option value="">— Unassigned —</option>
              {employees.map(e => (
                <option key={e._id} value={e.username}>{e.displayName} (@{e.username})</option>
              ))}
            </select>
          </div>
          <div className="at-form-field">
            <label>Deadline</label>
            <input type="date" value={form.deadline} onChange={set('deadline')} />
          </div>
        </div>
        <div className="at-form-field">
          <label>Internal Note</label>
          <textarea value={form.note} onChange={set('note')} rows={2} placeholder="Resolution notes..." />
        </div>
        <div className="at-modal-actions">
          <button onClick={onClose} className="at-btn-ghost">Cancel</button>
          <button onClick={save} className="at-btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Tickets List ────────────────────────────────────────────
function TicketsList({ adminKey, employees }) {
  const [tickets, setTickets]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [statusF, setStatusF]     = useState('');
  const [typeF, setTypeF]         = useState('');
  const [search, setSearch]       = useState('');
  const [editing, setEditing]     = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusF) params.status = statusF;
      if (typeF)   params.type   = typeF;
      const r = await axios.get(`${T_API}/admin`, { headers: h(adminKey), params });
      setTickets(r.data.tickets || []);
    } catch { toast.error('Failed to load tickets'); }
    finally { setLoading(false); }
  }, [adminKey, statusF, typeF]);

  useEffect(() => { load(); }, [load]);

  const del = async (id) => {
    if (!confirm('Delete this ticket?')) return;
    try {
      await axios.delete(`${T_API}/admin/${id}`, { headers: h(adminKey) });
      toast.success('Deleted');
      load();
    } catch { toast.error('Failed'); }
  };

  const filtered = tickets.filter(t =>
    !search || t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.raisedBy.toLowerCase().includes(search.toLowerCase()) ||
    (t.assignee || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {editing && (
        <EditModal ticket={editing} employees={employees} adminKey={adminKey}
          onClose={() => setEditing(null)} onSaved={load} />
      )}
      {/* Filters */}
      <div className="at-filters">
        <input className="at-search" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search title, raised by, assignee..." />
        <select value={statusF} onChange={e => setStatusF(e.target.value)} className="at-select">
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
        <select value={typeF} onChange={e => setTypeF(e.target.value)} className="at-select">
          <option value="">All Types</option>
          <option value="task">Task</option>
          <option value="support">Support</option>
          <option value="query">Query</option>
          <option value="bug">Bug</option>
          <option value="other">Other</option>
        </select>
      </div>

      {loading ? (
        <p className="at-loading">Loading tickets...</p>
      ) : filtered.length === 0 ? (
        <p className="at-empty">No tickets found.</p>
      ) : (
        <div className="at-tickets-list">
          {filtered.map(t => (
            <div key={t._id} className="at-ticket-card">
              <div className="at-ticket-top">
                <div className="at-ticket-meta-row">
                  <StatusBadge status={t.status} />
                  <PriorityBadge priority={t.priority} />
                  <span className="at-type-tag">{t.type}</span>
                </div>
                <div className="at-ticket-actions">
                  <button className="at-btn-icon" onClick={() => setEditing(t)} title="Edit">✏️</button>
                  <button className="at-btn-icon danger" onClick={() => del(t._id)} title="Delete">🗑️</button>
                </div>
              </div>
              <h4 className="at-ticket-title">{t.title}</h4>
              <p className="at-ticket-desc">{t.description}</p>
              <div className="at-ticket-footer">
                <span>👤 {t.raisedBy} <em>({t.raisedByType})</em></span>
                {t.assignee && <span>→ <strong>{t.assignee}</strong></span>}
                {t.deadline && <span>📅 {new Date(t.deadline).toLocaleDateString('en-IN')}</span>}
                <span className="at-ticket-date">{new Date(t.createdAt).toLocaleDateString('en-IN')}</span>
              </div>
              {t.note && <p className="at-ticket-note">📝 {t.note}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Employees Tab ───────────────────────────────────────────
function EmployeesTab({ adminKey }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading]     = useState(false);
  const [form, setForm]           = useState({ username: '', displayName: '', role: 'employee', department: '' });
  const [creating, setCreating]   = useState(false);
  const [newKeyInfo, setNewKeyInfo] = useState(null); // { username, authKey }

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await axios.get(E_API, { headers: h(adminKey) });
      setEmployees(r.data.employees || []);
    } catch { toast.error('Failed to load employees'); }
    finally { setLoading(false); }
  }, [adminKey]);

  useEffect(() => { load(); }, [load]);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const create = async (e) => {
    e.preventDefault();
    if (!form.username || !form.displayName) return toast.error('Username and name required');
    setCreating(true);
    try {
      const r = await axios.post(E_API, form, { headers: h(adminKey) });
      setNewKeyInfo({ username: r.data.employee.username, authKey: r.data.authKey, displayName: r.data.employee.displayName });
      setForm({ username: '', displayName: '', role: 'employee', department: '' });
      toast.success('Employee created!');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setCreating(false); }
  };

  const regenerate = async (emp) => {
    if (!confirm(`Regenerate key for @${emp.username}? The old key will stop working.`)) return;
    try {
      const r = await axios.patch(`${E_API}/${emp._id}/regenerate-key`, {}, { headers: h(adminKey) });
      setNewKeyInfo({ username: emp.username, authKey: r.data.authKey, displayName: emp.displayName });
      toast.success('New key generated');
      load();
    } catch { toast.error('Failed'); }
  };

  const toggleActive = async (emp) => {
    try {
      await axios.patch(`${E_API}/${emp._id}`, { isActive: !emp.isActive }, { headers: h(adminKey) });
      toast.success(`Employee ${emp.isActive ? 'deactivated' : 'activated'}`);
      load();
    } catch { toast.error('Failed'); }
  };

  const del = async (emp) => {
    if (!confirm(`Delete employee @${emp.username}?`)) return;
    try {
      await axios.delete(`${E_API}/${emp._id}`, { headers: h(adminKey) });
      toast.success('Deleted');
      load();
    } catch { toast.error('Failed'); }
  };

  return (
    <div>
      {/* Key Display Modal */}
      {newKeyInfo && (
        <div className="at-modal-overlay" onClick={() => setNewKeyInfo(null)}>
          <div className="at-modal at-key-modal" onClick={e => e.stopPropagation()}>
            <h3>🔑 Employee Credentials</h3>
            <p>Share these credentials with <strong>{newKeyInfo.displayName}</strong>:</p>
            <div className="at-key-box">
              <div className="at-key-row">
                <span>Username:</span>
                <code>{newKeyInfo.username}</code>
              </div>
              <div className="at-key-row">
                <span>Auth Key:</span>
                <code className="at-key-value">{newKeyInfo.authKey}</code>
              </div>
            </div>
            <p className="at-key-note">⚠️ Copy and share this key now — it won't be shown again in plaintext.</p>
            <div className="at-modal-actions">
              <button className="at-btn-primary" onClick={() => {
                navigator.clipboard.writeText(`Username: ${newKeyInfo.username}\nAuth Key: ${newKeyInfo.authKey}`);
                toast.success('Copied to clipboard!');
              }}>📋 Copy</button>
              <button className="at-btn-ghost" onClick={() => setNewKeyInfo(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Form */}
      <form className="at-form" onSubmit={create}>
        <h3 className="at-form-title">➕ Add Employee</h3>
        <div className="at-form-row">
          <div className="at-form-field">
            <label>Username *</label>
            <input value={form.username} onChange={set('username')} placeholder="e.g. ravi.k" required />
          </div>
          <div className="at-form-field">
            <label>Display Name *</label>
            <input value={form.displayName} onChange={set('displayName')} placeholder="Full name" required />
          </div>
          <div className="at-form-field">
            <label>Role</label>
            <select value={form.role} onChange={set('role')}>
              <option value="employee">Employee</option>
              <option value="senior">Senior</option>
              <option value="lead">Lead</option>
            </select>
          </div>
          <div className="at-form-field">
            <label>Department</label>
            <input value={form.department} onChange={set('department')} placeholder="e.g. Counseling" />
          </div>
        </div>
        <button type="submit" className="at-btn-primary" disabled={creating}>
          {creating ? 'Creating...' : 'Create & Generate Key'}
        </button>
      </form>

      {/* Employees List */}
      {loading ? <p className="at-loading">Loading...</p> : (
        <div className="at-emp-list">
          {employees.length === 0 && <p className="at-empty">No employees yet.</p>}
          {employees.map(emp => (
            <div key={emp._id} className={`at-emp-card ${!emp.isActive ? 'inactive' : ''}`}>
              <div className="at-emp-info">
                <div className="at-emp-avatar">{emp.displayName[0].toUpperCase()}</div>
                <div>
                  <p className="at-emp-name">{emp.displayName}
                    {!emp.isActive && <span className="at-emp-inactive-tag"> (inactive)</span>}
                  </p>
                  <p className="at-emp-meta">@{emp.username} · {emp.role}{emp.department ? ` · ${emp.department}` : ''}</p>
                  {emp.lastLogin && <p className="at-emp-last">Last login: {new Date(emp.lastLogin).toLocaleDateString('en-IN')}</p>}
                </div>
              </div>
              <div className="at-emp-actions">
                <button className="at-btn-sm" onClick={() => regenerate(emp)}>🔄 Regen Key</button>
                <button className="at-btn-sm" onClick={() => toggleActive(emp)}>
                  {emp.isActive ? '⏸ Deactivate' : '▶ Activate'}
                </button>
                <button className="at-btn-sm danger" onClick={() => del(emp)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Export ─────────────────────────────────────────────
export default function AdminTickets({ adminKey }) {
  const [subTab, setSubTab]       = useState('tickets');
  const [employees, setEmployees] = useState([]);

  // Load employees for both sub-tabs
  const loadEmployees = useCallback(async () => {
    try {
      const r = await axios.get(E_API, { headers: h(adminKey) });
      setEmployees(r.data.employees || []);
    } catch { /* ignore */ }
  }, [adminKey]);

  useEffect(() => { loadEmployees(); }, [loadEmployees]);

  return (
    <div className="at-container">
      <div className="at-subtabs">
        <button className={`at-subtab ${subTab === 'tickets' ? 'active' : ''}`} onClick={() => setSubTab('tickets')}>
          🎫 Tickets
        </button>
        <button className={`at-subtab ${subTab === 'employees' ? 'active' : ''}`} onClick={() => setSubTab('employees')}>
          👥 Employees
        </button>
      </div>

      {subTab === 'tickets' && (
        <div>
          <CreateTicketForm adminKey={adminKey} employees={employees} onCreated={loadEmployees} />
          <hr className="at-divider" />
          <h3 className="at-section-title">All Tickets</h3>
          <TicketsList adminKey={adminKey} employees={employees} />
        </div>
      )}

      {subTab === 'employees' && (
        <EmployeesTab adminKey={adminKey} />
      )}
    </div>
  );
}
