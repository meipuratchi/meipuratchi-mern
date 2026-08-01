import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="careers-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <img src="/mei_logo.png" alt="Meipuratchi" />
          <div>
            <strong>Meipuratchi Careers</strong>
            <p>Join our mission to guide Tamil Nadu students.</p>
          </div>
        </div>
        <div className="footer-links">
          <Link to="/">Open Positions</Link>
          <Link to="/terms">Terms &amp; Conditions</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <a href="https://meipuratchi.in" target="_blank" rel="noreferrer">Main Site</a>
        </div>
        <p className="footer-copy">© {new Date().getFullYear()} Meipuratchi. All rights reserved.</p>
      </div>
    </footer>
  );
}
