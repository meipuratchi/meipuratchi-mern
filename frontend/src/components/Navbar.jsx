import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUserCircle, FaSignOutAlt, FaChevronDown, FaGraduationCap, FaCode, FaBriefcase, FaBook, FaUsers, FaHome, FaPhone } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

const NAV_GROUPS = [
  {
    label: 'Guidance',
    icon: <FaGraduationCap />,
    links: [
      { to: '/engineering',    label: 'Engineering',   sub: 'TNEA cutoffs & colleges' },
      { to: '/paramedical',    label: 'Paramedical',   sub: 'Degree courses & eligibility' },
      { to: '/registration',   label: 'Register',      sub: 'Free career guidance' },
      { to: '/ilamaiyil-kal',  label: 'இளமையில் கல்', sub: 'Knowledge resources' },
    ],
  },
  {
    label: 'Business',
    icon: <FaBriefcase />,
    links: [
      { to: '/business', label: '🚀 MeiBuilds', sub: 'Web design for local businesses' },
    ],
  },
  {
    label: 'SCL Tools',
    icon: <FaCode />,
    links: [
      { to: '/meicode',  label: '💻 MeiCode',   sub: 'DSA roadmap & LeetCode' },
      { to: '/meidocs',  label: '📚 meiDocs',   sub: 'Internal documentation' },
    ],
  },
];

const PLAIN_LINKS = [
  { to: '/our-team',  label: 'Team',      icon: <FaUsers /> },
  { to: '/volunteer', label: 'Volunteer', icon: <FaBook /> },
  { to: '/contact',   label: 'Contact',   icon: <FaPhone /> },
];

export default function Navbar() {
  const [open, setOpen]           = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [activeGroup, setActiveGroup] = useState(null);
  const [userInfo, setUserInfo]   = useState(null);
  const location  = useLocation();
  const navigate  = useNavigate();
  const dropRef   = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setActiveGroup(null);
    const info = localStorage.getItem('userInfo');
    setUserInfo(info ? JSON.parse(info) : null);
  }, [location]);

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setActiveGroup(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    navigate('/');
  };

  const solidPages = [
    '/engineering', '/paramedical', '/our-team', '/volunteer',
    '/contact', '/registration', '/tickets', '/meidocs',
    '/ilamaiyil-kal', '/meicode', '/business',
  ];
  const isSolid = solidPages.some(p => location.pathname.startsWith(p));
  const isHome  = location.pathname === '/';

  return (
    <motion.nav
      className={`navbar3 ${scrolled ? 'scrolled' : ''} ${isSolid ? 'solid' : ''}`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container nav3-inner" ref={dropRef}>

        {/* Brand */}
        <Link to="/" className="nav3-brand">
          <motion.img
            src="/mei_logo.png"
            alt="Meipuratchi"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
          />
          <span className="nav3-brand-text">
            <span className="nav3-brand-ta">மெய் புரட்சி</span>
            <span className="nav3-brand-ver">3.0</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="nav3-links">
          {/* Home */}
          <li>
            <Link to="/" className={`nav3-link ${location.pathname === '/' ? 'active' : ''}`}>
              Home
            </Link>
          </li>

          {/* Dropdown groups */}
          {NAV_GROUPS.map(group => (
            <li key={group.label} className="nav3-group">
              <button
                className={`nav3-link nav3-group-btn ${activeGroup === group.label ? 'active' : ''}`}
                onClick={() => setActiveGroup(activeGroup === group.label ? null : group.label)}
                aria-expanded={activeGroup === group.label}
              >
                {group.icon} {group.label} <FaChevronDown className={`nav3-chevron ${activeGroup === group.label ? 'open' : ''}`} />
              </button>

              <AnimatePresence>
                {activeGroup === group.label && (
                  <motion.div
                    className="nav3-dropdown"
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {group.links.map(l => (
                      <Link
                        key={l.to}
                        to={l.to}
                        className={`nav3-drop-item ${location.pathname.startsWith(l.to) ? 'active' : ''}`}
                        onClick={() => setActiveGroup(null)}
                      >
                        <span className="nav3-drop-label">{l.label}</span>
                        <span className="nav3-drop-sub">{l.sub}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ))}

          {/* Plain links */}
          {PLAIN_LINKS.map(l => (
            <li key={l.to}>
              <Link
                to={l.to}
                className={`nav3-link ${location.pathname === l.to ? 'active' : ''}`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="nav3-actions">
          {userInfo ? (
            <div className="nav3-user">
              <Link to="/portal" className="nav3-portal-btn">
                <FaUserCircle /> {userInfo.name.split(' ')[0]}
              </Link>
              <motion.button
                className="nav3-logout"
                onClick={logout}
                title="Logout"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaSignOutAlt />
              </motion.button>
            </div>
          ) : (
            <Link to="/registration" className="nav3-cta">
              Register Free
            </Link>
          )}

          {/* Hamburger */}
          <button
            className="nav3-hamburger"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile drawer — rendered as portal-like sibling outside nav flow */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="nav3-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="nav3-mobile"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            >
              {/* Drawer header */}
              <div className="nav3-mobile-head">
                <div className="nav3-mobile-brand">
                  <img src="/mei_logo.png" alt="Meipuratchi" />
                  <span className="nav3-mobile-title">மெய் புரட்சி <em>3.0</em></span>
                </div>
                <button onClick={() => setOpen(false)} className="nav3-mobile-close" aria-label="Close menu">
                  <FaTimes />
                </button>
              </div>

              {/* Drawer links */}
              <div className="nav3-mobile-body">
                <Link to="/" className={`nav3-mob-link ${location.pathname === '/' ? 'mob-active' : ''}`} onClick={() => setOpen(false)}>
                  <span className="nav3-mob-icon"><FaHome /></span>
                  <span className="nav3-mob-label">Home</span>
                </Link>

                {NAV_GROUPS.map(group => (
                  <div key={group.label} className="nav3-mob-section">
                    <span className="nav3-mob-section-title">
                      <span className="nav3-mob-section-icon">{group.icon}</span>
                      {group.label}
                    </span>
                    {group.links.map(l => (
                      <Link
                        key={l.to}
                        to={l.to}
                        className={`nav3-mob-link nav3-mob-indent ${location.pathname.startsWith(l.to) ? 'mob-active' : ''}`}
                        onClick={() => setOpen(false)}
                      >
                        <span className="nav3-mob-label">{l.label}</span>
                        <span className="nav3-mob-sub">{l.sub}</span>
                      </Link>
                    ))}
                  </div>
                ))}

                <div className="nav3-mob-divider" />

                {PLAIN_LINKS.map(l => (
                  <Link
                    key={l.to}
                    to={l.to}
                    className={`nav3-mob-link ${location.pathname === l.to ? 'mob-active' : ''}`}
                    onClick={() => setOpen(false)}
                  >
                    <span className="nav3-mob-icon">{l.icon}</span>
                    <span className="nav3-mob-label">{l.label}</span>
                  </Link>
                ))}
              </div>

              {/* Drawer footer CTA */}
              <div className="nav3-mobile-foot">
                {userInfo ? (
                  <>
                    <Link
                      to="/portal"
                      className="nav3-mob-cta"
                      onClick={() => setOpen(false)}
                    >
                      <FaUserCircle /> {userInfo.name.split(' ')[0]}
                    </Link>
                    <button
                      className="nav3-mob-logout"
                      onClick={() => { logout(); setOpen(false); }}
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/registration"
                    className="nav3-mob-cta nav3-mob-cta--accent"
                    onClick={() => setOpen(false)}
                  >
                    <FaGraduationCap /> Register Free — No Cost
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
