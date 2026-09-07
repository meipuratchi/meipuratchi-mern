import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaWhatsapp, FaArrowRight, FaHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './Footer.css';

const FOOTER_COLS = [
  {
    heading: 'Career Guidance',
    links: [
      { to: '/registration',  label: 'Register Free' },
      { to: '/engineering',   label: 'Engineering (TNEA)' },
      { to: '/paramedical',   label: 'Paramedical Courses' },
      { to: '/ilamaiyil-kal', label: 'இளமையில் கல்' },
    ],
  },
  {
    heading: 'MeiBuilds',
    links: [
      { to: '/business',  label: 'Web Design Services' },
      { to: '/business',  label: 'MERN Stack Websites' },
      { to: '/business',  label: 'Free for 1st 100 Clients' },
      { to: '/contact',   label: 'Get a Quote' },
    ],
  },
  {
    heading: 'Tech Hub',
    links: [
      { to: '/meicode',   label: '💻 MeiCode DSA' },
      { to: '/meidocs',   label: '📚 meiDocs Portal' },
      { to: '/our-team',  label: 'Our Team' },
      { to: '/volunteer', label: 'Volunteer' },
    ],
  },
];

export default function Footer() {
  const [ref, inView] = useInView({ threshold: 0.08, triggerOnce: true });

  return (
    <footer className="footer3" ref={ref}>
      {/* Top wave divider */}
      <div className="footer3-wave" aria-hidden="true">
        <svg viewBox="0 0 1440 56" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,32 C240,56 480,8 720,32 C960,56 1200,8 1440,32 L1440,56 L0,56 Z" fill="#0d1b2a" />
        </svg>
      </div>

      <div className="footer3-body">
        <div className="container footer3-grid">

          {/* Brand column */}
          <motion.div
            className="footer3-brand"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}
          >
            <div className="footer3-logo">
              <img src="/mei_logo.png" alt="Meipuratchi" />
              <div>
                <h3>மெய் புரட்சி</h3>
                <span className="footer3-ver">3.0</span>
              </div>
            </div>
            <p className="footer3-tagline">
              Empowering Tamil Nadu government school students with free career counseling — and helping local businesses grow online with affordable web solutions.
            </p>

            {/* Contact chips */}
            <div className="footer3-contact-chips">
              <a href="tel:+917200282924" className="footer3-chip">
                <FaPhone /> +91 72002 82924
              </a>
              <a href="https://chat.whatsapp.com/LM8lhAO5wReB5V4Yes1DXq" target="_blank" rel="noopener noreferrer" className="footer3-chip footer3-chip--wa">
                <FaWhatsapp /> WhatsApp Community
              </a>
            </div>

            {/* Socials */}
            <div className="footer3-socials">
              {[
                { href: 'https://www.facebook.com/people/Mei-Puratchi/pfbid02CebTu4BGTjdLaneMEbRXa7QQwAxpHQ4tVukDr9XCAzokawjEC28d8YSeeang6JGFl/', icon: <FaFacebook />, label: 'Facebook' },
                { href: 'https://x.com/meipuratchi', icon: <FaTwitter />, label: 'Twitter' },
                { href: 'https://www.instagram.com/meipuratchi/', icon: <FaInstagram />, label: 'Instagram' },
                { href: 'https://www.linkedin.com/in/%E0%AE%AE%E0%AF%86%E0%AE%AF%E0%AF%8D%E0%AE%AA%E0%AF%81%E0%AE%B0%E0%AE%9F%E0%AF%8D%E0%AE%9A%E0%AE%BF/', icon: <FaLinkedin />, label: 'LinkedIn' },
              ].map(s => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer3-social-btn"
                  aria-label={s.label}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.92 }}
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Link columns */}
          {FOOTER_COLS.map((col, ci) => (
            <motion.div
              key={col.heading}
              className="footer3-col"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + ci * 0.08, ease: [0.22,1,0.36,1] }}
            >
              <h4 className="footer3-col-head">{col.heading}</h4>
              <ul>
                {col.links.map(l => (
                  <li key={l.label}>
                    <Link to={l.to} className="footer3-col-link">
                      <FaArrowRight className="footer3-arrow" /> {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="footer3-bottom">
          <div className="container footer3-bottom-inner">
            <p className="footer3-copy">
              © 2026 Meipuratchi. Built with <FaHeart className="footer3-heart" /> by young volunteers for Tamil Nadu students.
            </p>
            <div className="footer3-bottom-links">
              <Link to="/contact">Contact</Link>
              <Link to="/volunteer">Volunteer</Link>
              <Link to="/business">MeiBuilds</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
