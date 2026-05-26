import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaWhatsapp } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './Footer.css';

export default function Footer() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <footer className="footer" ref={ref}>
      <div className="container">
        <motion.div 
          className="footer-grid"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.div className="footer-brand" variants={itemVariants}>
            <motion.img 
              src="/mei_logo.png" 
              alt="Meipuratchi"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            />
            <h3>மெய் புரட்சி</h3>
            <p>Empowering Tamil Nadu government school students with dedicated career counseling and guidance.</p>
            <div className="footer-social">
              <motion.a 
                href="https://www.facebook.com/people/Mei-Puratchi/pfbid02CebTu4BGTjdLaneMEbRXa7QQwAxpHQ4tVukDr9XCAzokawjEC28d8YSeeang6JGFl/" 
                target="_blank" 
                rel="noreferrer"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaFacebook />
              </motion.a>
              <motion.a 
                href="https://x.com/meipuratchi" 
                target="_blank" 
                rel="noreferrer"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTwitter />
              </motion.a>
              <motion.a 
                href="https://www.instagram.com/meipuratchi/" 
                target="_blank" 
                rel="noreferrer"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaInstagram />
              </motion.a>
              <motion.a 
                href="https://www.linkedin.com/in/%E0%AE%AE%E0%AF%86%E0%AE%AF%E0%AF%8D%E0%AE%AA%E0%AF%81%E0%AE%B0%E0%AE%9F%E0%AF%8D%E0%AE%9A%E0%AE%BF/" 
                target="_blank" 
                rel="noreferrer"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaLinkedin />
              </motion.a>
            </div>
          </motion.div>

          <motion.div className="footer-col" variants={itemVariants}>
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/registration">Register</Link></li>
              <li><Link to="/engineering">Engineering</Link></li>
              <li><Link to="/paramedical">Paramedical</Link></li>
              <li><Link to="/our-team">Our Team</Link></li>
            </ul>
          </motion.div>

          <motion.div className="footer-col" variants={itemVariants}>
            <h4>Courses</h4>
            <ul>
              <li><Link to="/engineering">TNEA 2026</Link></li>
              <li><Link to="/paramedical">Paramedical Degree</Link></li>
              <li><Link to="/paramedical">DMLT</Link></li>
              <li><Link to="/registration">Career Guidance</Link></li>
              <li><Link to="/volunteer">Volunteer</Link></li>
            </ul>
          </motion.div>

          <motion.div className="footer-col" variants={itemVariants}>
            <h4>Contact</h4>
            <div className="footer-contact">
              <motion.a 
                href="tel:+917200282924"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <FaPhone /> +91 72002 82924
              </motion.a>
              <motion.a 
                href="https://chat.whatsapp.com/LM8lhAO5wReB5V4Yes1DXq" 
                target="_blank" 
                rel="noreferrer"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <FaWhatsapp /> WhatsApp Community
              </motion.a>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="footer-bottom"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <p>© 2026 Meipuratchi. Built with ❤️ by Young Volunteers for Tamil Nadu Students.</p>
        </motion.div>
      </div>
    </footer>
  );
}
