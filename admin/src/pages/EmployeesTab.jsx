import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaPlus, FaTimes } from 'react-icons/fa';
import API_URL from '../config';
import './AdminTickets.css'; // reuse existing ticket styles

const E_API = `${API_URL}/api/employees`;
const h = key => ({ 'x-admin-key': key });

export default function EmployeesTab({ adminKey }) {
  const [employees, setEmployees]   = useState([]);
  const [loading, setLoading]       = useState(false);
  const [form, setForm]             = useState({ username: '', displayName: '', role: 'employee', department: '' });
  const [creating, setCreating]     = useState(false);
  const [newKeyInfo, setNewKeyInfo] = useState(null); // { username, authKey, displayName }

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
      setNewKeyInfo({
        username:    r.data.employee.username,
        authKey:     r.data.authKey,
        displayName: r.data.employee.displayName,
      });
      setForm({ username: '', displayName: '', role: 'employee', department: '' });
      toast.success('Employee created!');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create employee');
    } finally { setCreating(false); }
  };

  const regenerate = async (emp) => {
    if (!window.confirm(`Regenerate key for @${emp.username}? The old key will stop working.`)) return;
    try {
      const r = await axios.patch(`${E_API}/${emp._id}/regenerate-key`, {}, { headers: h(adminKey) });
      setNewKeyInfo({ username: emp.username, authKey: r.data.authKey, displayName: emp.displayName });
      toast.success('New key generated');
      load();
    } catch { toast.error('Failed to regenerate key'); }
  };

  const toggleActive = async (emp) => {
    try {
      await axios.patch(`${E_API}/${emp._id}`, { isActive: !emp.isActive }, { headers: h(adminKey) });
      toast.success(`Employee ${emp.isActive ? 'deactivated' : 'activated'}`);
      load();
    } catch { toast.error('Failed to update'); }
  };

  const del = async (emp) => {
    if (!window.confirm(`Delete employee @${emp.username}? This cannot be undone.`)) return;
    try {
      await axios.delete(`${E_API}/${emp._id}`, { headers: h(adminKey) });
      toast.success('Employee deleted');
      load();
    } catch { toast.error('Failed to delete'); }
  };

  const activeCount   = employees.filter(e => e.isActive).length;
  const inactiveCount = employees.length - activeCount;

  return (
    <div className="at-container">

      {/* ── Key Display Modal ── */}
      {newKeyInfo && (
        <div className="at-modal-overlay" onClick={() => setNewKeyInfo(null)}>
          <div className="at-modal at-key-modal" onClick={e => e.stopPropagation()}>
            <div className="at-modal-header">
              <h3>🔑 Employee Credentials</h3>
              <button className="at-modal-close" onClick={() => setNewKeyInfo(null)}><FaTimes /></button>
            </div>
            <p style={{ marginBottom: 16, color: '#4b5563', fontSize: '0.9rem' }}>
              Share these credentials with <strong>{newKeyInfo.displayName}</strong>:
            </p>
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
            <p className="at-key-note">
              ⚠️ Copy and share this key now — it won't be shown again in plain text.
            </p>
            <div className="at-modal-actions">
              <button
                className="at-btn-primary"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `Username: ${newKeyInfo.username}\nAuth Key: ${newKeyInfo.authKey}`
                  );
                  toast.success('Copied to clipboard!');
                }}
              >
                📋 Copy Credentials
              </button>
              <button className="at-btn-ghost" onClick={() => setNewKeyInfo(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Summary strip ── */}
      <div className="at-emp-summary">
        <div className="at-emp-summary-chip">
          <strong>{employees.length}</strong><span>Total</span>
        </div>
        <div className="at-emp-summary-chip active">
          <strong>{activeCount}</strong><span>Active</span>
        </div>
        <div className="at-emp-summary-chip inactive">
          <strong>{inactiveCount}</strong><span>Inactive</span>
        </div>
      </div>

      {/* ── Create Form ── */}
      <form className="at-form" onSubmit={create}>
        <h3 className="at-form-title">
          <FaPlus style={{ marginRight: 6 }} />
          Add New Employee
        </h3>
        <div className="at-form-row">
          <div className="at-form-field">
            <label>Username *</label>
            <input
              value={form.username}
              onChange={set('username')}
              placeholder="e.g. visaha.v"
              required
            />
          </div>
          <div className="at-form-field">
            <label>Display Name *</label>
            <input
              value={form.displayName}
              onChange={set('displayName')}
              placeholder="Full name"
              required
            />
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
            <input
              value={form.department}
              onChange={set('department')}
              placeholder="e.g. Technical, Counseling"
            />
          </div>
        </div>
        <button type="submit" className="at-btn-primary" disabled={creating}>
          {creating ? 'Creating…' : '🔑 Create & Generate Key'}
        </button>
      </form>

      {/* ── Employees List ── */}
      <h3 className="at-section-title" style={{ marginTop: 28 }}>All Employees</h3>

      {loading ? (
        <p className="at-loading">Loading employees…</p>
      ) : employees.length === 0 ? (
        <p className="at-empty">No employees yet. Add one above.</p>
      ) : (
        <div className="at-emp-list">
          {employees.map(emp => (
            <div key={emp._id} className={`at-emp-card ${!emp.isActive ? 'inactive' : ''}`}>
              <div className="at-emp-info">
                <div className="at-emp-avatar">{emp.displayName[0].toUpperCase()}</div>
                <div>
                  <p className="at-emp-name">
                    {emp.displayName}
                    <span
                      className="at-emp-role-chip"
                      style={{
                        background: emp.role === 'lead' ? 'rgba(25,36,65,.1)' : emp.role === 'senior' ? 'rgba(33,150,243,.1)' : 'rgba(40,167,69,.1)',
                        color:      emp.role === 'lead' ? '#192441'           : emp.role === 'senior' ? '#1565c0'              : '#1b5e20',
                      }}
                    >
                      {emp.role}
                    </span>
                    {!emp.isActive && <span className="at-emp-inactive-tag">inactive</span>}
                  </p>
                  <p className="at-emp-meta">
                    @{emp.username}
                    {emp.department && <> · {emp.department}</>}
                  </p>
                  {emp.lastLogin && (
                    <p className="at-emp-last">
                      Last login: {new Date(emp.lastLogin).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                    </p>
                  )}
                </div>
              </div>
              <div className="at-emp-actions">
                <button className="at-btn-sm" onClick={() => regenerate(emp)} title="Regenerate auth key">
                  🔄 Regen Key
                </button>
                <button className="at-btn-sm" onClick={() => toggleActive(emp)}>
                  {emp.isActive ? '⏸ Deactivate' : '▶ Activate'}
                </button>
                <button className="at-btn-sm danger" onClick={() => del(emp)} title="Delete employee">
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
