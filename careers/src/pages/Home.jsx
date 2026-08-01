import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaBriefcase, FaSearch, FaMapMarkerAlt, FaMoneyBillWave,
  FaCalendarAlt, FaArrowRight, FaStar, FaUsers, FaLaptopCode,
  FaHandsHelping, FaGraduationCap, FaCertificate, FaRocket
} from 'react-icons/fa';
import { getJobs } from '../api';
import './Home.css';

function StatusBadge({ status }) {
  const label = status === 'Remote' ? '🌐 Remote' : status === 'On-site' ? '📍 On-site' : '🏠 Hybrid';
  const cls   = `badge badge-${status.toLowerCase().replace(' ', '-')}`;
  return <span className={cls}>{label}</span>;
}

function JobCard({ job }) {
  const expired = job.deadline && new Date(job.deadline) < new Date();
  return (
    <Link to={`/jobs/${job._id}`} className="job-card anim-up">
      <div className="job-card-top">
        <h3>{job.title}</h3>
        {expired && <span className="closed-tag">Closed</span>}
      </div>
      <div className="job-badges">
        <span className="badge badge-intern">{job.roleType || 'Intern'}</span>
        <StatusBadge status={job.workingMode} />
        {job.department && <span className="badge badge-under_review">{job.department}</span>}
      </div>
      <div className="job-meta">
        {job.openings > 0 && <span><FaUsers /> {job.openings} opening{job.openings > 1 ? 's' : ''}</span>}
        {job.stipend && job.stipend !== 'None' && <span><FaMoneyBillWave /> {job.stipend}</span>}
        {job.deadline && <span><FaCalendarAlt /> Deadline: {new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
      </div>
      <p className="job-desc">{job.description}</p>
      {job.techStack?.length > 0 && (
        <div className="job-tech">
          {job.techStack.slice(0, 5).map(t => <span key={t} className="tech-tag">{t}</span>)}
          {job.techStack.length > 5 && <span className="tech-tag">+{job.techStack.length - 5}</span>}
        </div>
      )}
      <div className="job-card-footer">
        <span className="job-stipend">{job.stipend === 'None' ? 'Unpaid / Certificate' : job.stipend}</span>
        <FaArrowRight className="apply-arrow" />
      </div>
    </Link>
  );
}

export default function Home() {
  const [jobs, setJobs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [modeFilter, setMode]   = useState('');
  const [typeFilter, setType]   = useState('');

  useEffect(() => {
    getJobs()
      .then(r => setJobs(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = jobs.filter(j => {
    const q = search.toLowerCase();
    const matchSearch = !q || j.title.toLowerCase().includes(q) || j.department?.toLowerCase().includes(q) || j.techStack?.some(t => t.toLowerCase().includes(q));
    const matchMode   = !modeFilter || j.workingMode === modeFilter;
    const matchType   = !typeFilter || j.roleType === typeFilter;
    return matchSearch && matchMode && matchType;
  });

  return (
    <div className="careers-home">
      {/* ── Hero ── */}
      <section className="careers-hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="dot" />
              We&apos;re Hiring — Join Meipuratchi
            </div>
            <h1>Build careers.<br /><span>Guide students.</span><br />Change Tamil Nadu.</h1>
            <p>We're looking for passionate students and developers to join our mission of providing free career guidance to every government school student in Tamil Nadu.</p>
            <div className="hero-actions">
              <a href="#jobs" className="btn btn-accent"><FaBriefcase /> View Open Positions</a>
              <Link to="/register" className="btn btn-outline">Create Account →</Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat"><strong>500+</strong><span>Students Guided</span></div>
              <div className="hero-stat"><strong>8+</strong><span>Departments</span></div>
              <div className="hero-stat"><strong>100%</strong><span>Free &amp; Mission-Driven</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Join ── */}
      <section className="why-section">
        <div className="container">
          <h2>Why Join <span>Meipuratchi?</span></h2>
          <p className="why-sub">More than an internship — a mission that matters.</p>
          <div className="why-grid">
            {[
              { icon: '🎓', title: 'Real Impact', desc: 'Your work directly helps Tamil Nadu students discover their career paths. Every line of code, every design counts.' },
              { icon: '📜', title: 'Official Certificate', desc: 'Get a Meipuratchi internship completion letter and offer letter — recognized proof of your contribution.' },
              { icon: '💡', title: 'Learn & Grow', desc: 'Work on a live production platform with real users. Build skills in React, Node.js, MongoDB, design, and more.' },
              { icon: '🤝', title: 'Great Team', desc: 'Work alongside 8 departments — Design, Tech, Counseling, Social Media, and more.' },
              { icon: '🌐', title: 'Remote Friendly', desc: 'Most roles are fully remote. Work from anywhere across Tamil Nadu and India.' },
              { icon: '🚀', title: 'Fast Growth', desc: 'Small team means big responsibility. Take ownership, ship features, and grow faster.' },
            ].map(c => (
              <div key={c.title} className="why-card">
                <div className="why-icon">{c.icon}</div>
                <h4>{c.title}</h4>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Jobs ── */}
      <section id="jobs" className="jobs-section">
        <div className="container">
          <div className="jobs-header">
            <h2>Open Positions</h2>
            <span className="job-count">{filtered.length} role{filtered.length !== 1 ? 's' : ''} available</span>
          </div>

          <div className="filters-bar">
            <div className="filter-search">
              <FaSearch />
              <input
                type="text"
                placeholder="Search by title, skill, department…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select className="filter-select" value={modeFilter} onChange={e => setMode(e.target.value)}>
              <option value="">All Modes</option>
              <option>Remote</option>
              <option>On-site</option>
              <option>Hybrid</option>
            </select>
            <select className="filter-select" value={typeFilter} onChange={e => setType(e.target.value)}>
              <option value="">All Types</option>
              <option>Intern</option>
              <option>Part-time</option>
              <option>Contract</option>
            </select>
          </div>

          {loading ? (
            <div className="jobs-empty">
              <FaBriefcase /><h3>Loading positions…</h3>
            </div>
          ) : filtered.length === 0 ? (
            <div className="jobs-empty">
              <FaBriefcase />
              <h3>No positions found</h3>
              <p>Try adjusting your filters or check back soon.</p>
            </div>
          ) : (
            <div className="jobs-grid">
              {filtered.map(j => <JobCard key={j._id} job={j} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── Mission CTA ── */}
      <section className="mission-banner">
        <div className="container">
          <h2>Don&apos;t see a role for you?</h2>
          <p>We&apos;re always growing. Drop us a message on our contact page — we&apos;d love to hear from passionate people who want to help Tamil Nadu students.</p>
          <a href="https://meipuratchi.in/contact" target="_blank" rel="noreferrer" className="btn btn-primary">Get In Touch</a>
        </div>
      </section>
    </div>
  );
}
