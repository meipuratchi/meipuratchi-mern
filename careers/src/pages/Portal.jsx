import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBriefcase, FaUser, FaSignOutAlt, FaArrowRight, FaEnvelope, FaPaperPlane } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getMyApps, getMyApp, sendAppMessage, getCareerMe } from '../api';
import './Portal.css';

const STATUS_MAP = {
  applied:      { label: 'Applied',       cls: 'badge-applied' },
  under_review: { label: 'Under Review',  cls: 'badge-under_review' },
  shortlisted:  { label: 'Shortlisted',   cls: 'badge-shortlisted' },
  selected:     { label: 'Selected',      cls: 'badge-selected' },
  offer_sent:   { label: 'Offer Sent',    cls: 'badge-offer_sent' },
  completed:    { label: 'Completed',     cls: 'badge-completed' },
  rejected:     { label: 'Not Selected',  cls: 'badge-rejected' },
};

function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || { label: status, cls: 'badge-applied' };
  return <span className={`badge ${s.cls}`}>{s.label}</span>;
}

function MessageThread({ app }) {
  const [msg, setMsg]       = useState('');
  const [sending, setSend]  = useState(false);
  const [msgs, setMsgs]     = useState(app.messages || []);

  const send = async () => {
    if (!msg.trim()) return;
    setSend(true);
    try {
      await sendAppMessage(app._id, msg);
      setMsgs([...msgs, { from: app.name, text: msg, sentAt: new Date().toISOString() }]);
      setMsg('');
      toast.success('Message sent');
    } catch { toast.error('Failed to send'); }
    finally { setSend(false); }
  };

  return (
    <div className="message-thread">
      <div className="thread-list">
        {msgs.length === 0 && <p className="no-msgs">No messages yet.</p>}
        {msgs.map((m, i) => (
          <div key={i} className={`msg-bubble ${m.from === 'admin' ? 'from-admin' : 'from-user'}`}>
            <span className="msg-who">{m.from === 'admin' ? 'Meipuratchi Team' : 'You'}</span>
            <p>{m.text}</p>
            <span className="msg-time">{new Date(m.sentAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</span>
          </div>
        ))}
      </div>
      <div className="msg-compose">
        <input
          type="text"
          value={msg}
          onChange={e => setMsg(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Type a message…"
          disabled={sending}
        />
        <button className="btn btn-primary btn-sm" onClick={send} disabled={sending || !msg.trim()}>
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}

function AppDetail({ appId, onBack }) {
  const [app, setApp]         = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyApp(appId)
      .then(r => setApp(r.data.data))
      .catch(() => toast.error('Failed to load application'))
      .finally(() => setLoading(false));
  }, [appId]);

  if (loading) return <div className="portal-loading">Loading…</div>;
  if (!app)    return <div className="portal-loading">Application not found.</div>;

  return (
    <div className="app-detail anim-up">
      <button className="portal-back" onClick={onBack}>← Back to applications</button>
      <div className="app-detail-header">
        <h2>{app.jobTitle}</h2>
        <StatusBadge status={app.status} />
      </div>
      <div className="app-detail-meta">
        <span>Applied {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        {app.resumeLink && <a href={app.resumeLink} target="_blank" rel="noreferrer">View Resume →</a>}
        {app.portfolioLink && <a href={app.portfolioLink} target="_blank" rel="noreferrer">Portfolio →</a>}
        {app.linkedinUrl && <a href={app.linkedinUrl} target="_blank" rel="noreferrer">LinkedIn →</a>}
      </div>
      {app.coverLetter && (
        <div className="app-detail-section">
          <h4>Cover Letter</h4>
          <p>{app.coverLetter}</p>
        </div>
      )}
      <div className="app-detail-section">
        <h4>Messages with Meipuratchi Team</h4>
        <MessageThread app={app} />
      </div>
    </div>
  );
}

export default function Portal() {
  const navigate  = useNavigate();
  const user      = JSON.parse(localStorage.getItem('careerUser') || 'null');
  const [apps, setApps]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    getMyApps()
      .then(r => setApps(r.data.data))
      .catch(() => toast.error('Failed to load applications'))
      .finally(() => setLoading(false));
  }, []);

  const logout = () => {
    localStorage.removeItem('careerToken');
    localStorage.removeItem('careerUser');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="portal-page">
      <div className="portal-header">
        <div className="container portal-header-inner">
          <div className="portal-brand">
            <img src="/mei_logo.png" alt="Meipuratchi" />
            <div>
              <strong>My Applications</strong>
              <span>Meipuratchi Careers</span>
            </div>
          </div>
          <div className="portal-header-right">
            <div className="portal-user">
              <FaUser />
              <span>{user.name}</span>
            </div>
            <Link to="/" className="btn btn-outline-dark btn-sm">Browse Jobs</Link>
            <button className="portal-logout" onClick={logout}><FaSignOutAlt /></button>
          </div>
        </div>
      </div>

      <div className="portal-main container">
        {selectedApp ? (
          <AppDetail appId={selectedApp} onBack={() => setSelectedApp(null)} />
        ) : (
          <>
            <div className="portal-welcome">
              <h2>Welcome back, {user.name} 👋</h2>
              <p>Track your applications and messages below.</p>
            </div>

            {loading ? (
              <div className="portal-loading">Loading your applications…</div>
            ) : apps.length === 0 ? (
              <div className="portal-empty">
                <FaBriefcase />
                <h3>No applications yet</h3>
                <p>Find a role that excites you and apply — it only takes a few minutes.</p>
                <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>View Open Positions</Link>
              </div>
            ) : (
              <div className="portal-apps-list">
                {apps.map(a => (
                  <div key={a._id} className="portal-app-card" onClick={() => setSelectedApp(a._id)}>
                    <div className="pac-left">
                      <h3>{a.jobTitle}</h3>
                      <div className="pac-meta">
                        <span>Applied {new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        {a.messages?.length > 0 && <span><FaEnvelope /> {a.messages.filter(m => m.from === 'admin' && !m.read).length > 0 ? '● ' : ''}{a.messages.length} message{a.messages.length > 1 ? 's' : ''}</span>}
                      </div>
                    </div>
                    <div className="pac-right">
                      <StatusBadge status={a.status} />
                      <FaArrowRight className="pac-arrow" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
