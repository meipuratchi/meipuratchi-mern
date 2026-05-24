import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  FaSignOutAlt, FaUsers, FaGraduationCap, FaHandsHelping,
  FaSearch, FaFilter, FaEdit, FaCheckCircle, FaPaperPlane,
  FaTimes, FaGlobe, FaBell
} from 'react-icons/fa';
import './TeamDashboard.css';

import API_URL from '../config';
const API = `${API_URL}/api/admin`;

function getToken() { return localStorage.getItem('userToken'); }
const authH = () => ({ Authorization: `Bearer ${getToken()}` });

function Badge({ status }) {
  const map = {
    submitted:  { color: '#6c757d', bg: 'rgba(108,117,125,0.12)' },
    validating: { color: '#e09520', bg: 'rgba(245,166,35,0.15)' },
    verified:   { color: '#1976d2', bg: 'rgba(33,150,243,0.12)' },
    counseled:  { color: '#28a745', bg: 'rgba(40,167,69,0.12)' },
    approved:   { color: '#28a745', bg: 'rgba(40,167,69,0.12)' },
    rejected:   { color: '#dc3545', bg: 'rgba(220,53,69,0.12)' },
  };
  const s = map[status] || map.submitted;
  return <span className="td-badge" style={{ color: s.color, background: s.bg }}>{status}</span>;
}

// Quick action modal for updating status + sending message
function QuickActionModal({ user, onClose, onDone }) {
  const [status, setStatus]   = useState(user.status);
  const [msgText, setMsgText] = useState('');
  const [saving, setSaving]   = useState(false);

  const statusOptions = user.role === 'volunteer'
    ? ['submitted','validating','approved','rejected']
    : ['submitted','validating','verified','counseled'];

  const updateStatus = async () => {
    setSaving(true);
    try {
      await axios.patch(`${API}/users/${user._id}/status`, { status }, { headers: authH() });
      toast.success('Status updated');
      onDone();
    } catch { toast.error('Failed'); }
    finally { setSaving(false); }
  };

  const sendMsg = async () => {
    if (!msgText.trim()) return;
    setSaving(true);
    try {
      await axios.post(`${API}/users/${user._id}/message`, { text: msgText }, { headers: authH() });
      toast.success('Message sent to user');
      setMsgText('');
      onDone();
    } catch { toast.error('Failed'); }
    finally { setSaving(false); }
  };

  return (
    <div className="td-modal-overlay" onClick={onClose}>
      <div className="td-modal" onClick={e => e.stopPropagation()}>
        <div className="td-modal-header">
          <h3><FaEdit /> {user.name}</h3>
          <button onClick={onClose}><FaTimes /></button>
        </div>
        <div className="td-modal-body">
          <div className="td-user-info">
            <span>{user.email}</span>
            <span>{user.phone}</span>
            <span>{user.district || '—'}</span>
            <span>{user.careerInterest || user.skills || '—'}</span>
          </div>

          <div className="td-section">
            <label>Update Status</label>
            <div className="td-row">
              <select value={status} onChange={e => setStatus(e.target.value)}>
                {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button className="td-btn-primary" onClick={updateStatus} disabled={saving}>Update</button>
            </div>
          </div>

          <div className="td-section">
            <label>Send Message to User</label>
            <div className="td-row">
              <input value={msgText} onChange={e => setMsgText(e.target.value)} placeholder="Type a message..." />
              <button className="td-btn-primary" onClick={sendMsg} disabled={saving || !msgText.trim()}>
                <FaPaperPlane />
              </button>
            </div>
          </div>

          {user.messages?.length > 0 && (
            <div className="td-section">
              <label>Last Message</label>
              <div className="td-last-msg">
                {user.messages[user.messages.length - 1].text}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TeamDashboard() {
  const navigate  = useNavigate();
  const userInfo  = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const isViewOnly = userInfo.teamRole === 'view';
  const [users, setUsers]     = useState([]);
  const [total, setTotal]     = useState(0);
  const [search, setSearch]   = useState('');
  const [roleFilter, setRole] = useState('');
  const [statusFilter, setSt] = useState('');
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(false);

  // Redirect if not team
  useEffect(() => {
    const info = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (!info.role || info.role !== 'team') navigate('/team');
  }, [navigate]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const r = await axios.get(`${API}/users`, {
        headers: authH(),
        params: { page, limit: 15, search, role: roleFilter, status: statusFilter }
      });
      setUsers(r.data.data);
      setTotal(r.data.total);
    } catch (err) {
      if (err.response?.status === 401) { navigate('/team'); }
      else toast.error('Failed to load users');
    } finally { setLoading(false); }
  }, [page, search, roleFilter, statusFilter, navigate]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
    navigate('/team');
  };

  return (
    <div className="team-dashboard">
      {/* Header */}
      <header className="td-header">
        <div className="td-brand">
          <img src="/mei_logo.png" alt="Meipuratchi" />
          <div>
            <span className="td-title">Team Dashboard</span>
            <span className="td-dept">{userInfo.department || 'Meipuratchi'}</span>
          </div>
        </div>
        <div className="td-header-right">
          <Link to="/" className="td-site-link"><FaGlobe /> Browse Site</Link>
          <span className={`td-role-badge ${isViewOnly ? 'view' : 'manage'}`}>
            {isViewOnly ? '👁️ View Only' : '✏️ Can Chat & Manage'}
          </span>
          <span className="td-member-name">{userInfo.name}</span>
          <button className="td-logout" onClick={logout}><FaSignOutAlt /></button>
        </div>
      </header>

      <div className="td-body">
        {/* Permission banner */}
        {isViewOnly ? (
          <div className="td-permission-banner view-only">
            👁️ <strong>View-Only Access</strong> — You can see all users but cannot chat or update status. Contact admin to upgrade your role.
          </div>
        ) : (
          <div className="td-permission-banner manage">
            ✏️ <strong>Manage Access</strong> — You can view all users, chat with them, and update their status.
          </div>
        )}

        {/* Stats bar */}
        <div className="td-stats">
          <div className="td-stat"><FaUsers /><span>{total}</span><p>Total Users</p></div>
          <div className="td-stat"><FaGraduationCap /><span>{users.filter(u => u.role === 'student').length}</span><p>Students</p></div>
          <div className="td-stat"><FaHandsHelping /><span>{users.filter(u => u.role === 'volunteer').length}</span><p>Volunteers</p></div>
          <div className="td-stat"><FaBell /><span>{users.filter(u => u.status === 'submitted').length}</span><p>Pending</p></div>
        </div>

        {/* Toolbar */}
        <div className="td-toolbar">
          <div className="td-search">
            <FaSearch />
            <input placeholder="Search name, email, phone..." value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <select value={roleFilter} onChange={e => { setRole(e.target.value); setPage(1); }}>
            <option value="">All Roles</option>
            <option value="student">Students</option>
            <option value="volunteer">Volunteers</option>
          </select>
          <select value={statusFilter} onChange={e => { setSt(e.target.value); setPage(1); }}>
            <option value="">All Status</option>
            <option value="submitted">Submitted</option>
            <option value="validating">Validating</option>
            <option value="verified">Verified</option>
            <option value="counseled">Counseled</option>
            <option value="approved">Approved</option>
          </select>
          <span className="td-count">{total} records</span>
        </div>

        {/* Table */}
        {loading ? <div className="td-loading">Loading...</div> : (
          <div className="td-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th><th>Name</th><th>Phone</th><th>Role</th>
                  <th>District</th><th>Interest</th><th>Status</th><th>Messages</th><th>Date</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={10} className="td-empty">No users found</td></tr>
                ) : users.map((u, i) => (
                  <tr key={u._id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/user/${u._id}`)}>
                    <td>{(page-1)*15+i+1}</td>
                    <td>
                      <div className="td-name">{u.name}</div>
                      <div className="td-sub">{u.email}</div>
                    </td>
                    <td>{u.phone}</td>
                    <td><span className={`td-role td-role-${u.role}`}>{u.role}</span></td>
                    <td>{u.district || '—'}</td>
                    <td>{u.careerInterest || u.skills || '—'}</td>
                    <td><Badge status={u.status} /></td>
                    <td>
                      <span className="td-msg-count">{u.messages?.length || 0}</span>
                    </td>
                    <td>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                    <td onClick={e => e.stopPropagation()}>
                      <button className="td-edit-btn" onClick={() => navigate(`/user/${u._id}`)}>
                        <FaEdit /> {isViewOnly ? 'View' : 'Chat'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {total > 15 && (
          <div className="td-pagination">
            <button disabled={page === 1} onClick={() => setPage(p => p-1)}>← Prev</button>
            <span>Page {page} of {Math.ceil(total/15)}</span>
            <button disabled={page >= Math.ceil(total/15)} onClick={() => setPage(p => p+1)}>Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}
