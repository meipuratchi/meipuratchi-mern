import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import './Navbar.css';

const links = [
  { to: '/', label: 'Home' },
  { to: '/registration', label: 'Register' },
  { to: '/engineering', label: 'Engineering' },
  { to: '/paramedical', label: 'Paramedical' },
  { to: '/team', label: 'Our Team' },
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

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <img src="/mei_logo.png" alt="Meipuratchi" />
          <span>மெய் புரட்சி</span>
        </Link>

        <button className="nav-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <FaTimes /> : <FaBars />}
        </button>

        <ul className={`nav-links ${open ? 'open' : ''}`}>
          {links.map(l => (
            <li key={l.to}>
              <Link to={l.to} className={location.pathname === l.to ? 'active' : ''}>
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            {userInfo ? (
              <div className="nav-user-menu">
                <Link to="/portal" className="nav-portal-btn">
                  <FaUserCircle /> {userInfo.name.split(' ')[0]}
                </Link>
                <button className="nav-logout-btn" onClick={logout} title="Logout">
                  <FaSignOutAlt />
                </button>
              </div>
            ) : (
              <Link to="/registration" className="nav-cta">Register Free</Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
