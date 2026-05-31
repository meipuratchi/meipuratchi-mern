import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaSignOutAlt, FaUser, FaEnvelope, FaPhone, FaSchool,
  FaPaperPlane, FaBell, FaCheckCircle, FaClock,
  FaGraduationCap, FaHandsHelping, FaUsers, FaHome,
  FaCog, FaTrash, FaComments, FaExclamationTriangle,
  FaLock, FaEye, FaEyeSlash, FaMapMarkerAlt, FaBook,
  FaStar, FaHeart, FaCheck, FaSmile
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { getMe, sendUserMsg, deleteAccount, changePassword } from '../api';
import './UserPortal.css';

const PIPELINE = [
  { key: 'submitted',  label: 'Submitted',  icon: '📋', desc: 'Request received', color: '#6c757d' },
  { key: 'validating', label: 'Validating', icon: '🔍', desc: 'Team reviewing',   color: '#f5a623' },
  { key: 'verified',   label: 'Verified',   icon: '✅', desc: 'Profile verified', color: '#2196F3' },
  { key: 'counseled',  label: 'Counseled',  icon: '🎓', desc: 'Session done',     color: '#28a745' },
];
const VOL_PIPELINE = [
  { key: 'submitted',  label: 'Applied',   icon: '📋', desc: 'Application received', color: '#6c757d' },
  { key: 'validating', label: 'Reviewing', icon: '🔍', desc: 'Team reviewing',        color: '#f5a623' },
  { key: 'approved',   label: 'Approved',  icon: '✅', desc: 'Welcome aboard!',       color: '#28a745' },
];

const STATUS_MSG = {
  submitted:  'Your request is in our queue. We will start reviewing within 48 hours.',
  validating: 'Our team is currently reviewing your details. Please be patient.',
  verified:   'Your profile is verified! Our counselor will contact you soon.',
  counseled:  'Your counseling session is complete. Best wishes for your future!',
  approved:   'Your application is approved! Welcome to the Meipuratchi team.',
  rejected:   'Your application could not be processed. Please contact us for more info.',
};

// ── Home Tab ───────────────────────────────────────────────
function HomeTab({ user, onGoChat, unreadCount }) {
  const steps = user.role === 'volunteer' ? VOL_PIPELINE : PIPELINE;
  const currentIdx = steps.findIndex(s => s.key === user.status);
  const lastMsg = user.messages?.length > 0 ? user.messages[user.messages.length - 1] : null;

  return (
    <div className="pt-home">
      {/* Greeting */}
      <motion.div className="pt-greeting" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="pt-avatar-lg">{user.name[0].toUpperCase()}</div>
        <div>
          <h2>வணக்கம், {user.name.split(' ')[0]}! 👋</h2>
          <p>Track your guidance journey below</p>
        </div>
        {unreadCount > 0 && (
          <motion.button
            className="pt-notif-pill"
            onClick={onGoChat}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <FaBell /> {unreadCount} new
          </motion.button>
        )}
      </motion.div>

      {/* Status pill */}
      <motion.div
        className={`pt-status-pill status-${user.status}`}
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
      >
        <span className="pt-status-icon">{steps.find(s => s.key === user.status)?.icon || '📋'}</span>
        <div>
          <p className="pt-status-label">Current Status</p>
          <p className="pt-status-value">{user.status}</p>
        </div>
        <div className="pt-status-dot" />
      </motion.div>

      {/* Pipeline */}
      <motion.div className="pt-pipeline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        {steps.map((step, i) => {
          const done = i < currentIdx;
          const current = i === currentIdx;
          return (
            <div key={step.key} className={`pt-pip-step ${done ? 'done' : ''} ${current ? 'current' : ''}`}>
              <motion.div
                className="pt-pip-circle"
                animate={current ? { boxShadow: ['0 0 0 0px rgba(25,36,65,0.3)', '0 0 0 8px rgba(25,36,65,0)', '0 0 0 0px rgba(25,36,65,0)'] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {done ? <FaCheckCircle /> : <span>{step.icon}</span>}
              </motion.div>
              {i < steps.length - 1 && <div className="pt-pip-line" />}
              <div className="pt-pip-info">
                <p className="pt-pip-label">{step.label}</p>
                <p className="pt-pip-desc">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Status message */}
      <motion.div className="pt-status-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <p>{STATUS_MSG[user.status]}</p>
      </motion.div>

      {/* Latest message preview */}
      {lastMsg && (
        <motion.button
          className="pt-msg-preview"
          onClick={onGoChat}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="pt-msg-preview-icon">💬</div>
          <div className="pt-msg-preview-body">
            <p className="pt-msg-preview-from">
              {lastMsg.from === 'admin' ? '🛡️ Meipuratchi Team' : '👤 You'}
            </p>
            <p className="pt-msg-preview-text">{lastMsg.text}</p>
          </div>
          {unreadCount > 0 && <span className="pt-msg-unread-badge">{unreadCount}</span>}
          <span className="pt-msg-preview-arrow">›</span>
        </motion.button>
      )}

      {/* Quick actions */}
      <div className="pt-quick-actions">
        <Link to="/engineering" className="pt-quick-action-btn">
          <span>⚙️</span><p>Engineering</p>
        </Link>
        <Link to="/paramedical" className="pt-quick-action-btn">
          <span>🏥</span><p>Paramedical</p>
        </Link>
        <Link to="/contact" className="pt-quick-action-btn">
          <span>📞</span><p>Contact</p>
        </Link>
        <button className="pt-quick-action-btn" onClick={onGoChat}>
          <span>💬</span><p>Chat</p>
        </button>
      </div>
    </div>
  );
}

// ── Chat Tab ───────────────────────────────────────────────
function ChatTab({ user, onSend, onRefresh }) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [user.messages]);

  // Live polling every 5s
  useEffect(() => {
    const id = setInterval(onRefresh, 5000);
    return () => clearInterval(id);
  }, [onRefresh]);

  // Simulate typing indicator when user types
  useEffect(() => {
    if (text.length > 0) {
      setTyping(true);
      const t = setTimeout(() => setTyping(false), 1500);
      return () => clearTimeout(t);
    } else {
      setTyping(false);
    }
  }, [text]);

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
    'Thank you for the guidance! 🙏',
  ];

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="pt-chat">
      {/* Chat header */}
      <div className="pt-chat-header">
        <div className="pt-chat-avatar">M</div>
        <div className="pt-chat-header-info">
          <p className="pt-chat-name">Meipuratchi Team</p>
          <p className="pt-chat-status">
            <span className="pt-online-dot" /> Online — replies within 24h
          </p>
        </div>
        <div className="pt-chat-header-actions">
          <span className="pt-msg-count-badge">{user.messages?.length || 0} msgs</span>
        </div>
      </div>

      {/* Messages */}
      <div className="pt-chat-messages">
        {/* Welcome message */}
        <div className="pt-chat-date-divider">
          <span>Chat with Meipuratchi Team</span>
        </div>

        {(!user.messages || user.messages.length === 0) && (
          <motion.div className="pt-no-msgs" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span>💬</span>
            <p>No messages yet.</p>
            <p>Send us a message below!</p>
          </motion.div>
        )}

        <AnimatePresence>
          {(user.messages || []).map((m, i) => {
            const isAdmin = m.from === 'admin';
            const showDate = i === 0 || (
              new Date(m.sentAt).toDateString() !== new Date(user.messages[i-1]?.sentAt).toDateString()
            );
            return (
              <motion.div key={i}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {showDate && i > 0 && (
                  <div className="pt-chat-date-divider">
                    <span>{new Date(m.sentAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                  </div>
                )}
                <div className={`pt-bubble-wrap ${isAdmin ? 'admin' : 'user'}`}>
                  {isAdmin && <div className="pt-bubble-avatar">M</div>}
                  <div className={`pt-bubble ${isAdmin ? 'pt-bubble-admin' : 'pt-bubble-user'}`}>
                    {isAdmin && <p className="pt-bubble-from">🛡️ Meipuratchi Team</p>}
                    <p className="pt-bubble-text">{m.text}</p>
                    <div className="pt-bubble-meta">
                      <span className="pt-bubble-time">{formatTime(m.sentAt)}</span>
                      {!isAdmin && <span className="pt-bubble-read"><FaCheck /><FaCheck /></span>}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Typing indicator */}
        {typing && (
          <div className="pt-bubble-wrap admin">
            <div className="pt-bubble-avatar">M</div>
            <div className="pt-typing-indicator">
              <span /><span /><span />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      <div className="pt-quick-replies">
        {quickReplies.map((q, i) => (
          <motion.button key={i} className="pt-quick-btn" onClick={() => setText(q)}
            whileTap={{ scale: 0.95 }}>
            {q}
          </motion.button>
        ))}
      </div>

      {/* Input */}
      <form className="pt-chat-input" onSubmit={handleSend}>
        <input
          ref={inputRef}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type a message..."
          disabled={sending}
        />
        <motion.button
          type="submit"
          disabled={sending || !text.trim()}
          className="pt-send-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
        >
          {sending ? <div className="pt-send-spinner" /> : <FaPaperPlane />}
        </motion.button>
      </form>
    </div>
  );
}

// ── Profile Tab ────────────────────────────────────────────
function ProfileTab({ user }) {
  const roleLabel = { student: 'Student', volunteer: 'Volunteer', team: 'Team Member' }[user.role];
  const roleColor = { student: '#192441', volunteer: '#28a745', team: '#f5a623' }[user.role];

  const fields = [
    { icon: '📧', label: 'Email',      value: user.email },
    { icon: '📱', label: 'Phone',      value: user.phone },
    { icon: '👤', label: 'Role',       value: roleLabel },
    ...(user.role === 'student' ? [
      { icon: '🏫', label: 'School',         value: user.school || '—' },
      { icon: '📍', label: 'District',       value: user.district || '—' },
      { icon: '📚', label: 'Standard',       value: user.standard || '—' },
      { icon: '🔬', label: 'Stream',         value: user.stream || '—' },
      { icon: '🎯', label: 'Career Interest',value: user.careerInterest || '—' },
    ] : []),
    ...(user.role === 'volunteer' ? [
      { icon: '💡', label: 'Skills',     value: user.skills || '—' },
      { icon: '🏢', label: 'Department', value: user.department || 'Not assigned yet' },
    ] : []),
    { icon: '📅', label: 'Registered', value: new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
  ];

  const completionFields = ['email', 'phone', 'school', 'district', 'standard', 'stream', 'careerInterest'];
  const filled = completionFields.filter(f => user[f]).length;
  const completion = Math.round((filled / completionFields.length) * 100);

  return (
    <div className="pt-profile">
      {/* Hero card */}
      <motion.div className="pt-profile-hero" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="pt-avatar-xl" style={{ background: `linear-gradient(135deg, ${roleColor}, ${roleColor}cc)` }}>
          {user.name[0].toUpperCase()}
        </div>
        <h2>{user.name}</h2>
        <div className="pt-profile-badges">
          <span className={`pt-role-chip role-${user.role}`}>{roleLabel}</span>
          <span className={`status-chip status-${user.status}`}>{user.status}</span>
        </div>

        {/* Profile completion */}
        {user.role === 'student' && (
          <div className="pt-completion">
            <div className="pt-completion-header">
              <span>Profile Completion</span>
              <span>{completion}%</span>
            </div>
            <div className="pt-completion-bar">
              <motion.div
                className="pt-completion-fill"
                initial={{ width: 0 }}
                animate={{ width: `${completion}%` }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Stats row */}
      <div className="pt-profile-stats">
        <div className="pt-profile-stat">
          <span>{user.messages?.length || 0}</span>
          <p>Messages</p>
        </div>
        <div className="pt-profile-stat">
          <span>{user.messages?.filter(m => m.from === 'admin').length || 0}</span>
          <p>From Team</p>
        </div>
        <div className="pt-profile-stat">
          <span>{user.status === 'counseled' || user.status === 'approved' ? '✅' : '⏳'}</span>
          <p>Status</p>
        </div>
      </div>

      {/* Fields */}
      <div className="pt-profile-fields">
        {fields.map((f, i) => (
          <motion.div key={i} className="pt-field"
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}>
            <span className="pt-field-icon">{f.icon}</span>
            <div>
              <p className="pt-field-label">{f.label}</p>
              <p className="pt-field-value">{f.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── Settings Tab ───────────────────────────────────────────
function SettingsTab({ user, onLogout, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try { await onDelete(); } finally { setDeleting(false); setConfirmDelete(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { toast.error('New passwords do not match'); return; }
    if (newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setChangingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast.success('Password changed successfully!');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      setShowPasswordChange(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally { setChangingPassword(false); }
  };

  return (
    <div className="pt-settings">
      <h2>Settings</h2>

      <div className="pt-settings-section">
        <h3>Account</h3>
        {[{ label: 'Name', value: user.name }, { label: 'Email', value: user.email }, { label: 'Phone', value: user.phone }].map(item => (
          <div key={item.label} className="pt-settings-item">
            <div><p className="pt-settings-label">{item.label}</p><p className="pt-settings-value">{item.value}</p></div>
          </div>
        ))}
      </div>

      <div className="pt-settings-section">
        <h3>Security</h3>
        {!showPasswordChange ? (
          <button className="pt-settings-btn pt-password-btn" onClick={() => setShowPasswordChange(true)}>
            <FaLock /> Change Password
          </button>
        ) : (
          <form className="pt-password-form" onSubmit={handlePasswordChange}>
            <input type="password" placeholder="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
            <input type="password" placeholder="New Password (min 6 chars)" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
            <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
            <div className="pt-password-actions">
              <button type="button" className="pt-btn-cancel" onClick={() => { setShowPasswordChange(false); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); }}>Cancel</button>
              <button type="submit" className="pt-btn-save" disabled={changingPassword}>{changingPassword ? 'Saving...' : 'Save Password'}</button>
            </div>
          </form>
        )}
      </div>

      <div className="pt-settings-section">
        <h3>Browse Site</h3>
        {[{ to: '/', label: '🏠 Home' }, { to: '/engineering', label: '⚙️ Engineering' }, { to: '/paramedical', label: '🏥 Paramedical' }, { to: '/our-team', label: '👥 Our Team' }, { to: '/contact', label: '📞 Contact' }].map(l => (
          <Link key={l.to} to={l.to} className="pt-settings-link">{l.label}</Link>
        ))}
      </div>

      <div className="pt-settings-section">
        <h3>Session</h3>
        <button className="pt-settings-btn pt-logout-btn" onClick={onLogout}><FaSignOutAlt /> Logout</button>
      </div>

      <div className="pt-settings-section pt-danger-zone">
        <h3>⚠️ Danger Zone</h3>
        <p className="pt-danger-desc">Deleting your account is permanent and cannot be recovered.</p>
        {!confirmDelete ? (
          <button className="pt-settings-btn pt-delete-btn" onClick={() => setConfirmDelete(true)}><FaTrash /> Delete My Account</button>
        ) : (
          <div className="pt-delete-confirm">
            <div className="pt-delete-warning"><FaExclamationTriangle /><p>Are you absolutely sure? This cannot be undone.</p></div>
            <div className="pt-delete-actions">
              <button className="pt-btn-cancel" onClick={() => setConfirmDelete(false)}>Cancel</button>
              <button className="pt-btn-delete-final" onClick={handleDelete} disabled={deleting}>{deleting ? 'Deleting...' : 'Yes, Delete Account'}</button>
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
  const [prevMsgCount, setPrevMsgCount] = useState(0);
  const navigate = useNavigate();

  const fetchUser = useCallback(async (silent = false) => {
    try {
      const res = await getMe();
      const newUser = res.data.data;
      // Notification: new message arrived
      if (silent && user) {
        const newMsgs = newUser.messages?.filter(m => m.from === 'admin' && !m.read).length || 0;
        const oldMsgs = user.messages?.filter(m => m.from === 'admin' && !m.read).length || 0;
        if (newMsgs > oldMsgs) {
          toast('📬 New message from Meipuratchi Team!', {
            icon: '🔔',
            style: { background: '#192441', color: 'white', fontFamily: 'Poppins, sans-serif' },
          });
          // Browser notification if permitted
          if (Notification.permission === 'granted') {
            new Notification('Meipuratchi', { body: 'New message from the team!', icon: '/mei_logo.png' });
          }
        }
      }
      setUser(newUser);
    } catch {
      if (!silent) {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userInfo');
        navigate('/portal/login');
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, [navigate, user]);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) { navigate('/portal/login'); return; }
    fetchUser();
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

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
      <motion.div
        className="portal-loading-logo"
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <img src="/mei_logo.png" alt="Meipuratchi" />
      </motion.div>
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
          {unreadCount > 0 && (
            <motion.button
              className="pt-notif-btn"
              onClick={() => setTab('chat')}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <FaBell />
              <span className="pt-notif-count">{unreadCount}</span>
            </motion.button>
          )}
          <button className="pt-header-logout" onClick={handleLogout} title="Logout">
            <FaSignOutAlt />
          </button>
        </div>
      </header>

      <main className="pt-main">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            {tab === 'home'     && <HomeTab    user={user} onGoChat={() => setTab('chat')} unreadCount={unreadCount} />}
            {tab === 'chat'     && <ChatTab    user={user} onSend={handleSendMsg} onRefresh={() => fetchUser(true)} />}
            {tab === 'profile'  && <ProfileTab user={user} />}
            {tab === 'settings' && <SettingsTab user={user} onLogout={handleLogout} onDelete={handleDelete} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <nav className="pt-bottom-nav">
        {navItems.map(item => (
          <motion.button
            key={item.id}
            className={`pt-nav-btn ${tab === item.id ? 'active' : ''}`}
            onClick={() => setTab(item.id)}
            whileTap={{ scale: 0.9 }}
          >
            <span className="pt-nav-icon">
              {item.icon}
              {item.badge > 0 && (
                <motion.span
                  className="pt-nav-badge"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {item.badge}
                </motion.span>
              )}
            </span>
            <span className="pt-nav-label">{item.label}</span>
          </motion.button>
        ))}
      </nav>
    </div>
  );
}
