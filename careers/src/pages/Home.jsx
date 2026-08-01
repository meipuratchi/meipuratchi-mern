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
              We&apos;re Hiring — Software Internships
            </div>
            <h1>Build real software.<br /><span>Ship real products.</span><br />Make real impact.</h1>
            <p>We&apos;re looking for full stack developers and app developers to build and scale the Meipuratchi platform — a live product serving thousands of Tamil Nadu students.</p>
            <div className="hero-actions">
              <a href="#jobs" className="btn btn-accent"><FaBriefcase /> View Open Positions</a>
              <Link to="/register" className="btn btn-outline">Create Account →</Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat"><strong>Live</strong><span>Production Platform</span></div>
              <div className="hero-stat"><strong>MERN</strong><span>Stack</span></div>
              <div className="hero-stat"><strong>100%</strong><span>Remote Friendly</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Join ── */}
      <section className="why-section">
        <div className="container">
          <h2>Why Join <span>Meipuratchi?</span></h2>
          <p className="why-sub">Work on a real, live platform — not a tutorial project.</p>
          <div className="why-grid">
            {[
              { icon: '⚡', title: 'Live Production App', desc: 'You ship code to a real platform used by thousands of Tamil Nadu students — not a dummy project. Your work matters from day one.' },
              { icon: '🛠️', title: 'Full MERN Stack', desc: 'Work across the full stack — React, Node.js, Express, MongoDB. Mobile app interns work with React Native.' },
              { icon: '📜', title: 'Official Letters', desc: 'Receive an official Meipuratchi Internship Offer Letter and Completion Certificate — solid proof for your resume.' },
              { icon: '🚀', title: 'Own Your Features', desc: 'Small team means you own entire features end-to-end. No bottlenecks, no waiting — just build and ship.' },
              { icon: '🌐', title: 'Fully Remote', desc: 'Work from anywhere. All you need is a laptop and a reliable internet connection.' },
              { icon: '💡', title: 'Real Code Review', desc: 'Get feedback on your code from the core team. Learn industry practices — Git workflow, REST APIs, deployment.' },
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
          <h2>Don&apos;t see the right role?</h2>
          <p>We&apos;re actively looking for full stack developers and mobile app developers. If you have the skills and the drive, reach out — we&apos;ll find a fit.</p>
          <a href="https://meipuratchi.in/contact" target="_blank" rel="noreferrer" className="btn btn-primary">Get In Touch</a>
        </div>
      </section>
    </div>
  );
}
