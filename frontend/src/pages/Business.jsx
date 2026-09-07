import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FaRocket, FaCheckCircle, FaCode, FaMobile, FaSearch,
  FaShieldAlt, FaPalette, FaServer, FaWhatsapp, FaPhone,
  FaArrowRight, FaStar, FaBuilding, FaStore, FaHospital,
  FaCut, FaUtensils, FaGraduationCap, FaLaptopCode,
  FaExternalLinkAlt, FaTimes, FaEnvelope, FaUser,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from '../components/AnimatedSection';
import API_URL from '../config';
import './Business.css';

/* ── Data ─────────────────────────────────────────────────── */
const SERVICES = [
  {
    icon: <FaCode />,
    title: 'MERN Stack Website',
    badge: 'Most Popular',
    price: 'Free for 1st 100',
    desc: 'Full-featured React frontend + Node/Express backend + MongoDB database. Fast, scalable and modern.',
    features: ['React.js frontend', 'Node.js + Express API', 'MongoDB database', 'JWT authentication', 'Admin dashboard', 'Mobile responsive'],
    color: '#192441',
  },
  {
    icon: <FaPalette />,
    title: 'Static Business Website',
    badge: 'Quick & Simple',
    price: 'Free for 1st 100',
    desc: 'Clean, fast HTML/CSS/JS website — perfect for showcasing your business without complexity.',
    features: ['Lightning fast loading', 'Custom design', 'SEO optimised', 'Contact form', 'Google Maps embed', 'Social media links'],
    color: '#2563eb',
  },
  {
    icon: <FaMobile />,
    title: 'E-Commerce Store',
    badge: 'Sell Online',
    price: 'Paid plan',
    desc: 'Complete online store with product catalogue, cart, payments and order management.',
    features: ['Product catalogue', 'Shopping cart & checkout', 'Payment gateway', 'Order tracking', 'Inventory management', 'WhatsApp integration'],
    color: '#f5a623',
  },
];

const TECH_STACK = [
  { name: 'React.js', desc: 'Modern UI framework', icon: '⚛️' },
  { name: 'Node.js', desc: 'Backend runtime', icon: '🟢' },
  { name: 'Express', desc: 'API framework', icon: '🚂' },
  { name: 'MongoDB', desc: 'Database', icon: '🍃' },
  { name: 'Tailwind / CSS', desc: 'Styling', icon: '🎨' },
  { name: 'Firebase', desc: 'Hosting & auth', icon: '🔥' },
  { name: 'Vercel / Render', desc: 'Deployment', icon: '🚀' },
  { name: 'Framer Motion', desc: 'Animations', icon: '✨' },
];

const BUSINESS_TYPES = [
  { icon: <FaStore />,       label: 'Retail Shops' },
  { icon: <FaHospital />,    label: 'Clinics & Doctors' },
  { icon: <FaCut />,         label: 'Salons & Spas' },
  { icon: <FaUtensils />,    label: 'Restaurants & Cafes' },
  { icon: <FaGraduationCap />,label: 'Tutors & Institutes' },
  { icon: <FaBuilding />,    label: 'Local Services' },
];

const LIVE_DEMO = {
  name: 'Aqua Green Plus',
  desc: 'A live MERN stack business website we built — see exactly what you can get.',
  url: 'https://aqua-greenplus.web.app/',
  tags: ['MERN Stack', 'Mobile Responsive', 'Admin Panel', 'Contact Form'],
};

const PROCESS = [
  { step: '01', icon: '💬', title: 'You Contact Us', desc: 'Send a WhatsApp message or fill the form below — tell us about your business.' },
  { step: '02', icon: '🤝', title: 'Free Consultation', desc: 'We discuss your needs, goals, and the pages you want — fully free.' },
  { step: '03', icon: '🎨', title: 'Design & Build', desc: 'We design and develop your website using the right tech stack for your needs.' },
  { step: '04', icon: '🚀', title: 'Launch & Handover', desc: 'We deploy your site live and hand over full access. Done in 7–14 days.' },
];

const FAQS = [
  { q: 'Is it really free for the first 100 clients?', a: 'Yes — completely free. No hidden charges, no domain cost, no hosting cost for the first year. We cover everything for the first 100 businesses.' },
  { q: 'How many spots are left?', a: 'One customer has already claimed their free website (aqua-greenplus.web.app). That means 99 of the 100 free spots are still available.' },
  { q: 'What kind of businesses do you build for?', a: 'Any local small business — shops, clinics, salons, restaurants, tutors, service providers. If you serve customers locally, we can build for you.' },
  { q: 'Do I need technical knowledge?', a: 'Not at all. We handle everything — design, development, deployment, and a simple guide to update content.' },
  { q: 'How long does it take?', a: 'A basic website takes 7–10 days. A full MERN stack site with a dashboard takes 14–21 days depending on complexity.' },
  { q: 'What happens after the free plan?', a: 'After your first free site, future upgrades, additional features, or new websites are billed at an affordable rate. We will discuss pricing transparently before any work.' },
];

/* ── Contact Modal ─────────────────────────────────────────── */
function ContactModal({ onClose }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', business: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.business) return toast.error('Name, phone and business name are required.');
    setLoading(true);
    try {
      await fetch(`${API_URL}/api/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          subject: `MeiBuilds inquiry — ${form.business}`,
          message: form.message || `Business: ${form.business}`,
        }),
      });
      setDone(true);
      toast.success('Request sent! We will WhatsApp you within 24 hours.');
    } catch {
      toast.error('Failed to send. Try WhatsApp directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="biz-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="biz-modal"
        initial={{ opacity: 0, scale: 0.93, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 24 }}
        transition={{ type: 'spring', stiffness: 340, damping: 35 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="biz-modal-head">
          <h3>🚀 Claim Your Free Website</h3>
          <button className="biz-modal-close" onClick={onClose} aria-label="Close"><FaTimes /></button>
        </div>

        {done ? (
          <div className="biz-modal-success">
            <span>🎉</span>
            <h4>Request Received!</h4>
            <p>We'll WhatsApp you within 24 hours to schedule your free consultation.</p>
            <button className="btn btn-primary" onClick={onClose}>Close</button>
          </div>
        ) : (
          <form className="biz-modal-form" onSubmit={submit}>
            <div className="biz-modal-row">
              <div className="form-group">
                <label><FaUser /> Your Name *</label>
                <input value={form.name} onChange={set('name')} placeholder="Full name" required />
              </div>
              <div className="form-group">
                <label><FaPhone /> WhatsApp / Phone *</label>
                <input value={form.phone} onChange={set('phone')} placeholder="9876543210" required />
              </div>
            </div>
            <div className="form-group">
              <label><FaEnvelope /> Email (optional)</label>
              <input type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" />
            </div>
            <div className="form-group">
              <label><FaBuilding /> Business Name *</label>
              <input value={form.business} onChange={set('business')} placeholder="Your shop / clinic / service name" required />
            </div>
            <div className="form-group">
              <label>Tell us about your business</label>
              <textarea value={form.message} onChange={set('message')} rows={3} placeholder="What does your business do? What pages do you need?" />
            </div>
            <div className="biz-modal-actions">
              <button type="submit" className="btn btn-accent btn-lg" disabled={loading} style={{ flex: 1 }}>
                {loading ? 'Sending…' : '🚀 Submit Request'}
              </button>
              <a
                href="https://wa.me/917200282924?text=Hi%20Meipuratchi%2C%20I%20want%20a%20free%20website%20for%20my%20business!"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-dark btn-lg"
                style={{ flex: 1 }}
              >
                <FaWhatsapp style={{ color: '#25d366' }} /> WhatsApp Us
              </a>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ── FAQ item ──────────────────────────────────────────────── */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`biz-faq-item ${open ? 'open' : ''}`}>
      <button className="biz-faq-q" onClick={() => setOpen(!open)}>
        {q}
        <span className="biz-faq-icon">{open ? '−' : '+'}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="biz-faq-a"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <p>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Main ─────────────────────────────────────────────────── */
export default function Business() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="biz-page">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="biz-hero">
        <div className="biz-hero-bg" aria-hidden="true">
          <div className="biz-orb biz-orb-1" />
          <div className="biz-orb biz-orb-2" />
          <div className="biz-hero-grid" />
        </div>

        <div className="container biz-hero-inner">
          <AnimatedSection variant="fadeInLeft" className="biz-hero-copy">
            <motion.div
              className="biz-hero-badge"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <FaRocket /> MeiBuilds — Web Design for Local Business
            </motion.div>

            <motion.h1
              className="biz-hero-title"
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7 }}
            >
              Your Business<br />
              <span className="gradient-text">Deserves a Website.</span>
            </motion.h1>

            <motion.p
              className="biz-hero-desc"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
            >
              We build modern, fast, mobile-friendly websites for local small businesses using the MERN stack. <strong style={{ color: '#f5a623' }}>First 100 clients get their website built completely free.</strong> 99 spots remaining.
            </motion.p>

            <motion.div
              className="biz-hero-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <button className="btn btn-accent btn-lg" onClick={() => setModalOpen(true)}>
                <FaRocket /> Claim Free Website
              </button>
              <a
                href="https://aqua-greenplus.web.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-lg"
              >
                <FaExternalLinkAlt /> See Live Example
              </a>
            </motion.div>

            <motion.div
              className="biz-hero-spots"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <div className="biz-spot-track">
                <div className="biz-spot-fill" style={{ width: '1%' }} />
              </div>
              <span>1 of 100 free spots claimed — <strong>99 remaining</strong></span>
            </motion.div>
          </AnimatedSection>

          <AnimatedSection variant="fadeInRight" className="biz-hero-visual">
            <div className="biz-mockup">
              <div className="biz-mockup-bar">
                <span /><span /><span />
                <div className="biz-mockup-url">aqua-greenplus.web.app</div>
              </div>
              <div className="biz-mockup-screen">
                <div className="biz-mock-hero-strip" />
                <div className="biz-mock-row">
                  <div className="biz-mock-card" />
                  <div className="biz-mock-card" />
                  <div className="biz-mock-card" />
                </div>
                <div className="biz-mock-line" />
                <div className="biz-mock-line short" />
                <div className="biz-mock-btn" />
              </div>
              <div className="biz-mockup-badge">
                <FaStar /> Live Website
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── LIVE DEMO ─────────────────────────────────────── */}
      <section className="biz-section biz-demo-section">
        <div className="container">
          <AnimatedSection variant="fadeInUp" className="biz-section-head text-center">
            <div className="tag">Our Work</div>
            <h2 className="section-title">See a Live Website We Built</h2>
            <p className="section-subtitle">This is exactly what you can get — a real business website, live on the internet, built by us.</p>
          </AnimatedSection>

          <AnimatedSection variant="scaleIn">
            <div className="biz-demo-card card">
              <div className="biz-demo-info">
                <div className="biz-demo-icon"><FaBuilding /></div>
                <div>
                  <h3>{LIVE_DEMO.name}</h3>
                  <p>{LIVE_DEMO.desc}</p>
                  <div className="biz-demo-tags">
                    {LIVE_DEMO.tags.map(t => <span key={t}>{t}</span>)}
                  </div>
                </div>
              </div>
              <a
                href={LIVE_DEMO.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-accent"
              >
                Visit Live Site <FaExternalLinkAlt />
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── WHO IS THIS FOR ───────────────────────────────── */}
      <section className="biz-section" style={{ background: 'var(--light)' }}>
        <div className="container">
          <AnimatedSection variant="fadeInUp" className="biz-section-head text-center">
            <div className="tag">Who We Build For</div>
            <h2 className="section-title">Built for Local Small Businesses</h2>
            <p className="section-subtitle">If you have a local business and need an online presence, we're the right team for you.</p>
          </AnimatedSection>
          <div className="biz-types-grid">
            {BUSINESS_TYPES.map((b, i) => (
              <AnimatedSection key={i} variant="fadeInUp" delay={i * 0.06}>
                <div className="biz-type-card card">
                  <div className="biz-type-icon">{b.icon}</div>
                  <span>{b.label}</span>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection variant="fadeInUp" delay={0.3} className="text-center" style={{ marginTop: 32 }}>
            <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>
              Not on the list? <strong>Any local business is welcome.</strong> Contact us and we'll discuss.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ── SERVICES / PLANS ──────────────────────────────── */}
      <section className="biz-section bg-white">
        <div className="container">
          <AnimatedSection variant="fadeInUp" className="biz-section-head text-center">
            <div className="tag">Our Plans</div>
            <h2 className="section-title">What We Build</h2>
            <p className="section-subtitle">From simple landing pages to full-stack MERN applications — we've got the right solution for every business.</p>
          </AnimatedSection>
          <div className="grid-3 biz-plans-grid">
            {SERVICES.map((s, i) => (
              <AnimatedSection key={i} variant="fadeInUp" delay={i * 0.09}>
                <div className={`biz-plan-card card ${i === 0 ? 'biz-plan-featured' : ''}`}>
                  {s.badge && <div className="biz-plan-badge">{s.badge}</div>}
                  <div className="biz-plan-icon" style={{ background: s.color }}>{s.icon}</div>
                  <h3>{s.title}</h3>
                  <div className="biz-plan-price">{s.price}</div>
                  <p className="biz-plan-desc">{s.desc}</p>
                  <ul className="biz-plan-features">
                    {s.features.map(f => (
                      <li key={f}><FaCheckCircle />{f}</li>
                    ))}
                  </ul>
                  <button
                    className={`btn btn-lg ${i === 0 ? 'btn-accent' : 'btn-outline-dark'}`}
                    style={{ width: '100%', marginTop: 'auto' }}
                    onClick={() => setModalOpen(true)}
                  >
                    Get Started <FaArrowRight />
                  </button>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH STACK ────────────────────────────────────── */}
      <section className="biz-section" style={{ background: 'var(--light)' }}>
        <div className="container">
          <AnimatedSection variant="fadeInUp" className="biz-section-head text-center">
            <div className="tag">Technology</div>
            <h2 className="section-title">Built with Modern Tech</h2>
            <p className="section-subtitle">We use production-grade technologies that power companies like Netflix, Airbnb, and LinkedIn.</p>
          </AnimatedSection>
          <div className="biz-stack-grid">
            {TECH_STACK.map((t, i) => (
              <AnimatedSection key={i} variant="fadeInUp" delay={i * 0.05}>
                <div className="biz-stack-card card">
                  <div className="biz-stack-emoji">{t.icon}</div>
                  <div className="biz-stack-name">{t.name}</div>
                  <div className="biz-stack-desc">{t.desc}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ───────────────────────────────────────── */}
      <section className="biz-section bg-white">
        <div className="container">
          <AnimatedSection variant="fadeInUp" className="biz-section-head text-center">
            <div className="tag">How It Works</div>
            <h2 className="section-title">From Contact to Launch in 4 Steps</h2>
          </AnimatedSection>
          <div className="biz-process-grid">
            {PROCESS.map((p, i) => (
              <AnimatedSection key={i} variant="fadeInUp" delay={i * 0.08}>
                <div className="biz-process-card">
                  <div className="biz-process-num">{p.step}</div>
                  <div className="biz-process-icon">{p.icon}</div>
                  <h4>{p.title}</h4>
                  <p>{p.desc}</p>
                  {i < PROCESS.length - 1 && <div className="biz-process-arrow" aria-hidden="true"><FaArrowRight /></div>}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────── */}
      <section className="biz-section" style={{ background: 'var(--light)' }}>
        <div className="container biz-faq-wrap">
          <AnimatedSection variant="fadeInUp" className="biz-section-head text-center">
            <div className="tag">FAQ</div>
            <h2 className="section-title">Common Questions</h2>
          </AnimatedSection>
          <div className="biz-faq-list">
            {FAQS.map((f, i) => (
              <AnimatedSection key={i} variant="fadeInUp" delay={i * 0.04}>
                <FaqItem q={f.q} a={f.a} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="biz-cta">
        <div className="biz-cta-bg" aria-hidden="true">
          <div className="biz-orb biz-orb-1" />
          <div className="biz-orb biz-orb-2" />
        </div>
        <div className="container biz-cta-inner text-center">
          <AnimatedSection variant="scaleIn">
            <div className="tag" style={{ display: 'inline-flex', margin: '0 auto 16px' }}>99 free spots remaining</div>
            <h2 className="biz-cta-title">Ready to Go Online?</h2>
            <p className="biz-cta-desc">
              Join the first 100 businesses to get a free professional website from Meipuratchi. No catch — just good work from a team that cares.
            </p>
            <div className="biz-cta-actions">
              <button className="btn btn-accent btn-lg" onClick={() => setModalOpen(true)}>
                <FaRocket /> Claim Free Website
              </button>
              <a
                href="https://wa.me/917200282924?text=Hi%20Meipuratchi%2C%20I%20want%20a%20free%20website%20for%20my%20business!"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-lg"
              >
                <FaWhatsapp style={{ color: '#25d366' }} /> WhatsApp Us
              </a>
            </div>
            <p className="biz-cta-note">
              Or call us: <a href="tel:+917200282924" style={{ color: 'var(--accent)', fontWeight: 700 }}>+91 72002 82924</a>
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Contact Modal ─────────────────────────────────── */}
      <AnimatePresence>
        {modalOpen && <ContactModal onClose={() => setModalOpen(false)} />}
      </AnimatePresence>

    </div>
  );
}
