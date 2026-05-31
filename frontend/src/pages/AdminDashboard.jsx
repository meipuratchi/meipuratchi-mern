import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  FaUsers, FaHandsHelping, FaEnvelope, FaSignOutAlt,
  FaSearch, FaTrash, FaCheck, FaFilter,
  FaGraduationCap, FaCheckCircle,
  FaKey, FaTimes, FaEye, FaEyeSlash,
  FaUserShield, FaEdit, FaPalette,
  FaClipboardList, FaHeart, FaBullhorn
} from 'react-icons/fa';
import './AdminDashboard.css';
import AdminCMS from './AdminCMS';

import API_URL from '../config';
import { broadcastEmail } from '../api';
const API = `${API_URL}/api/admin`;
const headers = key => ({ 'x-admin-key': key });

function useAdminKey() {
  const navigate = useNavigate();
  const key = localStorage.getItem('adminKey');
  useEffect(() => { if (!key) navigate('/admin'); }, [key, navigate]);
  return key;
}

// ── Stat Card ──────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="stat-card" style={{ borderTopColor: color }}>
      <div className="stat-icon" style={{ background: color }}>{icon}</div>
      <div className="stat-body">
        <p className="stat-label">{label}</p>
        <h3 className="stat-value">{value}</h3>
        {sub && <p className="stat-sub">{sub}</p>}
      </div>
    </div>
  );
}

// ── Status Badge ───────────────────────────────────────────
function Badge({ status }) {
  const map = {
    submitted:  { color: '#6c757d', bg: 'rgba(108,117,125,0.12)' },
    validating: { color: '#e09520', bg: 'rgba(245,166,35,0.15)' },
    verified:   { color: '#1976d2', bg: 'rgba(33,150,243,0.12)' },
    counseled:  { color: '#28a745', bg: 'rgba(40,167,69,0.12)' },
    approved:   { color: '#28a745', bg: 'rgba(40,167,69,0.12)' },
    rejected:   { color: '#dc3545', bg: 'rgba(220,53,69,0.12)' },
    pending:    { color: '#e09520', bg: 'rgba(245,166,35,0.15)' },
  };
  const s = map[status] || map.pending;
  return (
    <span className="badge-pill" style={{ color: s.color, background: s.bg }}>
      {status}
    </span>
  );
}

// ── Users Tab ──────────────────────────────────────────────
function UsersTab({ adminKey }) {
  const navigate = useNavigate();
  const [data, setData]       = useState([]);
  const [total, setTotal]     = useState(0);
  const [search, setSearch]   = useState('');
  const [roleFilter, setRoleFilter]     = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15, search, role: roleFilter, status: statusFilter };
      const r = await axios.get(`${API}/users`, { headers: headers(adminKey), params });
      setData(r.data.data);
      setTotal(r.data.total);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  }, [adminKey, page, search, roleFilter, statusFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const deleteUser = async id => {
    if (!window.confirm('Delete this user permanently?')) return;
    try {
      await axios.delete(`${API}/users/${id}`, { headers: headers(adminKey) });
      toast.success('User deleted');
      fetchUsers();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div className="tab-content-area">
      <div className="tab-toolbar">
        <div className="search-box">
          <FaSearch />
          <input placeholder="Search name, email, phone, school..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <div className="filter-box">
          <FaFilter />
          <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }}>
            <option value="">All Roles</option>
            <option value="student">Students</option>
            <option value="volunteer">Volunteers</option>
            <option value="team">Team</option>
          </select>
        </div>
        <div className="filter-box">
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="">All Status</option>
            <option value="submitted">Submitted</option>
            <option value="validating">Validating</option>
            <option value="verified">Verified</option>
            <option value="counseled">Counseled</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <span className="total-count">{total} users</span>
      </div>
      {loading ? <div className="loading-state">Loading...</div> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th><th>Name</th><th>Phone</th><th>Role</th>
                <th>District</th><th>Interest / Skills</th><th>Status</th>
                <th>Msgs</th><th>Date</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan={10} className="empty-row">No users found</td></tr>
              ) : data.map((u, i) => (
                <tr key={u._id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/user/${u._id}`)}>
                  <td>{(page - 1) * 15 + i + 1}</td>
                  <td><div className="cell-name">{u.name}</div><div className="cell-sub">{u.email}</div></td>
                  <td>{u.phone}</td>
                  <td>
                    <span className={`role-chip role-${u.role}`}>{u.role}</span>
                    {u.department && <div className="cell-sub">{u.department}</div>}
                  </td>
                  <td>{u.district || '—'}</td>
                  <td className="cell-wrap">{u.careerInterest || u.skills || '—'}</td>
                  <td><Badge status={u.status} /></td>
                  <td><span className="msg-count">{u.messages?.length || 0}</span></td>
                  <td>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                  <td onClick={e => e.stopPropagation()}>
                    <div className="action-btns">
                      <button className="icon-btn primary" title="Open Detail" onClick={() => navigate(`/user/${u._id}`)}><FaEdit /></button>
                      <button className="icon-btn danger" title="Delete" onClick={() => deleteUser(u._id)}><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {total > 15 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
          <span>Page {page} of {Math.ceil(total / 15)}</span>
          <button disabled={page >= Math.ceil(total / 15)} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}
    </div>
  );
}

// ── Volunteers Tab ─────────────────────────────────────────
function VolunteersTab({ adminKey }) {
  const [data, setData]       = useState([]);
  const [total, setTotal]     = useState(0);
  const [search, setSearch]   = useState('');
  const [statusFilter, setSt] = useState('');
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchVols = useCallback(async () => {
    setLoading(true);
    try {
      const r = await axios.get(`${API}/volunteers`, {
        headers: headers(adminKey),
        params: { page, limit: 15, search, status: statusFilter }
      });
      setData(r.data.data);
      setTotal(r.data.total);
    } catch { toast.error('Failed to load volunteer applications'); }
    finally { setLoading(false); }
  }, [adminKey, page, search, statusFilter]);

  useEffect(() => { fetchVols(); }, [fetchVols]);

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${API}/volunteers/${id}/status`, { status }, { headers: headers(adminKey) });
      toast.success('Status updated');
      fetchVols();
    } catch { toast.error('Update failed'); }
  };

  const deleteVol = async id => {
    if (!window.confirm('Delete this volunteer application?')) return;
    try {
      await axios.delete(`${API}/volunteers/${id}`, { headers: headers(adminKey) });
      toast.success('Deleted');
      fetchVols();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div className="tab-content-area">
      <div className="tab-toolbar">
        <div className="search-box">
          <FaSearch />
          <input placeholder="Search name, email, phone, department..."
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <div className="filter-box">
          <FaFilter />
          <select value={statusFilter} onChange={e => { setSt(e.target.value); setPage(1); }}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <span className="total-count">{total} applications</span>
      </div>
      {loading ? <div className="loading-state">Loading...</div> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th><th>Name</th><th>Phone</th><th>Department</th>
                <th>Skills</th><th>Message</th><th>Status</th><th>Date</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan={9} className="empty-row">No volunteer applications found</td></tr>
              ) : data.map((v, i) => (
                <tr key={v._id}>
                  <td>{(page - 1) * 15 + i + 1}</td>
                  <td><div className="cell-name">{v.name}</div><div className="cell-sub">{v.email}</div></td>
                  <td>{v.phone}</td>
                  <td><span className="dept-chip">{v.department}</span></td>
                  <td className="cell-wrap">{v.skills || '—'}</td>
                  <td className="cell-wrap">{v.message ? v.message.slice(0, 60) + (v.message.length > 60 ? '…' : '') : '—'}</td>
                  <td>
                    <select className="status-select" value={v.status}
                      onChange={e => updateStatus(v._id, e.target.value)}>
                      <option value="pending">pending</option>
                      <option value="approved">approved</option>
                      <option value="rejected">rejected</option>
                    </select>
                  </td>
                  <td>{new Date(v.createdAt).toLocaleDateString('en-IN')}</td>
                  <td>
                    <button className="icon-btn danger" title="Delete" onClick={() => deleteVol(v._id)}><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {total > 15 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
          <span>Page {page} of {Math.ceil(total / 15)}</span>
          <button disabled={page >= Math.ceil(total / 15)} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}
    </div>
  );
}

// ── Registrations Tab ──────────────────────────────────────
function RegistrationsTab({ adminKey }) {
  const [data, setData]       = useState([]);
  const [total, setTotal]     = useState(0);
  const [search, setSearch]   = useState('');
  const [statusFilter, setSt] = useState('');
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchRegs = useCallback(async () => {
    setLoading(true);
    try {
      const r = await axios.get(`${API}/registrations`, {
        headers: headers(adminKey),
        params: { page, limit: 15, search, status: statusFilter }
      });
      setData(r.data.data);
      setTotal(r.data.total);
    } catch { toast.error('Failed to load registrations'); }
    finally { setLoading(false); }
  }, [adminKey, page, search, statusFilter]);

  useEffect(() => { fetchRegs(); }, [fetchRegs]);

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${API}/registrations/${id}/status`, { status }, { headers: headers(adminKey) });
      toast.success('Status updated');
      fetchRegs();
    } catch { toast.error('Update failed'); }
  };

  const deleteReg = async id => {
    if (!window.confirm('Delete this registration?')) return;
    try {
      await axios.delete(`${API}/registrations/${id}`, { headers: headers(adminKey) });
      toast.success('Deleted');
      fetchRegs();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div className="tab-content-area">
      <div className="tab-toolbar">
        <div className="search-box">
          <FaSearch />
          <input placeholder="Search name, email, phone, school, district..."
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <div className="filter-box">
          <FaFilter />
          <select value={statusFilter} onChange={e => { setSt(e.target.value); setPage(1); }}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="counseled">Counseled</option>
          </select>
        </div>
        <span className="total-count">{total} registrations</span>
      </div>
      {loading ? <div className="loading-state">Loading...</div> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th><th>Name</th><th>Phone</th><th>School</th>
                <th>District</th><th>Standard</th><th>Career Interest</th>
                <th>Proof</th><th>Status</th><th>Date</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan={11} className="empty-row">No registrations found</td></tr>
              ) : data.map((r, i) => (
                <tr key={r._id}>
                  <td>{(page - 1) * 15 + i + 1}</td>
                  <td><div className="cell-name">{r.name}</div><div className="cell-sub">{r.email}</div></td>
                  <td>{r.phone}</td>
                  <td className="cell-wrap">{r.school || '—'}</td>
                  <td>{r.district || '—'}</td>
                  <td>{r.standard || '—'}</td>
                  <td className="cell-wrap">{r.careerInterest || '—'}</td>
                  <td>
                    {r.proofFileUrl
                      ? <a href={r.proofFileUrl} target="_blank" rel="noreferrer"
                          className="icon-btn success" title="View proof"
                          style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FaEye />
                        </a>
                      : <span style={{ color: '#aaa', fontSize: '0.8rem' }}>—</span>
                    }
                  </td>
                  <td>
                    <select className="status-select" value={r.status}
                      onChange={e => updateStatus(r._id, e.target.value)}>
                      <option value="pending">pending</option>
                      <option value="verified">verified</option>
                      <option value="counseled">counseled</option>
                    </select>
                  </td>
                  <td>{new Date(r.createdAt).toLocaleDateString('en-IN')}</td>
                  <td>
                    <button className="icon-btn danger" title="Delete" onClick={() => deleteReg(r._id)}><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {total > 15 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
          <span>Page {page} of {Math.ceil(total / 15)}</span>
          <button disabled={page >= Math.ceil(total / 15)} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}
    </div>
  );
}

// ── Contacts Tab ───────────────────────────────────────────
function ContactsTab({ adminKey }) {
  const [data, setData]         = useState([]);
  const [loading, setLoading]   = useState(false);
  const [expanded, setExpanded] = useState(null);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const r = await axios.get(`${API}/contacts`, { headers: headers(adminKey) });
      setData(r.data.data);
    } catch { toast.error('Failed to load contacts'); }
    finally { setLoading(false); }
  }, [adminKey]);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  const markReplied = async id => {
    try {
      await axios.patch(`${API}/contacts/${id}/replied`, {}, { headers: headers(adminKey) });
      toast.success('Marked as replied');
      fetchContacts();
    } catch { toast.error('Update failed'); }
  };

  return (
    <div className="tab-content-area">
      <div className="tab-toolbar">
        <span className="total-count">{data.length} messages &nbsp;|&nbsp; {data.filter(d => !d.replied).length} unreplied</span>
      </div>
      {loading ? <div className="loading-state">Loading...</div> : (
        <div className="contacts-list">
          {data.length === 0 ? <div className="empty-row">No messages yet</div> : data.map((c, i) => (
            <div key={c._id} className={`contact-card ${!c.replied ? 'unread' : ''}`}>
              <div className="contact-card-header" onClick={() => setExpanded(expanded === c._id ? null : c._id)}>
                <div className="contact-meta">
                  <span className="contact-num">{i + 1}</span>
                  <div>
                    <div className="cell-name">{c.name} {!c.replied && <span className="new-badge">NEW</span>}</div>
                    <div className="cell-sub">{c.email} {c.phone && `· ${c.phone}`}</div>
                  </div>
                </div>
                <div className="contact-right">
                  <span className="contact-subject">{c.subject}</span>
                  <span className="contact-date">{new Date(c.createdAt).toLocaleDateString('en-IN')}</span>
                </div>
              </div>
              {expanded === c._id && (
                <div className="contact-body">
                  <p>{c.message}</p>
                  {!c.replied && (
                    <button className="btn btn-primary"
                      style={{ marginTop: 12, padding: '8px 20px', fontSize: '0.85rem' }}
                      onClick={() => markReplied(c._id)}>
                      <FaCheck /> Mark as Replied
                    </button>
                  )}
                  {c.replied && <span className="replied-tag"><FaCheckCircle /> Replied</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Change Key Modal ───────────────────────────────────────
function ChangeKeyModal({ adminKey, onClose }) {
  const navigate = useNavigate();
  const [currentKey, setCurrentKey]   = useState('');
  const [newKey, setNewKey]           = useState('');
  const [confirmKey, setConfirmKey]   = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew]         = useState(false);
  const [loading, setLoading]         = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (currentKey !== adminKey) { toast.error('Current key is incorrect'); return; }
    if (newKey.length < 6)       { toast.error('New key must be at least 6 characters'); return; }
    if (newKey !== confirmKey)   { toast.error('New keys do not match'); return; }
    setLoading(true);
    try {
      await axios.post(`${API}/change-key`, { newKey }, { headers: headers(adminKey) });
      localStorage.setItem('adminKey', newKey);
      toast.success('Admin key updated! Please log in again.');
      onClose();
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update key');
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3><FaKey /> Change Admin Key</h3>
          <button className="modal-close" onClick={onClose}><FaTimes /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Current Key</label>
            <div className="input-eye">
              <input type={showCurrent ? 'text' : 'password'} value={currentKey}
                onChange={e => setCurrentKey(e.target.value)} placeholder="Enter current admin key" required />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)}>
                {showCurrent ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>New Key</label>
            <div className="input-eye">
              <input type={showNew ? 'text' : 'password'} value={newKey}
                onChange={e => setNewKey(e.target.value)} placeholder="Min 6 characters" required />
              <button type="button" onClick={() => setShowNew(!showNew)}>
                {showNew ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>Confirm New Key</label>
            <input type="password" value={confirmKey}
              onChange={e => setConfirmKey(e.target.value)} placeholder="Re-enter new key" required />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Updating...' : <><FaKey /> Update Key</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Broadcast Tab ─────────────────────────────────────────
function BroadcastTab({ adminKey }) {
  const [subject, setSubject]     = useState('');
  const [message, setMessage]     = useState('');
  const [targetRole, setTarget]   = useState('all');
  const [sending, setSending]     = useState(false);
  const [result, setResult]       = useState(null);

  const handleSend = async e => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) { toast.error('Subject and message required'); return; }
    if (!window.confirm(`Send broadcast email to all ${targetRole === 'all' ? 'users' : targetRole + 's'}? This cannot be undone.`)) return;
    setSending(true);
    setResult(null);
    try {
      // Use axios directly with admin key header
      const res = await axios.post(`${API}/broadcast`, { subject, message, targetRole }, { headers: headers(adminKey) });
      setResult(res.data);
      toast.success(`Broadcast sent! ${res.data.stats?.sent || 0} emails delivered.`);
      setSubject(''); setMessage('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Broadcast failed');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="tab-content-area">
      <div className="tab-toolbar">
        <span style={{ fontWeight: 600, color: 'var(--primary)' }}>📢 Broadcast Email to Users</span>
        <span className="total-count">Send announcements, updates, or instructions to all or specific user groups</span>
      </div>
      <div style={{ padding: '24px' }}>
        <form onSubmit={handleSend}>
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontWeight: 600, color: 'var(--primary)', marginBottom: 8, fontSize: '0.9rem' }}>
              Target Audience
            </label>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {[
                { value: 'all',       label: '👥 All Users' },
                { value: 'student',   label: '🎓 Students Only' },
                { value: 'volunteer', label: '🤝 Volunteers Only' },
                { value: 'team',      label: '🛡️ Team Only' },
              ].map(opt => (
                <label key={opt.value} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 18px', border: `2px solid ${targetRole === opt.value ? 'var(--primary)' : '#e9ecef'}`,
                  borderRadius: 10, cursor: 'pointer', fontSize: '0.88rem', fontWeight: 500,
                  background: targetRole === opt.value ? 'rgba(25,36,65,0.06)' : 'white',
                  color: targetRole === opt.value ? 'var(--primary)' : 'var(--dark)',
                }}>
                  <input type="radio" name="targetRole" value={opt.value}
                    checked={targetRole === opt.value} onChange={e => setTarget(e.target.value)}
                    style={{ display: 'none' }} />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontWeight: 600, color: 'var(--primary)', marginBottom: 8, fontSize: '0.9rem' }}>
              Email Subject *
            </label>
            <input value={subject} onChange={e => setSubject(e.target.value)}
              placeholder="e.g. Important Update from Meipuratchi Team"
              style={{ width: '100%', padding: '12px 16px', border: '2px solid #e9ecef', borderRadius: 8, fontSize: '0.95rem', fontFamily: 'Poppins, sans-serif', outline: 'none' }}
              required />
          </div>

          <div className="form-group" style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontWeight: 600, color: 'var(--primary)', marginBottom: 8, fontSize: '0.9rem' }}>
              Message *
            </label>
            <textarea value={message} onChange={e => setMessage(e.target.value)}
              placeholder="Write your announcement or update here. This will be sent as both an in-app message and an email to all selected users."
              rows={6}
              style={{ width: '100%', padding: '12px 16px', border: '2px solid #e9ecef', borderRadius: 8, fontSize: '0.9rem', fontFamily: 'Poppins, sans-serif', outline: 'none', resize: 'vertical' }}
              required />
            <p style={{ fontSize: '0.78rem', color: 'var(--gray)', marginTop: 6 }}>
              This message will also appear as an in-app notification in each user's portal chat.
            </p>
          </div>

          <button type="submit" className="btn btn-primary" disabled={sending}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 28px' }}>
            <FaBullhorn /> {sending ? 'Sending...' : `Send Broadcast to ${targetRole === 'all' ? 'All Users' : targetRole + 's'}`}
          </button>
        </form>

        {result && (
          <div style={{ marginTop: 20, padding: '16px 20px', background: 'rgba(40,167,69,0.08)', border: '1px solid rgba(40,167,69,0.3)', borderRadius: 10 }}>
            <p style={{ margin: 0, fontWeight: 700, color: '#28a745' }}>✅ Broadcast Complete</p>
            <p style={{ margin: '6px 0 0', fontSize: '0.88rem', color: 'var(--gray)' }}>
              Sent: {result.stats?.sent} · Failed: {result.stats?.failed} · Total: {result.stats?.total}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────
export default function AdminDashboard() {  const adminKey = useAdminKey();
  const navigate = useNavigate();
  const [stats, setStats]               = useState(null);
  const [activeTab, setActiveTab]       = useState('users');
  const [showKeyModal, setShowKeyModal] = useState(false);

  useEffect(() => {
    if (!adminKey) return;
    axios.get(`${API}/stats`, { headers: headers(adminKey) })
      .then(r => setStats(r.data.data))
      .catch(() => toast.error('Failed to load stats'));
  }, [adminKey]);

  const logout = () => {
    localStorage.removeItem('adminKey');
    navigate('/admin');
  };

  const tabs = [
    { id: 'users',         label: 'Users',        icon: <FaUsers /> },
    { id: 'volunteers',    label: 'Volunteers',   icon: <FaHeart /> },
    { id: 'registrations', label: 'Registrations',icon: <FaClipboardList /> },
    { id: 'contacts',      label: 'Messages',     icon: <FaEnvelope /> },
    { id: 'broadcast',     label: 'Broadcast',    icon: <FaBullhorn /> },
    { id: 'cms',           label: 'CMS',          icon: <FaPalette /> },
  ];

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <img src="/mei_logo.png" alt="Meipuratchi" />
          <span>Admin Panel</span>
        </div>
        <nav className="sidebar-nav">
          {tabs.map(t => (
            <button key={t.id} className={`nav-item ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}>
              {t.icon} {t.label}
              {t.id === 'contacts' && stats?.contacts?.unreplied > 0 && (
                <span className="nav-badge">{stats.contacts.unreplied}</span>
              )}
              {t.id === 'volunteers' && stats?.volunteerApps?.pending > 0 && (
                <span className="nav-badge">{stats.volunteerApps.pending}</span>
              )}
              {t.id === 'registrations' && stats?.registrations?.pending > 0 && (
                <span className="nav-badge">{stats.registrations.pending}</span>
              )}
            </button>
          ))}
        </nav>
        <button className="change-key-btn" onClick={() => setShowKeyModal(true)}>
          <FaKey /> Change Key
        </button>
        <button className="logout-btn" onClick={logout}><FaSignOutAlt /> Logout</button>
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1>Dashboard</h1>
            <p>மெய் புரட்சி — Admin Control Panel</p>
          </div>
          <div className="header-db-info">
            <span>🗄️ MeiPuratchi</span>
            <span>📁 dbteam</span>
          </div>
        </div>

        {stats && (
          <div className="stats-row">
            <StatCard icon={<FaGraduationCap />} label="Portal Users"    value={stats.users.total}
              sub={`${stats.users.students} students`} color="#192441" />
            <StatCard icon={<FaHeart />}          label="Vol. Applications" value={stats.volunteerApps?.total ?? '—'}
              sub={`${stats.volunteerApps?.pending ?? 0} pending`} color="#e74c3c" />
            <StatCard icon={<FaClipboardList />}  label="Registrations"  value={stats.registrations?.total ?? '—'}
              sub={`${stats.registrations?.pending ?? 0} pending`} color="#9b59b6" />
            <StatCard icon={<FaEnvelope />}       label="Messages"       value={stats.contacts.total}
              sub={`${stats.contacts.unreplied} unreplied`} color="#f5a623" />
          </div>
        )}

        <div className="admin-tabs">
          {tabs.map(t => (
            <button key={t.id} className={`tab-btn ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {activeTab === 'users'         && <UsersTab         adminKey={adminKey} />}
        {activeTab === 'volunteers'    && <VolunteersTab    adminKey={adminKey} />}
        {activeTab === 'registrations' && <RegistrationsTab adminKey={adminKey} />}
        {activeTab === 'contacts'      && <ContactsTab      adminKey={adminKey} />}
        {activeTab === 'broadcast'     && <BroadcastTab     adminKey={adminKey} />}
        {activeTab === 'cms'           && <AdminCMS         adminKey={adminKey} />}
      </main>

      {showKeyModal && (
        <ChangeKeyModal adminKey={adminKey} onClose={() => setShowKeyModal(false)} />
      )}
    </div>
  );
}
