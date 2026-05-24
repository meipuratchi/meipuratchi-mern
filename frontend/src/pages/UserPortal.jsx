import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUser, FaEnvelope, FaPhone, FaSchool,
         FaPaperPlane, FaBell, FaCheckCircle, FaClock,
         FaGraduationCap, FaHandsHelping, FaUsers, FaGlobe } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getMe, sendUserMsg } from '../api';
import './UserPortal.css';

// Status pipeline config
const PIPELINE = [
  { key: 'submitted',  label: 'Submitted',  icon: '📋', desc: 'Your request is in our queue' },
  { key: 'validating', label: 'Validating', icon: '🔍', desc: 'Team is reviewing your details' },
  { key: 'verified',   label: 'Verified',   icon: '✅', desc: 'Profile verified successfully' },
  { key: 'counseled',  label: 'Counseled',  icon: '🎓', desc: 'Guidance session completed' },
];

const VOL_PIPELINE = [
  { key: 'submitted',  label: 'Applied',   icon: '📋', desc: 'Application received' },
  { key: 'validating', label: 'Reviewing', icon: '🔍', desc: 'Team is reviewing your application' },
  { key: 'approved',   label: 'Approved',  icon: '✅', desc: 'Welcome to the team!' },
];

function StatusPipeline({ status, role }) {
  const steps = role === 'volunteer' ? VOL_PIPELINE : PIPELINE;
  const currentIdx = steps.findIndex(s => s.key === status);

  return (
    <div className="pipeline">
      {steps.map((step, i) => {
        const done    = i < currentIdx;
        const current = i === currentIdx;
        return (
          <div key={step.key} className={`pipeline-step ${done ? 'done' : ''} ${current ? 'current' : ''}`}>
            <div className="step-circle">
              {done ? <FaCheckCircle /> : <span>{step.icon}</span>}
            </div>
            <div className="step-info">
              <p className="step-label">{step.label}</p>
              <p className="step-desc">{step.desc}</p>
            </div>
            {i < steps.length - 1 && <div className="step-line" />}
          </div>
        );
      })}
    </div>
  );
}

function Messages({ messages, onSend }) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async e => {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    try {
      await onSend(text.trim());
      setText('');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="messages-panel">
      <div className="messages-list">
        {messages.length === 0 && (
          <div className="no-messages">No messages yet. We'll update you here!</div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`msg-bubble ${m.from === 'admin' ? 'from-admin' : 'from-user'}`}>
            <div className="msg-sender">{m.from === 'admin' ? '🛡️ Meipuratchi Team' : '👤 You'}</div>
            <div className="msg-text">{m.text}</div>
            <div className="msg-time">{new Date(m.sentAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form className="msg-input-row" onSubmit={handleSend}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type a message to our team..."
          disabled={sending}
        />
        <button type="submit" disabled={sending || !text.trim()}>
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
}

export default function UserPortal() {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState('status');
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await getMe();
      setUser(res.data.data);
    } catch {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userInfo');
      navigate('/portal/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) { navigate('/portal/login'); return; }
    fetchUser();
  }, []);

  const handleSendMsg = async text => {
    try {
      await sendUserMsg(text);
      toast.success('Message sent!');
      fetchUser();
    } catch {
      toast.error('Failed to send message');
    }
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
    navigate('/portal/login');
  };

  const unreadCount = user?.messages?.filter(m => m.from === 'admin' && !m.read).length || 0;

  if (loading) return <div className="portal-loading"><div className="spinner" />Loading your portal...</div>;

  const roleIcon = user.role === 'student' ? <FaGraduationCap /> : user.role === 'volunteer' ? <FaHandsHelping /> : <FaUsers />;
  const roleLabel = { student: 'Student', volunteer: 'Volunteer', team: 'Team Member' }[user.role];

  return (
    <div className="portal-page">
      {/* Header */}
      <header className="portal-header">
        <div className="portal-brand">
          <img src="/mei_logo.png" alt="Meipuratchi" />
          <span>மெய் புரட்சி Portal</span>
        </div>
        <div className="portal-user-info">
          <Link to="/" className="portal-site-link">
            <FaGlobe /> Browse Site
          </Link>
          <span className={`role-badge role-${user.role}`}>{roleIcon} {roleLabel}</span>
          <span className="portal-name">{user.name}</span>
          <button className="portal-logout" onClick={logout}><FaSignOutAlt /> Logout</button>
        </div>
      </header>

      <div className="portal-body">
        {/* Sidebar */}
        <aside className="portal-sidebar">
          <div className="portal-avatar">
            <div className="avatar-circle">{user.name[0].toUpperCase()}</div>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <span className={`status-chip status-${user.status}`}>{user.status}</span>
          </div>

          <nav className="portal-nav">
            <button className={tab === 'status'   ? 'active' : ''} onClick={() => setTab('status')}>
              <FaCheckCircle /> My Status
            </button>
            <button className={tab === 'messages' ? 'active' : ''} onClick={() => setTab('messages')}>
              <FaBell /> Messages
              {unreadCount > 0 && <span className="unread-dot">{unreadCount}</span>}
            </button>
            <button className={tab === 'profile'  ? 'active' : ''} onClick={() => setTab('profile')}>
              <FaUser /> My Profile
            </button>
          </nav>

          <div className="portal-site-nav">
            <p className="site-nav-label">Browse Site</p>
            {[
              { to: '/',             label: '🏠 Home' },
              { to: '/engineering',  label: '⚙️ Engineering' },
              { to: '/paramedical',  label: '🏥 Paramedical' },
              { to: '/our-team',      label: '👥 Our Team' },
              { to: '/contact',      label: '📞 Contact' },
            ].map(l => (
              <Link key={l.to} to={l.to} className="site-nav-link">{l.label}</Link>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main className="portal-main">
          {tab === 'status' && (
            <div className="portal-section">
              <h2>Request Status</h2>
              <p className="section-sub">Track your guidance request in real-time</p>
              <StatusPipeline status={user.status} role={user.role} />

              <div className="status-card">
                <div className={`status-icon-big status-${user.status}`}>
                  {user.status === 'submitted'  && '📋'}
                  {user.status === 'validating' && '🔍'}
                  {user.status === 'verified'   && '✅'}
                  {user.status === 'counseled'  && '🎓'}
                  {user.status === 'approved'   && '✅'}
                  {user.status === 'rejected'   && '❌'}
                </div>
                <div>
                  <h3>Current Status: <span className={`status-chip status-${user.status}`}>{user.status}</span></h3>
                  <p>
                    {user.status === 'submitted'  && 'Your request is in our queue. We will start reviewing within 48 hours.'}
                    {user.status === 'validating' && 'Our team is currently reviewing your details. Please be patient.'}
                    {user.status === 'verified'   && 'Your profile is verified! Our counselor will contact you soon.'}
                    {user.status === 'counseled'  && 'Your counseling session is complete. Best wishes for your future!'}
                    {user.status === 'approved'   && 'Your application is approved! Welcome to the Meipuratchi team.'}
                    {user.status === 'rejected'   && 'Your application could not be processed. Please contact us for more info.'}
                  </p>
                </div>
              </div>

              {/* Latest message preview */}
              {user.messages?.length > 0 && (
                <div className="latest-msg-preview">
                  <h4>📬 Latest Update from Team</h4>
                  <p>{user.messages[user.messages.length - 1].text}</p>
                  <button className="btn-link" onClick={() => setTab('messages')}>View all messages →</button>
                </div>
              )}
            </div>
          )}

          {tab === 'messages' && (
            <div className="portal-section">
              <h2>Messages</h2>
              <p className="section-sub">Communication with the Meipuratchi team</p>
              <Messages messages={user.messages || []} onSend={handleSendMsg} />
            </div>
          )}

          {tab === 'profile' && (
            <div className="portal-section">
              <h2>My Profile</h2>
              <p className="section-sub">Your registered information</p>
              <div className="profile-grid">
                {[
                  { icon: <FaUser />,   label: 'Full Name',  value: user.name },
                  { icon: <FaEnvelope />,label: 'Email',     value: user.email },
                  { icon: <FaPhone />,  label: 'Phone',      value: user.phone },
                  { icon: <FaUsers />,  label: 'Role',       value: roleLabel },
                  ...(user.role === 'student' ? [
                    { icon: <FaSchool />, label: 'School',   value: user.school || '—' },
                    { icon: '📍',         label: 'District', value: user.district || '—' },
                    { icon: '📚',         label: 'Standard', value: user.standard || '—' },
                    { icon: '🔬',         label: 'Stream',   value: user.stream || '—' },
                    { icon: '🎯',         label: 'Career Interest', value: user.careerInterest || '—' },
                  ] : []),
                  ...(user.role === 'volunteer' ? [
                    { icon: '💡', label: 'Skills',     value: user.skills || '—' },
                    { icon: '🏢', label: 'Department', value: user.department || 'Not assigned yet' },
                  ] : []),
                  ...(user.role === 'team' ? [
                    { icon: '🏢', label: 'Department', value: user.department || '—' },
                  ] : []),
                  { icon: <FaClock />, label: 'Registered', value: new Date(user.createdAt).toLocaleDateString('en-IN') },
                ].map((item, i) => (
                  <div key={i} className="profile-item">
                    <span className="profile-icon">{item.icon}</span>
                    <div>
                      <p className="profile-label">{item.label}</p>
                      <p className="profile-value">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
