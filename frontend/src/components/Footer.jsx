import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaWhatsapp } from 'react-icons/fa';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src="/mei_logo.png" alt="Meipuratchi" />
            <h3>மெய் புரட்சி</h3>
            <p>Empowering Tamil Nadu government school students with free career counseling and guidance.</p>
            <div className="footer-social">
              <a href="https://www.facebook.com/people/Mei-Puratchi/pfbid02CebTu4BGTjdLaneMEbRXa7QQwAxpHQ4tVukDr9XCAzokawjEC28d8YSeeang6JGFl/" target="_blank" rel="noreferrer"><FaFacebook /></a>
              <a href="https://x.com/meipuratchi" target="_blank" rel="noreferrer"><FaTwitter /></a>
              <a href="https://www.instagram.com/meipuratchi/" target="_blank" rel="noreferrer"><FaInstagram /></a>
              <a href="https://www.linkedin.com/in/%E0%AE%AE%E0%AF%86%E0%AE%AF%E0%AF%8D%E0%AE%AA%E0%AF%81%E0%AE%B0%E0%AE%9F%E0%AF%8D%E0%AE%9A%E0%AE%BF/" target="_blank" rel="noreferrer"><FaLinkedin /></a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/registration">Register</Link></li>
              <li><Link to="/engineering">Engineering</Link></li>
              <li><Link to="/paramedical">Paramedical</Link></li>
              <li><Link to="/team">Our Team</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Courses</h4>
            <ul>
              <li><Link to="/engineering">TNEA 2025</Link></li>
              <li><Link to="/paramedical">Paramedical Degree</Link></li>
              <li><Link to="/paramedical">DMLT</Link></li>
              <li><Link to="/registration">Career Guidance</Link></li>
              <li><Link to="/volunteer">Volunteer</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact</h4>
            <div className="footer-contact">
              <a href="tel:+917200282924"><FaPhone /> +91 72002 82924</a>
              <a href="https://chat.whatsapp.com/Fw3a4hxJnCB4aqVcOxUkK6" target="_blank" rel="noreferrer">
                <FaWhatsapp /> WhatsApp Group
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 Meipuratchi. Built with ❤️ by Young Volunteers for Tamil Nadu Students.</p>
        </div>
      </div>
    </footer>
  );
}
