import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBriefcase, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

export default function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const user      = JSON.parse(localStorage.getItem('careerUser') || 'null');
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem('careerToken');
    localStorage.removeItem('careerUser');
    navigate('/login');
  };

  const active = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="careers-nav">
      <div className="nav-inner container">
        <Link to="/" className="nav-brand">
          <img src="/mei_logo.png" alt="Meipuratchi" />
          <div>
            <span className="brand-main">Meipuratchi</span>
            <span className="brand-sub">Careers</span>
          </div>
        </Link>

        <div className={`nav-links ${open ? 'open' : ''}`}>
          <Link to="/" className={active('/')} onClick={() => setOpen(false)}>Jobs</Link>
          <Link to="/terms" className={active('/terms')} onClick={() => setOpen(false)}>Terms</Link>
          <Link to="/privacy" className={active('/privacy')} onClick={() => setOpen(false)}>Privacy</Link>
          {user ? (
            <>
              <Link to="/portal" className={`nav-portal-btn ${active('/portal')}`} onClick={() => setOpen(false)}>
                <FaUser /> My Applications
              </Link>
              <button className="nav-logout" onClick={logout}><FaSignOutAlt /></button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-login-btn" onClick={() => setOpen(false)}>Login</Link>
              <Link to="/register" className="btn btn-accent btn-sm" onClick={() => setOpen(false)}>Create Account</Link>
            </>
          )}
        </div>

        <button className="nav-burger" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
}
