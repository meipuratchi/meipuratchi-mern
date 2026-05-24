import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaSchool,
  FaMapMarkerAlt, FaGraduationCap, FaHandsHelping, FaUsers,
  FaPaperPlane, FaEdit, FaSave, FaUserShield, FaCheckCircle,
  FaClock, FaTrash, FaGlobe
} from 'react-icons/fa';
import './UserDetail.css';

import API_URL from '../config';
const API = `${API_URL}/api/admin`;

// Works for both admin (x-admin-key) and team (Bearer token)
function getHeaders() {
  const adminKey = localStorage.getItem('adminKey');
  if (adminKey) return { 'x-admin-key': adminKey };
  const token = localStorage.getItem('userToken');
  return { Authorization: `Bearer ${token}` };
}

const isAdmin = () => !!localStorage.getItem('adminKey');

const STATUS_COLORS = {
  submitted:  { color: '#6c757d', bg: 'rgba(108,117,125,0.12)' },
  validating: { color: '#e09520', bg: 'rgba(245,166,35,0.15)' },
  verified:   { color: '#1976d2', bg: 'rgba(33,150,243,0.12)' },
  counseled:  { color: '#28a745', bg: 'rgba(40,167,69,0.12)' },
  approved:   { color: '#28a745', bg: 'rgba(40,167,69,0.12)' },
  rejected:   { color: '#dc3545', bg: 'rgba(220,53,69,0.12)' },
};

function StatusBadge({ status }) {
  const s = STATUS_COLORS[status] || STATUS_COLORS.submitted;
  return (
    <span className="ud-status-badge" style={{ color: s.color, background: s.bg }}>
      {status}
    </span>
  );
}

const PIPELINE_STUDENT  = ['submitted', 'validating', 'verified', 'counseled'];
const PIPELINE_VOLUNTEER = ['submitted', 'validating', 'approved'];

function Pipeline({ status, role }) {
  const steps = role === 'volunteer' ? PIPELINE_VOLUNTEER : PIPELINE_STUDENT;
  const idx   = steps.indexOf(status);
  return (
    <div className="ud-pipeline">
      {steps.map((s, i) => (
        <div key={s} className={`ud-pip-step ${i < idx ? 'done' : ''} ${i === idx ? 'current' : ''}`}>
          <div className="ud-pip-circle">
            {i < idx ? <FaCheckCircle /> : <span>{i + 1}</span>}
          </div>
          <span>{s}</span>
          {i < steps.length - 1 && <div className="ud-pip-line" />}
        </div>
      ))}
    </div>
  );
}

export default function UserDetail() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit state
  const [status, setStatus]   = useState('');
  const [role, setRole]       = useState('');
  const [dept, setDept]       = useState('');
  const [notes, setNotes]     = useState('');
  const [saving, setSaving]   = useState(false);

  // Chat
  const [msgText, setMsgText] = useState('');
  const [sending, setSending] = useState(false);
  const chatBottomRef = useRef(null);

  const backPath = isAdmin() ? '/admin/dashboard' : '/team/dashboard';
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const isTeamMember = !isAdmin(); // All team members have read-only access

  const fetchUser = useCallback(async () => {
    try {
      const r = await axios.get(`${API}/users/${id}`, { headers: getHeaders() });
      const u = r.data.data;
      setUser(u);
      setStatus(u.status);
      setRole(u.role);
      setDept(u.department || '');
      setNotes(u.adminNotes || '');
    } catch (err) {
      if (err.response?.status === 401) navigate(isAdmin() ? '/admin' : '/team');
      else toast.error('Failed to load user');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [user?.messages]);

  const saveStatus = async () => {
    if (isTeamMember) {
      toast.error('Team members have view-only access. Only admin can update status.');
      return;
    }
    setSaving(true);
    try {
      await axios.patch(`${API}/users/${id}/status`, { status, adminNotes: notes }, { headers: getHeaders() });
      toast.success('Status updated');
      fetchUser();
    } catch { toast.error('Failed to update status'); }
    finally { setSaving(false); }
  };

  const saveRole = async () => {
    if (!isAdmin()) { toast.error('Only admin can change roles'); return; }
    setSaving(true);
    try {
      await axios.patch(`${API}/users/${id}/role`, { role, department: dept }, { headers: getHeaders() });
      toast.success('Role updated');
      fetchUser();
    } catch { toast.error('Failed to update role'); }
    finally { setSaving(false); }
  };

  const sendMessage = async e => {
    e.preventDefault();
    if (isTeamMember) {
      toast.error('Team members cannot send messages. Only admin can chat with students.');
      return;
    }
    if (!msgText.trim()) return;
    setSending(true);
    try {
      await axios.post(`${API}/users/${id}/message`, { text: msgText }, { headers: getHeaders() });
      setMsgText('');
      fetchUser();
    } catch { toast.error('Failed to send message'); }
    finally { setSending(false); }
  };

  const deleteUser = async () => {
    if (!isAdmin()) { toast.error('Only admin can delete users'); return; }
    if (!window.confirm(`Delete ${user.name} permanently? This cannot be undone.`)) return;
    try {
      await axios.delete(`${API}/users/${id}`, { headers: getHeaders() });
      toast.success('User deleted');
      navigate(backPath);
    } catch { toast.error('Delete failed'); }
  };

  if (loading) return (
    <div className="ud-loading">
      <div className="ud-spinner" />
      Loading user details...
    </div>
  );

  if (!user) return <div className="ud-loading">User not found</div>;

  const statusOptions = user.role === 'volunteer'
    ? ['submitted', 'validating', 'approved', 'rejected']
    : ['submitted', 'validating', 'verified', 'counseled'];

  const roleIcon = { student: <FaGraduationCap />, volunteer: <FaHandsHelping />, team: <FaUsers /> }[user.role];

  return (
    <div className="ud-page">
      {/* Top bar */}
      <div className="ud-topbar">
        <button className="ud-back" onClick={() => navigate(backPath)}>
          <FaArrowLeft /> Back to Dashboard
        </button>
        <div className="ud-topbar-right">
          <Link to="/" className="ud-site-link"><FaGlobe /> Browse Site</Link>
          {isAdmin() && (
            <button className="ud-delete-btn" onClick={deleteUser}>
              <FaTrash /> Delete User
            </button>
          )}
        </div>
      </div>

      <div className="ud-layout">
        {/* View-only banner for team members */}
        {isTeamMember && (
          <div className="ud-viewonly-banner" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '16px 24px',
            margin: '0 0 20px 0',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
          }}>
            <span style={{ fontSize: '24px' }}>👁️</span>
            <div>
              <strong style={{ display: 'block', fontSize: '16px', marginBottom: '4px' }}>
                Team Member - View Only Access
              </strong>
              <p style={{ margin: 0, fontSize: '14px', opacity: 0.95 }}>
                You can view all student information in the database, but you cannot update status, send messages, or make any changes. Only admin has full access.
              </p>
            </div>
          </div>
        )}
        {/* ── LEFT: Profile + Status + Role ── */}
        <div className="ud-left">

          {/* Profile card */}
          <div className="ud-card ud-profile-card">
            <div className="ud-avatar">{user.name[0].toUpperCase()}</div>
            <h2>{user.name}</h2>
            <div className="ud-role-tag">
              {roleIcon} {user.role}
              {user.department && <span className="ud-dept">· {user.department}</span>}
            </div>
            <StatusBadge status={user.status} />
            <p className="ud-joined">Joined {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>

          {/* Info */}
          <div className="ud-card">
            <h3 className="ud-card-title"><FaUser /> Profile Info</h3>
            <div className="ud-info-list">
              <div className="ud-info-row"><FaEnvelope /><div><span>Email</span><p>{user.email}</p></div></div>
              <div className="ud-info-row"><FaPhone /><div><span>Phone</span><p>{user.phone}</p></div></div>
              {user.school    && <div className="ud-info-row"><FaSchool /><div><span>School</span><p>{user.school}</p></div></div>}
              {user.district  && <div className="ud-info-row"><FaMapMarkerAlt /><div><span>District</span><p>{user.district}</p></div></div>}
              {user.standard  && <div className="ud-info-row"><FaGraduationCap /><div><span>Standard</span><p>{user.standard}</p></div></div>}
              {user.stream    && <div className="ud-info-row"><span>📚</span><div><span>Stream</span><p>{user.stream}</p></div></div>}
              {user.careerInterest && <div className="ud-info-row"><span>🎯</span><div><span>Career Interest</span><p>{user.careerInterest}</p></div></div>}
              {user.skills    && <div className="ud-info-row"><span>💡</span><div><span>Skills</span><p>{user.skills}</p></div></div>}
            </div>
          </div>

          {/* Status update */}
          <div className="ud-card">
            <h3 className="ud-card-title"><FaEdit /> Update Status</h3>
            <Pipeline status={user.status} role={user.role} />
            <div className="ud-form-group">
              <label>Change Status To</label>
              <select value={status} onChange={e => setStatus(e.target.value)}>
                {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="ud-form-group">
              <label>Internal Notes (not shown to user)</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder={isTeamMember ? "View only - cannot edit notes" : "Add notes about this student..."}
                rows={3}
                disabled={isTeamMember}
              />
            </div>
            <button className="ud-btn-primary" onClick={saveStatus} disabled={saving || isTeamMember}>
              {isTeamMember ? '🔒 View Only' : (saving ? 'Saving...' : <><FaSave /> Save Status</>)}
            </button>
          </div>

          {/* Role management — admin only */}
          {isAdmin() && (
            <div className="ud-card">
              <h3 className="ud-card-title"><FaUserShield /> Assign Role</h3>
              <div className="ud-form-group">
                <label>Role</label>
                <select value={role} onChange={e => setRole(e.target.value)}>
                  <option value="student">Student</option>
                  <option value="volunteer">Volunteer</option>
                  <option value="team">Team Member</option>
                </select>
              </div>
              {role === 'team' && (
                <div className="ud-form-group">
                  <label>Department</label>
                  <select value={dept} onChange={e => setDept(e.target.value)}>
                    <option value="">Select Department</option>
                    {['Design','Social Media','Counseling','Technical','Language','Innovation','Student Support','Coordination'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              )}
              <button className="ud-btn-primary" onClick={saveRole} disabled={saving}>
                <FaUserShield /> {saving ? 'Saving...' : 'Assign Role'}
              </button>
            </div>
          )}
        </div>

        {/* ── RIGHT: WhatsApp-style Chat (Admin Only) ── */}
        <div className="ud-right">
          <div className="ud-chat-card">

            {/* Sticky chat header with user name */}
            <div className="ud-chat-header">
              <div className="ud-chat-header-avatar">{user.name[0].toUpperCase()}</div>
              <div className="ud-chat-header-info">
                <div className="ud-chat-header-name">{user.name}</div>
                <div className="ud-chat-header-sub">{user.phone} · {user.district || user.email}</div>
              </div>
              <span className="ud-msg-count">{user.messages?.length || 0}</span>
            </div>

            {/* Team member chat disabled notice */}
            {isTeamMember && (
              <div style={{
                background: '#fff3cd',
                border: '1px solid #ffc107',
                borderRadius: '8px',
                padding: '12px 16px',
                margin: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span style={{ fontSize: '20px' }}>🔒</span>
                <p style={{ margin: 0, fontSize: '14px', color: '#856404' }}>
                  <strong>Chat Disabled for Team Members</strong><br />
                  You can view message history below, but only admin can send messages to students.
                </p>
              </div>
            )}

            {/* Scrollable messages */}
            <div className="ud-chat-body">
              {(!user.messages || user.messages.length === 0) ? (
                <div className="ud-no-msgs">
                  {isTeamMember ? 'No messages in history.' : 'No messages yet. Send the first one below.'}
                </div>
              ) : (
                user.messages.map((m, i) => (
                  <div key={i} className={`ud-msg ${m.from === 'admin' ? 'ud-msg-admin' : 'ud-msg-user'}`}>
                    <div className="ud-msg-from">
                      {m.from === 'admin' ? '🛡️ Admin' : `👤 ${user.name}`}
                    </div>
                    <div className="ud-msg-text">{m.text}</div>
                    <div className="ud-msg-time">
                      {new Date(m.sentAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                      {!m.read && m.from === 'admin' && <span className="ud-unread-dot">✓</span>}
                    </div>
                  </div>
                ))
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Quick message templates - Admin only */}
            {!isTeamMember && (
              <div className="ud-quick-msgs">
                <p>Quick:</p>
                <div className="ud-quick-btns">
                  {[
                    'We have received your request and will review it within 48 hours.',
                    'Your profile is currently being validated by our team.',
                    '✅ Your profile has been verified! Our counselor will contact you soon.',
                    '🎉 Your counseling session is complete. Best wishes for your future!',
                    'Please provide your 10th/12th mark sheet for verification.',
                  ].map((msg, i) => (
                    <button key={i} className="ud-quick-btn" onClick={() => setMsgText(msg)}>
                      {msg.length > 45 ? msg.slice(0, 45) + '…' : msg}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input bar - Admin only */}
            {!isTeamMember && (
              <div className="ud-chat-input-area">
                <form className="ud-chat-input" onSubmit={sendMessage}>
                  <textarea
                    value={msgText}
                    onChange={e => setMsgText(e.target.value)}
                    placeholder={`Message ${user.name}…`}
                    rows={1}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(e); } }}
                  />
                  <button type="submit" className="ud-chat-send-btn"
                    disabled={sending || !msgText.trim()}
                    title="Send">
                    <FaPaperPlane />
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
