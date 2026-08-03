import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUserCircle, FaSignOutAlt, FaHistory } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

const links = [
  { to: '/', label: 'Home' },
  { to: '/registration', label: 'Register' },
  { to: '/engineering', label: 'Engineering' },
  { to: '/paramedical', label: 'Paramedical' },
  { to: '/our-team', label: 'Our Team' },
  { to: '/volunteer', label: 'Volunteer' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Re-check login state on every route change
  useEffect(() => {
    setOpen(false);
    const info = localStorage.getItem('userInfo');
    setUserInfo(info ? JSON.parse(info) : null);
  }, [location]);

  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    navigate('/');
  };

  // Pages where navbar should always be solid (light/white background)
  const solidPages = ['/engineering/choice-filling', '/engineering', '/our-team', '/volunteer', '/contact', '/registration', '/paramedical', '/tickets'];
  const isSolid = solidPages.some(p => location.pathname.startsWith(p));

  return (
    <motion.nav 
      className={`navbar ${scrolled ? 'scrolled' : ''} ${isSolid ? 'navbar--solid' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <motion.img 
            src="/mei_logo.png" 
            alt="Meipuratchi"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
          />
          <span>மெய் புரட்சி</span>
        </Link>

        <motion.button 
          className="nav-toggle" 
          onClick={() => setOpen(!open)} 
          aria-label="Toggle menu"
          whileTap={{ scale: 0.9 }}
        >
          {open ? <FaTimes /> : <FaBars />}
        </motion.button>

        {/* Backdrop for mobile menu */}
        {open && <div className="nav-backdrop" onClick={() => setOpen(false)} />}

        <AnimatePresence>
          <ul className={`nav-links ${open ? 'open' : ''}`}>
            {links.map((l, i) => (
              <motion.li 
                key={l.to}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              >
                <Link 
                  to={l.to} 
                  className={location.pathname === l.to ? 'active' : ''}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              </motion.li>
            ))}
            <motion.li
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (links.length - 0.5) * 0.05, duration: 0.3 }}
            >
              <a
                href="https://meipuratchi.github.io/registration/"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-old-view"
                onClick={() => setOpen(false)}
              >
                <FaHistory /> Old View
              </a>
            </motion.li>
            <motion.li
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: links.length * 0.05, duration: 0.3 }}
            >
              {userInfo ? (
                <div className="nav-user-menu">
                  <Link to="/portal" className="nav-portal-btn" onClick={() => setOpen(false)}>
                    <FaUserCircle /> {userInfo.name.split(' ')[0]}
                  </Link>
                  <motion.button 
                    className="nav-logout-btn" 
                    onClick={logout} 
                    title="Logout"
                    whileHover={{ scale: 1.1, rotate: 15 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaSignOutAlt />
                  </motion.button>
                </div>
              ) : (
                <Link to="/registration" className="nav-cta" onClick={() => setOpen(false)}>Register Now</Link>
              )}
            </motion.li>
          </ul>
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
