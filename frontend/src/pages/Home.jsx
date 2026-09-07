import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  FaGraduationCap, FaArrowRight, FaUsers, FaStar, FaHeart,
  FaCheckCircle, FaUserCircle, FaCode, FaBriefcase, FaBook,
  FaRocket, FaLaptopCode, FaBuilding, FaFlask, FaPaintBrush,
  FaMusic, FaPhone, FaWhatsapp, FaShieldAlt, FaChartLine,
} from 'react-icons/fa';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { getStats } from '../api';
import { useCMS } from '../hooks/useCMS';
import AnimatedSection, { AnimatedStagger, AnimatedItem } from '../components/AnimatedSection';
import API_URL from '../config';
import './Home.css';

/* ── Raise a Ticket form ─────────────────────────────────── */
function RaiseTicketForm() {
  const [form, setForm] = useState({ title: '', description: '', raisedBy: '', email: '', phone: '', type: 'query' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.raisedBy) return toast.error('Name, subject and message are required');
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/tickets/public`, form);
      setDone(true);
      toast.success('Ticket raised! We will get back to you soon.');
    } catch { toast.error('Failed to submit. Please try again.'); }
    finally { setLoading(false); }
  };

  if (done) return (
    <div className="ticket-success">
      <span>✅</span>
      <p>Your ticket has been raised! Our team will respond shortly.</p>
      <button onClick={() => { setDone(false); setForm({ title: '', description: '', raisedBy: '', email: '', phone: '', type: 'query' }); }}>Raise another</button>
    </div>
  );

  return (
    <form className="ticket-form" onSubmit={submit}>
      <div className="ticket-row">
        <div className="form-group"><label>Your Name *</label><input value={form.raisedBy} onChange={set('raisedBy')} placeholder="Full name" required /></div>
        <div className="form-group"><label>Type</label><select value={form.type} onChange={set('type')}><option value="query">General Query</option><option value="support">Support</option><option value="other">Other</option></select></div>
      </div>
      <div className="ticket-row">
        <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" /></div>
        <div className="form-group"><label>Phone</label><input type="tel" value={form.phone} onChange={set('phone')} placeholder="9876543210" /></div>
      </div>
      <div className="form-group"><label>Subject *</label><input value={form.title} onChange={set('title')} placeholder="Brief subject" required /></div>
      <div className="form-group"><label>Message *</label><textarea value={form.description} onChange={set('description')} placeholder="Describe your query…" rows={4} required /></div>
      <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Submitting…' : '🎫 Raise Ticket'}</button>
    </form>
  );
}

/* ── Animated counter ────────────────────────────────────── */
function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({ triggerOnce: true });
  useEffect(() => {
    if (!inView) return;
    const num = parseInt(String(target).replace(/\D/g, '')) || 0;
    const step = Math.ceil(num / 40);
    let cur = 0;
    const t = setInterval(() => {
      cur = Math.min(cur + step, num);
      setCount(cur);
      if (cur >= num) clearInterval(t);
    }, 30);
    return () => clearInterval(t);
  }, [inView, target]);
  const display = typeof target === 'string' && /[^\d]/.test(target.replace(/^\d+/, ''))
    ? `${count}${target.replace(/^\d+/, '')}` : `${count}${suffix}`;
  return <span ref={ref}>{display}</span>;
}

/* ── Main ─────────────────────────────────────────────────── */
export default function Home() {
  const { c } = useCMS('home');
  const [stats, setStats] = useState({ total: 0, counseled: 0 });

  useEffect(() => { getStats().then(r => setStats(r.data.data)).catch(() => {}); }, []);

  const CAREER_CARDS = [
    { icon: <FaFlask />, titleTa: 'அறிவியல் துறை', title: 'Science Stream', items: ['NEET for Medical', 'JEE for Engineering', 'Research Careers'], accent: '#192441' },
    { icon: <FaPaintBrush />, titleTa: 'கலைத் துறை', title: 'Arts & Commerce', items: ['Performing Arts', 'Commerce & Finance', 'Social Sciences'], accent: '#2563eb' },
    { icon: <FaMusic />, titleTa: 'படைப்புத் துறைகள்', title: 'Creative Fields', items: ['Music & Film', 'Design & Media', 'Fine Arts'], accent: '#f5a623' },
  ];

  const STEPS = [
    { num: '01', icon: '📝', title: 'Register Online', desc: 'Fill a simple form — takes 3 minutes' },
    { num: '02', icon: '✅', title: 'Profile Verified', desc: 'Our team reviews within 48 hours' },
    { num: '03', icon: '📩', title: 'Confirmation', desc: 'Receive email & WhatsApp confirmation' },
    { num: '04', icon: '🧑‍💼', title: 'Counseling Session', desc: 'One-on-one guidance with a counselor' },
    { num: '05', icon: '🎯', title: 'Course Selection', desc: 'Choose your ideal career path' },
    { num: '06', icon: '🤝', title: 'Follow-up Support', desc: '6 months of continued guidance' },
  ];

  const WHY_US = [
    { icon: '🆓', title: 'Completely Free', desc: 'No fees, no hidden charges. Powered entirely by volunteers.' },
    { icon: '🎓', title: 'Expert Counselors', desc: 'Specialists in NEET, Engineering, Paramedical & Arts.' },
    { icon: '📍', title: 'Tamil Nadu Focus', desc: 'Built specifically for TN government school students.' },
    { icon: '📞', title: '6-Month Follow-up', desc: 'We stay with you until you are settled in college.' },
  ];

  return (
    <div className="home3">

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="h3-hero">
        <div className="h3-hero-bg" aria-hidden="true">
          <div className="h3-orb h3-orb-1" />
          <div className="h3-orb h3-orb-2" />
          <div className="h3-orb h3-orb-3" />
          <div className="h3-grid" />
        </div>

        <div className="container h3-hero-inner">
          <div className="h3-hero-copy">
            <motion.div
              className="h3-badge"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.span animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}><FaStar /></motion.span>
              Free Career Guidance · Tamil Nadu Government School Students
            </motion.div>

            <motion.h1
              className="h3-hero-title"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.35 }}
            >
              மெய் புரட்சி
              <span className="h3-hero-sub">Student Career Guidance</span>
            </motion.h1>

            <motion.p
              className="h3-hero-desc"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.55 }}
            >
              Empowering 10th, 12th &amp; dropout students across Tamil Nadu with free, dedicated career counseling — 100% volunteer-powered.
            </motion.p>

            <motion.div
              className="h3-hero-actions"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
            >
              <Link to="/portal/register" className="btn btn-accent btn-lg">
                <FaGraduationCap /> Register Free
              </Link>
              <Link to="/portal/login" className="btn btn-outline btn-lg">
                <FaUserCircle /> Student Login
              </Link>
            </motion.div>

            <motion.div
              className="h3-stats"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9 }}
            >
              {[
                { value: stats.total || '500+', label: 'Students Registered' },
                { value: stats.counseled || '200+', label: 'Students Counseled' },
                { value: '100%', label: 'Free & Volunteer-run' },
              ].map((s, i) => (
                <div key={i} className="h3-stat">
                  <span className="h3-stat-val"><Counter target={s.value} /></span>
                  <p className="h3-stat-label">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Hero visual */}
          <motion.div
            className="h3-hero-visual"
            initial={{ opacity: 0, scale: 0.85, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden="true"
          >
            <div className="h3-hero-card h3-hc-1">
              <FaGraduationCap /> Career Guidance
              <span>Free counseling sessions</span>
            </div>
            <div className="h3-hero-card h3-hc-2">
              <FaUsers /> Volunteer Team
              <span>10 expert departments</span>
            </div>
            <div className="h3-hero-card h3-hc-3">
              <FaChartLine /> Success Stories
              <span>Students in top colleges</span>
            </div>
            <div className="h3-hero-card h3-hc-4">
              <FaLaptopCode /> MeiBuilds
              <span>Web design for business</span>
            </div>
            <div className="h3-hero-logo-ring">
              <img src="/mei_logo.png" alt="Meipuratchi" />
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="h3-scroll-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            className="h3-scroll-dot"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
        </motion.div>
      </section>

      {/* ── WHY US ──────────────────────────────────────────── */}
      <section className="h3-section h3-why bg-white">
        <div className="container">
          <AnimatedSection variant="fadeInUp" className="h3-section-head text-center">
            <div className="tag">Why Meipuratchi?</div>
            <h2 className="section-title">Built for Students. Run by Volunteers.</h2>
            <p className="section-subtitle">We don't charge a single rupee. Everything you get here is driven by people who genuinely care about Tamil Nadu students.</p>
          </AnimatedSection>
          <div className="grid-4 h3-why-grid">
            {WHY_US.map((w, i) => (
              <AnimatedSection key={i} variant="fadeInUp" delay={i * 0.07}>
                <div className="h3-why-card card">
                  <div className="h3-why-icon">{w.icon}</div>
                  <h3>{w.title}</h3>
                  <p>{w.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ───────────────────────────────────────────── */}
      <section className="h3-section h3-about">
        <div className="container">
          <div className="h3-about-grid">
            <AnimatedSection variant="fadeInLeft">
              <div className="h3-about-copy">
                <div className="tag">முயற்சி பற்றி — About the Initiative</div>
                <h2 className="section-title">
                  Every Student Deserves a Guide.<br />
                  <span>We Are That Guide.</span>
                </h2>
                <p className="h3-about-body">
                  We stand beside students from 10th, 12th, and those who have faced setbacks in their board exams — guiding them toward a brighter path with personalised, free career counseling.
                </p>
                <div className="h3-mission-box">
                  <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                    <FaHeart />
                  </motion.span>
                  <p><strong>Our Mission:</strong> Accessible career guidance for every government school student in Tamil Nadu, fully supported by volunteers.</p>
                </div>
                <div className="h3-checks">
                  {['Tamil Nadu Government School Students', 'Fully Free — No Charges Ever', '6 Months Follow-up Support', 'Expert Counselors in Multiple Fields'].map((item, i) => (
                    <motion.div
                      key={i}
                      className="h3-check"
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <FaCheckCircle /> {item}
                    </motion.div>
                  ))}
                </div>
                <div className="h3-about-actions">
                  <Link to="/registration" className="btn btn-primary">Register Now <FaArrowRight /></Link>
                  <Link to="/our-team" className="btn btn-outline-dark">Meet Our Team</Link>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection variant="fadeInRight">
              <div className="h3-about-visual">
                {[
                  { icon: <FaGraduationCap />, title: 'Career Guidance', desc: 'Personalised counseling sessions', color: '#192441' },
                  { icon: <FaUsers />,         title: 'Volunteer Team',   desc: '10 specialised departments',   color: '#2563eb' },
                  { icon: <FaStar />,           title: 'Success Stories', desc: 'Students placed in top colleges', color: '#f5a623' },
                ].map((card, i) => (
                  <motion.div
                    key={i}
                    className="h3-acard"
                    style={{ '--card-accent': card.color }}
                    initial={{ opacity: 0, y: 30, rotate: -3 }}
                    whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15, duration: 0.6 }}
                    whileHover={{ scale: 1.04, rotate: 1 }}
                  >
                    <div className="h3-acard-icon">{card.icon}</div>
                    <div>
                      <h4>{card.title}</h4>
                      <p>{card.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── CAREER PATHS ────────────────────────────────────── */}
      <section className="h3-section" style={{ background: 'var(--light)' }}>
        <div className="container">
          <AnimatedSection variant="fadeInUp" className="h3-section-head text-center">
            <div className="tag">வாய்ப்புகள் — Opportunities</div>
            <h2 className="section-title">Career Paths We Guide You Through</h2>
            <p className="section-subtitle">From science to arts to creative fields — we have counselors experienced in every stream.</p>
          </AnimatedSection>
          <div className="grid-3">
            {CAREER_CARDS.map((card, i) => (
              <AnimatedSection key={i} variant="fadeInUp" delay={i * 0.08}>
                <div className="h3-career-card card">
                  <div className="h3-career-icon" style={{ background: card.accent }}>{card.icon}</div>
                  <p className="h3-career-ta">{card.titleTa}</p>
                  <h3>{card.title}</h3>
                  <ul>
                    {card.items.map(item => (
                      <li key={item}><FaCheckCircle /> {item}</li>
                    ))}
                  </ul>
                  <Link to="/registration" className="h3-career-cta">
                    Get Guidance <FaArrowRight />
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────── */}
      <section className="h3-section bg-white">
        <div className="container">
          <AnimatedSection variant="fadeInUp" className="h3-section-head text-center">
            <div className="tag">எவ்வாறு செயல்படுகிறது — Process</div>
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Simple 6-step process to get your free, personalised career guidance.</p>
          </AnimatedSection>
          <div className="h3-steps">
            {STEPS.map((step, i) => (
              <AnimatedSection key={i} variant="fadeInUp" delay={i * 0.06}>
                <motion.div className="h3-step" whileHover={{ y: -6 }}>
                  <div className="h3-step-num">{step.num}</div>
                  <div className="h3-step-icon">{step.icon}</div>
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEIBUILDS PROMO ─────────────────────────────────── */}
      <section className="h3-section h3-biz-promo">
        <div className="container">
          <div className="h3-biz-inner">
            <AnimatedSection variant="fadeInLeft" className="h3-biz-copy">
              <div className="tag" style={{ background: 'rgba(245,166,35,0.15)', borderColor: 'rgba(245,166,35,0.3)' }}>New Service — MeiBuilds 🚀</div>
              <h2 className="section-title" style={{ color: '#fff' }}>
                We Build Websites for<br />
                <span className="gradient-text">Local Businesses</span>
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, marginBottom: 24, maxWidth: 500 }}>
                Are you a small local business — a shop, clinic, salon, or startup? We build you a modern, fast website using the MERN stack. <strong style={{ color: '#f5a623' }}>First 100 clients get it free.</strong> One client has already claimed it — 99 spots remaining!
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link to="/business" className="btn btn-accent btn-lg">
                  <FaRocket /> See Our Services
                </Link>
                <a href="https://aqua-greenplus.web.app/" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg">
                  <FaBuilding /> Live Example ↗
                </a>
              </div>
              <div className="h3-biz-badges">
                <span><FaCheckCircle /> MERN Stack</span>
                <span><FaCheckCircle /> Mobile Responsive</span>
                <span><FaCheckCircle /> SEO Ready</span>
                <span><FaCheckCircle /> 1st 100 Clients Free</span>
              </div>
            </AnimatedSection>
            <AnimatedSection variant="fadeInRight" className="h3-biz-counter-wrap">
              <div className="h3-biz-counter">
                <div className="h3-biz-ring">
                  <svg viewBox="0 0 120 120" aria-hidden="true">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                    <circle cx="60" cy="60" r="50" fill="none" stroke="var(--accent)" strokeWidth="8"
                      strokeDasharray={`${(1/100) * 314} 314`}
                      strokeLinecap="round"
                      transform="rotate(-90 60 60)" />
                  </svg>
                  <div className="h3-biz-ring-inner">
                    <span className="h3-biz-num">99</span>
                    <span className="h3-biz-lbl">spots left</span>
                  </div>
                </div>
                <p className="h3-biz-ring-note">1 of 100 free websites claimed</p>
                <Link to="/business" className="btn btn-accent" style={{ marginTop: 16 }}>Claim Your Spot →</Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── TOOLS HUB ───────────────────────────────────────── */}
      <section className="h3-section" style={{ background: 'var(--light)' }}>
        <div className="container">
          <AnimatedSection variant="fadeInUp" className="h3-section-head text-center">
            <div className="tag">Tools & Resources</div>
            <h2 className="section-title">Everything You Need, In One Place</h2>
          </AnimatedSection>
          <div className="grid-3 h3-tools-grid">
            {[
              { icon: <FaCode />, title: 'MeiCode', sub: 'DSA Roadmap', desc: '18 topics, 150+ LeetCode problems linked. Track your progress.', to: '/meicode', cta: 'Start Practicing', color: '#192441' },
              { icon: <FaBook />, title: 'meiDocs', sub: 'Internal Docs', desc: 'Onboarding guides, tech stack tutorials, and team documentation.', to: '/meidocs', cta: 'Read Docs', color: '#2563eb' },
              { icon: <FaBriefcase />, title: 'MeiBuilds', sub: 'Business Services', desc: 'Affordable MERN stack websites for local small businesses.', to: '/business', cta: 'Learn More', color: '#f5a623' },
            ].map((tool, i) => (
              <AnimatedSection key={i} variant="fadeInUp" delay={i * 0.09}>
                <div className="h3-tool-card card">
                  <div className="h3-tool-icon" style={{ background: tool.color }}>{tool.icon}</div>
                  <div className="h3-tool-badge">{tool.sub}</div>
                  <h3>{tool.title}</h3>
                  <p>{tool.desc}</p>
                  <Link to={tool.to} className="h3-tool-cta">
                    {tool.cta} <FaArrowRight />
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUPPORT / TICKET ────────────────────────────────── */}
      <section className="h3-section bg-white">
        <div className="container">
          <div className="h3-ticket-wrap">
            <AnimatedSection variant="fadeInLeft" className="h3-ticket-info">
              <div className="tag">Support</div>
              <h2 className="section-title">Have a Question?</h2>
              <p style={{ color: 'var(--gray)', lineHeight: 1.8, marginBottom: 20 }}>
                Raise a support ticket and our volunteer team will get back to you within 24 hours. No query is too small.
              </p>
              <div className="h3-contact-items">
                <a href="tel:+917200282924" className="h3-contact-item">
                  <div className="h3-ci-icon"><FaPhone /></div>
                  <div><strong>+91 72002 82924</strong><span>Call us anytime</span></div>
                </a>
                <a href="https://chat.whatsapp.com/LM8lhAO5wReB5V4Yes1DXq" target="_blank" rel="noopener noreferrer" className="h3-contact-item">
                  <div className="h3-ci-icon h3-ci-wa"><FaWhatsapp /></div>
                  <div><strong>WhatsApp Community</strong><span>Instant group support</span></div>
                </a>
              </div>
            </AnimatedSection>
            <AnimatedSection variant="fadeInRight" className="h3-ticket-form-wrap card">
              <h3 style={{ marginBottom: 20, color: 'var(--primary)', fontWeight: 700 }}>🎫 Raise a Ticket</h3>
              <RaiseTicketForm />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ──────────────────────────────────────── */}
      <section className="h3-cta">
        <div className="h3-cta-bg" aria-hidden="true">
          <div className="h3-orb h3-orb-1" />
          <div className="h3-orb h3-orb-2" />
        </div>
        <div className="container h3-cta-inner text-center">
          <AnimatedSection variant="scaleIn">
            <div className="tag" style={{ margin: '0 auto 16px', display: 'inline-flex' }}>உங்கள் எதிர்காலம் — Your Future</div>
            <h2 className="h3-cta-title">Ready to Shape Your Future?</h2>
            <p className="h3-cta-desc">Thousands of Tamil Nadu students have already found their path with Meipuratchi. Your journey starts with one click — and it's free.</p>
            <div className="h3-cta-actions">
              <Link to="/portal/register" className="btn btn-accent btn-lg"><FaGraduationCap /> Register Free Now</Link>
              <Link to="/portal/login" className="btn btn-outline btn-lg"><FaUserCircle /> Student Login</Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

    </div>
  );
}
