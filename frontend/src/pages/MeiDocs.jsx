import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  FaBook, FaLock, FaSearch, FaCopy, FaCheck,
  FaYoutube, FaExternalLinkAlt, FaBars, FaTimes,
  FaClock, FaHome, FaChevronRight,
} from 'react-icons/fa';
import DOCS, { DOC_CATEGORIES } from './docsData';
import API_URL from '../config';
import './MeiDocs.css';

const ORG_KEY_STORAGE = 'meiDocsKey';

// ─── Read-state persistence ──────────────────────────────────
function getReadSet() {
  try { return new Set(JSON.parse(localStorage.getItem('meiDocsRead') || '[]')); }
  catch { return new Set(); }
}
function markRead(id) {
  const s = getReadSet(); s.add(id);
  localStorage.setItem('meiDocsRead', JSON.stringify([...s]));
}

// ─── CopyButton ──────────────────────────────────────────────
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button className={`md-copy-btn ${copied ? 'copied' : ''}`} onClick={copy}>
      {copied ? <><FaCheck /> Copied</> : <><FaCopy /> Copy</>}
    </button>
  );
}

// ─── Block Renderer ──────────────────────────────────────────
function DocBlock({ block }) {
  switch (block.type) {
    case 'heading':
      return <h1 className="md-heading">{block.text}</h1>;

    case 'subheading':
      return <h2 className="md-subheading">{block.text}</h2>;

    case 'para':
      return <p className="md-para">{block.text}</p>;

    case 'divider':
      return <hr className="md-divider" />;

    case 'note':
      return <div className="md-note">{block.text}</div>;

    case 'warning':
      return <div className="md-warning">⚠️ {block.text}</div>;

    case 'tip':
      return <div className="md-tip">💡 {block.text}</div>;

    case 'list':
      return (
        <ul className="md-list">
          {block.items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      );

    case 'step':
      return (
        <div className="md-step">
          <div className="md-step-num">{block.number}</div>
          <div className="md-step-body">
            <div className="md-step-title">{block.title}</div>
            <div className="md-step-text">{block.text}</div>
          </div>
        </div>
      );

    case 'code':
      return (
        <div className="md-code-wrap">
          <div className="md-code-header">
            <span className="md-code-lang">{block.lang || 'code'}</span>
            <CopyButton text={block.text} />
          </div>
          <pre className="md-code-block">{block.text}</pre>
        </div>
      );

    case 'video':
      return (
        <div className="md-video-wrap">
          <div className="md-video-frame">
            <iframe
              src={`https://www.youtube.com/embed/${block.youtubeId}?rel=0&modestbranding=1`}
              title={block.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="md-video-info">
            <p className="md-video-title">{block.title}</p>
            <p className="md-video-channel">
              <FaYoutube style={{ color: '#ff0000' }} />
              {block.channel}
            </p>
            {block.note && <p className="md-video-note">{block.note}</p>}
            <a
              href={`https://www.youtube.com/watch?v=${block.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="md-video-link"
            >
              <FaExternalLinkAlt /> Open on YouTube
            </a>
          </div>
        </div>
      );

    case 'table':
      return (
        <div className="md-table-wrap">
          <table className="md-table">
            <thead>
              <tr>{block.headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => <td key={ci}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    default:
      return null;
  }
}

// ─── Home Screen ─────────────────────────────────────────────
function HomeScreen({ onSelect }) {
  const readSet = getReadSet();
  const totalDocs = DOCS.length;
  const readCount = DOCS.filter(d => readSet.has(d.id)).length;
  const pct = Math.round((readCount / totalDocs) * 100);

  return (
    <div className="md-home">
      <div className="md-home-hero">
        <div className="md-home-hero-badge">
          <FaBook /> Internal Documentation
        </div>
        <h1>Welcome to meiDocs 📚</h1>
        <p>
          Your complete onboarding guide. Learn the tech stack, set up your environment,
          and ship features with confidence. Built for Meipuratchi interns and employees.
        </p>
      </div>

      {/* Progress */}
      <div className="md-progress-section">
        <h3>📊 Your Reading Progress</h3>
        <div className="md-progress-bar-wrap">
          <div className="md-progress-bar" style={{ width: `${pct}%` }} />
        </div>
        <div className="md-progress-label">
          <span>{readCount} of {totalDocs} docs read</span>
          <span>{pct}% complete</span>
        </div>
      </div>

      {/* Category cards */}
      <h2 className="md-subheading">Browse by Category</h2>
      <div className="md-home-grid">
        {DOC_CATEGORIES.map(cat => {
          const catDocs = DOCS.filter(d => d.category === cat.id);
          const catRead = catDocs.filter(d => readSet.has(d.id)).length;
          return (
            <div
              key={cat.id}
              className="md-home-card"
              onClick={() => onSelect(catDocs[0]?.id)}
            >
              <div className="md-home-card-icon">{cat.icon}</div>
              <div className="md-home-card-body">
                <h3>{cat.label}</h3>
                <p>{catDocs.length} doc{catDocs.length !== 1 ? 's' : ''} in this section</p>
                <span className="md-home-card-count">
                  {catRead}/{catDocs.length} read
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick links to key docs */}
      <h2 className="md-subheading">📌 Start Here — Recommended Order</h2>
      <div className="md-list">
        {[
          { id: 'welcome',          label: '1. Welcome to Meipuratchi — Project overview' },
          { id: 'onboarding-checklist', label: '2. Intern Onboarding Checklist' },
          { id: 'install-nodejs',   label: '3. Install Node.js' },
          { id: 'install-mongodb',  label: '4. Install MongoDB (Local + Atlas)' },
          { id: 'run-project',      label: '5. Run the Project Locally' },
          { id: 'install-vscode',   label: '6. VS Code Setup & Extensions' },
          { id: 'install-kiro',     label: '7. Kiro IDE — AI-Powered Development' },
          { id: 'mern-overview',    label: '8. MERN Stack Full Course (Video)' },
          { id: 'react-learning',   label: '9. React Complete Guide (Video)' },
          { id: 'mongodb-learning', label: '10. MongoDB Full Course (Video)' },
          { id: 'project-structure',label: '11. Project Structure Deep Dive' },
          { id: 'auth-flow',        label: '12. Authentication Flow' },
          { id: 'tickets-guide',    label: '13. Tickets System Guide' },
        ].map(({ id, label }) => (
          <li key={id} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => onSelect(id)}>
            <span>{label}</span>
            {readSet.has(id) && <span style={{ color: '#43a047', fontSize: '0.75rem', fontWeight: 700 }}>✓ Read</span>}
          </li>
        ))}
      </div>
    </div>
  );
}

// ─── Doc Page ────────────────────────────────────────────────
function DocPage({ doc }) {
  useEffect(() => {
    markRead(doc.id);
    window.scrollTo({ top: 0 });
  }, [doc.id]);

  return (
    <div className="md-doc-wrap">
      {doc.content.map((block, i) => (
        <div key={i} className="md-block">
          <DocBlock block={block} />
        </div>
      ))}
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────
function Sidebar({ activeId, onSelect, sidebarOpen, setSidebarOpen, onLock, userInfo, searchQ, setSearchQ }) {
  const readSet = getReadSet();

  const filteredDocs = searchQ.trim()
    ? DOCS.filter(d =>
        d.title.toLowerCase().includes(searchQ.toLowerCase()) ||
        DOC_CATEGORIES.find(c => c.id === d.category)?.label.toLowerCase().includes(searchQ.toLowerCase())
      )
    : null;

  const initials = userInfo?.name
    ? userInfo.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'ME';

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`md-sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`md-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="md-sidebar-header">
          <div className="md-sidebar-logo">
            <span className="md-sidebar-logo-icon">📚</span>
            <div className="md-sidebar-logo-text">
              <strong>meiDocs</strong>
              <span>Meipuratchi Portal</span>
            </div>
          </div>
          <input
            type="text"
            className="md-sidebar-search"
            placeholder="🔍 Search docs…"
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
          />
        </div>

        {/* Nav */}
        <nav className="md-sidebar-nav">
          {/* Home */}
          <button
            className={`md-nav-item ${activeId === '__home__' ? 'active' : ''}`}
            onClick={() => { onSelect('__home__'); setSidebarOpen(false); }}
          >
            <span className="md-nav-item-icon">🏠</span>
            Home
          </button>

          {/* Search results OR categorised list */}
          {filteredDocs ? (
            <>
              <div className="md-cat-label">Search Results ({filteredDocs.length})</div>
              {filteredDocs.map(doc => (
                <button
                  key={doc.id}
                  className={`md-nav-item ${activeId === doc.id ? 'active' : ''}`}
                  onClick={() => { onSelect(doc.id); setSidebarOpen(false); }}
                >
                  <span className="md-nav-item-icon">{doc.icon}</span>
                  {doc.title}
                  {readSet.has(doc.id) && <span style={{ marginLeft: 'auto', fontSize: '0.65rem', color: '#43a047' }}>✓</span>}
                </button>
              ))}
            </>
          ) : (
            DOC_CATEGORIES.map(cat => {
              const catDocs = DOCS.filter(d => d.category === cat.id);
              return (
                <div key={cat.id}>
                  <div className="md-cat-label">{cat.icon} {cat.label}</div>
                  {catDocs.map(doc => (
                    <button
                      key={doc.id}
                      className={`md-nav-item ${activeId === doc.id ? 'active' : ''}`}
                      onClick={() => { onSelect(doc.id); setSidebarOpen(false); }}
                    >
                      <span className="md-nav-item-icon">{doc.icon}</span>
                      {doc.title}
                      {readSet.has(doc.id) && <span style={{ marginLeft: 'auto', fontSize: '0.65rem', color: '#43a047' }}>✓</span>}
                    </button>
                  ))}
                </div>
              );
            })
          )}
        </nav>

        {/* Footer */}
        <div className="md-sidebar-footer">
          <div className="md-sidebar-user">
            <div className="md-sidebar-avatar">{initials}</div>
            <div className="md-sidebar-username">
              <strong>{userInfo?.name || 'Team Member'}</strong>
              <span>{userInfo?.department || userInfo?.role || 'Meipuratchi'}</span>
            </div>
          </div>
          <button className="md-lock-btn" onClick={onLock} title="Lock docs">🔒</button>
        </div>
      </aside>
    </>
  );
}

// ─── Main MeiDocs Component ───────────────────────────────────
export default function MeiDocs() {
  // ── Auth state ──
  const [authed, setAuthed]     = useState(() => !!localStorage.getItem(ORG_KEY_STORAGE));
  const [orgKey, setOrgKey]     = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [authErr, setAuthErr]   = useState('');
  const [checking, setChecking] = useState(false);
  const [userInfo]              = useState(() => {
    try { return JSON.parse(localStorage.getItem('userInfo') || '{}'); }
    catch { return {}; }
  });

  // ── Navigation state ──
  const [activeId, setActiveId]       = useState('__home__');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQ, setSearchQ]         = useState('');

  // On mount: if key cached, try to use it
  useEffect(() => {
    const cached = localStorage.getItem(ORG_KEY_STORAGE);
    if (cached) setOrgKey(cached);
  }, []);

  // ── Verify org key (same endpoint as Tickets) ──
  const verify = async (e) => {
    e.preventDefault();
    setChecking(true);
    setAuthErr('');
    try {
      await axios.post(`${API_URL}/api/tickets/org/verify`, { key: keyInput });
      localStorage.setItem(ORG_KEY_STORAGE, keyInput);
      setOrgKey(keyInput);
      setAuthed(true);
      toast.success('Access granted! Welcome to meiDocs 📚');
    } catch (err) {
      setAuthErr(err.response?.data?.message || 'Invalid key. Contact your team lead.');
    } finally {
      setChecking(false);
    }
  };

  const lock = () => {
    localStorage.removeItem(ORG_KEY_STORAGE);
    setAuthed(false);
    setOrgKey('');
    setKeyInput('');
    setActiveId('__home__');
  };

  const selectDoc = useCallback((id) => {
    setActiveId(id);
    setSearchQ('');
  }, []);

  // ── Active doc ──
  const activeDoc = activeId !== '__home__' ? DOCS.find(d => d.id === activeId) : null;

  // ─── Gate Screen ──────────────────────────────────────────
  if (!authed) {
    return (
      <div className="md-page">
        <div className="md-gate">
          <div className="md-gate-card">
            <span className="md-gate-logo">📚</span>
            <h1>meiDocs</h1>
            <p className="md-gate-brand">மெய் புரட்சி — Internal Documentation Portal</p>

            <form className="md-gate-form" onSubmit={verify}>
              <div className="md-gate-input-wrap">
                <FaLock className="md-gate-key-icon" />
                <input
                  type="password"
                  className="md-gate-input"
                  placeholder="Enter organisation access key…"
                  value={keyInput}
                  onChange={e => setKeyInput(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              {authErr && <p className="md-gate-err">{authErr}</p>}
              <button type="submit" className="md-gate-btn" disabled={checking}>
                {checking
                  ? <><span>Verifying…</span></>
                  : <><FaBook /> Access Documentation</>
                }
              </button>
            </form>

            <p className="md-gate-hint">
              Uses the same key as the Tickets portal.<br />
              Available to employees and interns only.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Active category for breadcrumb ───
  const activeCategory = activeDoc
    ? DOC_CATEGORIES.find(c => c.id === activeDoc.category)
    : null;

  // ─── App Shell ────────────────────────────────────────────
  return (
    <div className="md-page">
      <div className="md-app">
        {/* Sidebar */}
        <Sidebar
          activeId={activeId}
          onSelect={selectDoc}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onLock={lock}
          userInfo={userInfo}
          searchQ={searchQ}
          setSearchQ={setSearchQ}
        />

        {/* Content area */}
        <div className="md-content">
          {/* Top bar */}
          <div className="md-topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              <button
                className="md-menu-btn"
                onClick={() => setSidebarOpen(v => !v)}
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? <FaTimes /> : <FaBars />}
              </button>
              <div className="md-topbar-breadcrumb">
                <span
                  style={{ cursor: 'pointer', color: '#192441' }}
                  onClick={() => selectDoc('__home__')}
                >
                  <FaHome />
                </span>
                {activeCategory && (
                  <>
                    <FaChevronRight style={{ fontSize: '0.65rem' }} />
                    <span>{activeCategory.icon} {activeCategory.label}</span>
                  </>
                )}
                {activeDoc && (
                  <>
                    <FaChevronRight style={{ fontSize: '0.65rem' }} />
                    <strong>{activeDoc.title}</strong>
                  </>
                )}
              </div>
            </div>

            <div className="md-topbar-right">
              {activeDoc && (
                <span className="md-readtime">
                  <FaClock /> {activeDoc.readTime}
                </span>
              )}
            </div>
          </div>

          {/* Page content */}
          {activeId === '__home__'
            ? <HomeScreen onSelect={selectDoc} />
            : activeDoc
              ? <DocPage key={activeDoc.id} doc={activeDoc} />
              : (
                <div style={{ padding: '60px 48px', textAlign: 'center', color: '#9aaabf' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔍</div>
                  <p>Document not found. Pick one from the sidebar.</p>
                </div>
              )
          }
        </div>
      </div>
    </div>
  );
}
