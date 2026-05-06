import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  FaUsers, FaHandsHelping, FaEnvelope, FaSignOutAlt,
  FaSearch, FaTrash, FaCheck, FaFilter,
  FaGraduationCap, FaCheckCircle,
  FaKey, FaTimes, FaEye, FaEyeSlash,
  FaPaperPlane, FaUserShield, FaEdit, FaPalette
} from 'react-icons/fa';
import './AdminDashboard.css';
import AdminCMS from './AdminCMS';

import API_URL from '../config';
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

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15, search, role: roleFilter, status: statusFilter };
      const r = await axios.get(`${API}/users`, { headers: headers(adminKey), params });
      setData(r.data.data);
      setTotal(r.data.total);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  }, [adminKey, page, search, roleFilter, statusFilter]);

  useEffect(() => { fetch(); }, [fetch]);

  const deleteUser = async id => {
    if (!window.confirm('Delete this user permanently?')) return;
    try {
      await axios.delete(`${API}/users/${id}`, { headers: headers(adminKey) });
      toast.success('User deleted');
      fetch();
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
                <th>#</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Role</th>
                <th>District</th>
                <th>Interest / Skills</th>
                <th>Status</th>
                <th>Messages</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan={10} className="empty-row">No users found</td></tr>
              ) : data.map((u, i) => (
                <tr key={u._id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/user/${u._id}`)}>
                  <td>{(page - 1) * 15 + i + 1}</td>
                  <td>
                    <div className="cell-name">{u.name}</div>
                    <div className="cell-sub">{u.email}</div>
                  </td>
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
                      <button className="icon-btn primary" title="Open Detail" onClick={() => navigate(`/user/${u._id}`)}>
                        <FaEdit />
                      </button>
                      <button className="icon-btn danger" title="Delete" onClick={() => deleteUser(u._id)}>
                        <FaTrash />
                      </button>
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
// ── Contacts Tab ───────────────────────────────────────────

// ── Contacts Tab ───────────────────────────────────────────
function ContactsTab({ adminKey }) {
  const [data, setData]         = useState([]);
  const [loading, setLoading]   = useState(false);
  const [expanded, setExpanded] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const r = await axios.get(`${API}/contacts`, { headers: headers(adminKey) });
      setData(r.data.data);
    } catch { toast.error('Failed to load contacts'); }
    finally { setLoading(false); }
  }, [adminKey]);

  useEffect(() => { fetch(); }, [fetch]);

  const markReplied = async id => {
    try {
      await axios.patch(`${API}/contacts/${id}/replied`, {}, { headers: headers(adminKey) });
      toast.success('Marked as replied');
      fetch();
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
                    <button className="btn btn-primary" style={{ marginTop: 12, padding: '8px 20px', fontSize: '0.85rem' }}
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

// ── Main Dashboard ─────────────────────────────────────────
export default function AdminDashboard() {
  const adminKey = useAdminKey();
  const navigate = useNavigate();
  const [stats, setStats]             = useState(null);
  const [activeTab, setActiveTab]     = useState('users');
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
    { id: 'users',    label: 'All Users',  icon: <FaUsers /> },
    { id: 'contacts', label: 'Messages',   icon: <FaEnvelope /> },
    { id: 'cms',      label: 'CMS / Pages',icon: <FaPalette /> },
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
            <StatCard icon={<FaGraduationCap />} label="Students"   value={stats.users.students}  sub={`${stats.pipeline.submitted} submitted`}  color="#192441" />
            <StatCard icon={<FaHandsHelping />}  label="Volunteers" value={stats.users.volunteers} sub={`${stats.pipeline.validating} validating`} color="#28a745" />
            <StatCard icon={<FaUsers />}         label="Team"       value={stats.users.team}       sub="Active members"                           color="#2196F3" />
            <StatCard icon={<FaEnvelope />}      label="Messages"   value={stats.contacts.total}   sub={`${stats.contacts.unreplied} unreplied`}  color="#f5a623" />
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

        {activeTab === 'users'    && <UsersTab    adminKey={adminKey} />}
        {activeTab === 'contacts' && <ContactsTab adminKey={adminKey} />}
        {activeTab === 'cms'      && <AdminCMS    adminKey={adminKey} />}
      </main>

      {showKeyModal && (
        <ChangeKeyModal adminKey={adminKey} onClose={() => setShowKeyModal(false)} />
      )}
    </div>
  );
}
