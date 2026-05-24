import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaSignOutAlt, FaUser, FaEnvelope, FaPhone, FaSchool,
  FaPaperPlane, FaBell, FaCheckCircle, FaClock,
  FaGraduationCap, FaHandsHelping, FaUsers, FaHome,
  FaCog, FaTrash, FaArrowLeft, FaComments, FaExclamationTriangle
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getMe, sendUserMsg, deleteAccount } from '../api';
import './UserPortal.css';

// ── Status pipeline ────────────────────────────────────────
const PIPELINE = [
  { key: 'submitted',  label: 'Submitted',  icon: '📋', desc: 'Request received' },
  { key: 'validating', label: 'Validating', icon: '🔍', desc: 'Team reviewing' },
  { key: 'verified',   label: 'Verified',   icon: '✅', desc: 'Profile verified' },
  { key: 'counseled',  label: 'Counseled',  icon: '🎓', desc: 'Session done' },
];
const VOL_PIPELINE = [
  { key: 'submitted',  label: 'Applied',   icon: '📋', desc: 'Application received' },
  { key: 'validating', label: 'Reviewing', icon: '🔍', desc: 'Team reviewing' },
  { key: 'approved',   label: 'Approved',  icon: '✅', desc: 'Welcome aboard!' },
];

const STATUS_MSG = {
  submitted:  'Your request is in our queue. We will start reviewing within 48 hours.',
  validating: 'Our team is currently reviewing your details. Please be patient.',
  verified:   'Your profile is verified! Our counselor will contact you soon.',
  counseled:  'Your counseling session is complete. Best wishes for your future!',
  approved:   'Your application is approved! Welcome to the Meipuratchi team.',
  rejected:   'Your application could not be processed. Please contact us for more info.',
};
const STATUS_ICON = {
  submitted: '📋', validating: '🔍', verified: '✅',
  counseled: '🎓', approved: '✅', rejected: '❌',
};

// ── Home / Status tab ──────────────────────────────────────
function HomeTab({ user, onGoChat }) {
  const steps = user.role === 'volunteer' ? VOL_PIPELINE : PIPELINE;
  const currentIdx = steps.findIndex(s => s.key === user.status);
  const lastMsg = user.messages?.length > 0 ? user.messages[user.messages.length - 1] : null;

  return (
    <div className="pt-home">
      {/* Greeting card */}
      <div className="pt-greeting">
        <div className="pt-avatar-lg">{user.name[0].toUpperCase()}</div>
        <div>
          <h2>வணக்கம், {user.name.split(' ')[0]}! 👋</h2>
          <p>Track your guidance journey below</p>
        </div>
      </div>

      {/* Status pill */}
      <div className={`pt-status-pill status-${user.status}`}>
        <span className="pt-status-icon">{STATUS_ICON[user.status]}</span>
        <div>
          <p className="pt-status-label">Current Status</p>
          <p className="pt-status-value">{user.status}</p>
        </div>
      </div>

      {/* Pipeline */}
      <div className="pt-pipeline">
        {steps.map((step, i) => {
          const done = i < currentIdx;
          const current = i === currentIdx;
          return (
            <div key={step.key} className={`pt-pip-step ${done ? 'done' : ''} ${current ? 'current' : ''}`}>
              <div className="pt-pip-circle">
                {done ? <FaCheckCircle /> : <span>{step.icon}</span>}
              </div>
              {i < steps.length - 1 && <div className="pt-pip-line" />}
              <div className="pt-pip-info">
                <p className="pt-pip-label">{step.label}</p>
                <p className="pt-pip-desc">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Status message */}
      <div className="pt-status-card">
        <p>{STATUS_MSG[user.status]}</p>
      </div>

      {/* Latest message preview */}
      {lastMsg && (
        <button className="pt-msg-preview" onClick={onGoChat}>
          <div className="pt-msg-preview-icon">💬</div>
          <div className="pt-msg-preview-body">
            <p className="pt-msg-preview-from">
              {lastMsg.from === 'admin' ? '🛡️ Meipuratchi Team' : '👤 You'}
            </p>
            <p className="pt-msg-preview-text">{lastMsg.text}</p>
          </div>
          <span className="pt-msg-preview-arrow">›</span>
        </button>
      )}
    </div>
  );
}

// ── Chat tab (live polling) ────────────────────────────────
function ChatTab({ user, onSend, onRefresh }) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [user.messages]);

  // Live polling — refresh every 5 seconds when tab is active
  useEffect(() => {
    const id = setInterval(onRefresh, 5000);
    return () => clearInterval(id);
  }, [onRefresh]);

  const handleSend = async e => {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    try {
      await onSend(text.trim());
      setText('');
      inputRef.current?.focus();
    } finally {
      setSending(false);
    }
  };

  const quickReplies = [
    'When will my profile be verified?',
    'I need help with college selection.',
    'Please update my status.',
    'Thank you for the guidance!',
  ];

  return (
    <div className="pt-chat">
      <div className="pt-chat-header">
        <div className="pt-chat-avatar">M</div>
        <div>
          <p className="pt-chat-name">Meipuratchi Team</p>
          <p className="pt-chat-status">
            <span className="pt-online-dot" /> Online — replies within 24h
          </p>
        </div>
      </div>

      <div className="pt-chat-messages">
        {(!user.messages || user.messages.length === 0) && (
          <div className="pt-no-msgs">
            <span>💬</span>
            <p>No messages yet.</p>
            <p>Send us a message below!</p>
          </div>
        )}
        {(user.messages || []).map((m, i) => {
          const isAdmin = m.from === 'admin';
          return (
            <div key={i} className={`pt-bubble ${isAdmin ? 'pt-bubble-admin' : 'pt-bubble-user'}`}>
              {isAdmin && <p className="pt-bubble-from">🛡️ Meipuratchi Team</p>}
              <p className="pt-bubble-text">{m.text}</p>
              <p className="pt-bubble-time">
                {new Date(m.sentAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
              </p>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      <div className="pt-quick-replies">
        {quickReplies.map((q, i) => (
          <button key={i} className="pt-quick-btn" onClick={() => setText(q)}>{q}</button>
        ))}
      </div>

      <form className="pt-chat-input" onSubmit={handleSend}>
        <input
          ref={inputRef}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type a message..."
          disabled={sending}
        />
        <button type="submit" disabled={sending || !text.trim()} className="pt-send-btn">
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
}

// ── Profile tab ────────────────────────────────────────────
function ProfileTab({ user }) {
  const roleLabel = { student: 'Student', volunteer: 'Volunteer', team: 'Team Member' }[user.role];
  const fields = [
    { icon: <FaUser />,    label: 'Full Name',  value: user.name },
    { icon: <FaEnvelope />,label: 'Email',      value: user.email },
    { icon: <FaPhone />,   label: 'Phone',      value: user.phone },
    { icon: <FaUsers />,   label: 'Role',       value: roleLabel },
    ...(user.role === 'student' ? [
      { icon: <FaSchool />, label: 'School',         value: user.school || '—' },
      { icon: '📍',          label: 'District',       value: user.district || '—' },
      { icon: '📚',          label: 'Standard',       value: user.standard || '—' },
      { icon: '🔬',          label: 'Stream',         value: user.stream || '—' },
      { icon: '🎯',          label: 'Career Interest',value: user.careerInterest || '—' },
    ] : []),
    ...(user.role === 'volunteer' ? [
      { icon: '💡', label: 'Skills',     value: user.skills || '—' },
      { icon: '🏢', label: 'Department', value: user.department || 'Not assigned yet' },
    ] : []),
    { icon: <FaClock />, label: 'Registered', value: new Date(user.createdAt).toLocaleDateString('en-IN') },
  ];

  return (
    <div className="pt-profile">
      <div className="pt-profile-hero">
        <div className="pt-avatar-xl">{user.name[0].toUpperCase()}</div>
        <h2>{user.name}</h2>
        <span className={`pt-role-chip role-${user.role}`}>{roleLabel}</span>
        <span className={`status-chip status-${user.status}`}>{user.status}</span>
      </div>
      <div className="pt-profile-fields">
        {fields.map((f, i) => (
          <div key={i} className="pt-field">
            <span className="pt-field-icon">{f.icon}</span>
            <div>
              <p className="pt-field-label">{f.label}</p>
              <p className="pt-field-value">{f.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Settings tab ───────────────────────────────────────────
function SettingsTab({ user, onLogout, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete();
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div className="pt-settings">
      <h2>Settings</h2>

      {/* Account info */}
      <div className="pt-settings-section">
        <h3>Account</h3>
        <div className="pt-settings-item">
          <div>
            <p className="pt-settings-label">Name</p>
            <p className="pt-settings-value">{user.name}</p>
          </div>
        </div>
        <div className="pt-settings-item">
          <div>
            <p className="pt-settings-label">Email</p>
            <p className="pt-settings-value">{user.email}</p>
          </div>
        </div>
        <div className="pt-settings-item">
          <div>
            <p className="pt-settings-label">Phone</p>
            <p className="pt-settings-value">{user.phone}</p>
          </div>
        </div>
      </div>

      {/* Navigation links */}
      <div className="pt-settings-section">
        <h3>Browse Site</h3>
        {[
          { to: '/',            label: '🏠 Home' },
          { to: '/engineering', label: '⚙️ Engineering' },
          { to: '/paramedical', label: '🏥 Paramedical' },
          { to: '/our-team',    label: '👥 Our Team' },
          { to: '/contact',     label: '📞 Contact' },
        ].map(l => (
          <Link key={l.to} to={l.to} className="pt-settings-link">{l.label}</Link>
        ))}
      </div>

      {/* Logout */}
      <div className="pt-settings-section">
        <h3>Session</h3>
        <button className="pt-settings-btn pt-logout-btn" onClick={onLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* Danger zone */}
      <div className="pt-settings-section pt-danger-zone">
        <h3>⚠️ Danger Zone</h3>
        <p className="pt-danger-desc">
          Deleting your account is permanent. All your data, messages, and status will be removed and cannot be recovered.
        </p>
        {!confirmDelete ? (
          <button className="pt-settings-btn pt-delete-btn" onClick={() => setConfirmDelete(true)}>
            <FaTrash /> Delete My Account
          </button>
        ) : (
          <div className="pt-delete-confirm">
            <div className="pt-delete-warning">
              <FaExclamationTriangle />
              <p>Are you absolutely sure? This cannot be undone.</p>
            </div>
            <div className="pt-delete-actions">
              <button className="pt-btn-cancel" onClick={() => setConfirmDelete(false)}>Cancel</button>
              <button className="pt-btn-delete-final" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Yes, Delete Account'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Portal ────────────────────────────────────────────
export default function UserPortal() {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState('home');
  const navigate = useNavigate();

  const fetchUser = useCallback(async (silent = false) => {
    try {
      const res = await getMe();
      setUser(res.data.data);
    } catch {
      if (!silent) {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userInfo');
        navigate('/portal/login');
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) { navigate('/portal/login'); return; }
    fetchUser();
  }, [fetchUser]);

  const handleSendMsg = async text => {
    try {
      await sendUserMsg(text);
      await fetchUser(true);
    } catch {
      toast.error('Failed to send message');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  const handleDelete = async () => {
    try {
      await deleteAccount();
      localStorage.removeItem('userToken');
      localStorage.removeItem('userInfo');
      toast.success('Account deleted. Goodbye!');
      navigate('/');
    } catch {
      toast.error('Failed to delete account. Please try again.');
    }
  };

  const unreadCount = user?.messages?.filter(m => m.from === 'admin' && !m.read).length || 0;

  if (loading) return (
    <div className="portal-loading">
      <div className="spinner" />
      <p>Loading your portal...</p>
    </div>
  );

  const navItems = [
    { id: 'home',     icon: <FaHome />,     label: 'Home' },
    { id: 'chat',     icon: <FaComments />, label: 'Chat', badge: unreadCount },
    { id: 'profile',  icon: <FaUser />,     label: 'Profile' },
    { id: 'settings', icon: <FaCog />,      label: 'Settings' },
  ];

  return (
    <div className="pt-page">
      {/* Top header */}
      <header className="pt-header">
        <div className="pt-header-brand">
          <img src="/mei_logo.png" alt="Meipuratchi" />
          <span>மெய் புரட்சி</span>
        </div>
        <div className="pt-header-right">
          <span className={`pt-role-badge role-${user.role}`}>
            {user.role === 'student' ? <FaGraduationCap /> : user.role === 'volunteer' ? <FaHandsHelping /> : <FaUsers />}
            {user.role}
          </span>
          <button className="pt-header-logout" onClick={handleLogout} title="Logout">
            <FaSignOutAlt />
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-main">
        {tab === 'home'     && <HomeTab    user={user} onGoChat={() => setTab('chat')} />}
        {tab === 'chat'     && <ChatTab    user={user} onSend={handleSendMsg} onRefresh={() => fetchUser(true)} />}
        {tab === 'profile'  && <ProfileTab user={user} />}
        {tab === 'settings' && <SettingsTab user={user} onLogout={handleLogout} onDelete={handleDelete} />}
      </main>

      {/* Bottom navigation */}
      <nav className="pt-bottom-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`pt-nav-btn ${tab === item.id ? 'active' : ''}`}
            onClick={() => setTab(item.id)}
          >
            <span className="pt-nav-icon">
              {item.icon}
              {item.badge > 0 && <span className="pt-nav-badge">{item.badge}</span>}
            </span>
            <span className="pt-nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
