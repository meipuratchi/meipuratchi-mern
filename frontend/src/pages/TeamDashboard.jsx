import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  FaSignOutAlt, FaUsers, FaGraduationCap, FaHandsHelping,
  FaSearch, FaEdit, FaGlobe, FaBell, FaComments
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

export default function TeamDashboard() {
  const navigate  = useNavigate();
  const userInfo  = JSON.parse(localStorage.getItem('userInfo') || '{}');
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
          <span className="td-member-name">👋 {userInfo.name}</span>
          <button className="td-logout" onClick={logout}><FaSignOutAlt /></button>
        </div>
      </header>

      <div className="td-body">
        {/* Welcome banner */}
        <div style={{
          background: 'linear-gradient(135deg, #192441 0%, #2a3a6b 100%)',
          color: 'white',
          padding: '16px 24px',
          margin: '0 0 24px 0',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 4px 20px rgba(25, 36, 65, 0.3)'
        }}>
          <span style={{ fontSize: '28px' }}>🎓</span>
          <div>
            <strong style={{ display: 'block', fontSize: '17px', marginBottom: '4px' }}>
              Welcome, {userInfo.name}! ({userInfo.department || 'Team'})
            </strong>
            <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
              You can view all students, chat with them, and update their counseling status. Click any student to manage them.
            </p>
          </div>
        </div>

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
                  <th>District</th><th>Interest</th><th>Status</th><th>Msgs</th><th>Date</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={10} className="td-empty">No users found</td></tr>
                ) : users.map((u, i) => (
                  <tr key={u._id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/user/${u._id}`)}>
                    <td>{(page-1)*15+i+1}</td>
                    <td data-label="Name">
                      <div className="td-name">{u.name}</div>
                      <div className="td-sub">{u.email}</div>
                    </td>
                    <td data-label="Phone">{u.phone}</td>
                    <td data-label="Role"><span className={`td-role td-role-${u.role}`}>{u.role}</span></td>
                    <td data-label="District">{u.district || '—'}</td>
                    <td data-label="Interest">{u.careerInterest || u.skills || '—'}</td>
                    <td data-label="Status"><Badge status={u.status} /></td>
                    <td data-label="Msgs">
                      <span className="td-msg-count">{u.messages?.length || 0}</span>
                    </td>
                    <td data-label="Date">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                    <td data-label="Action" onClick={e => e.stopPropagation()}>
                      <button className="td-edit-btn" onClick={() => navigate(`/user/${u._id}`)}>
                        <FaComments /> Counsel
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
