import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FaArrowLeft, FaBriefcase, FaMapMarkerAlt, FaMoneyBillWave,
  FaCalendarAlt, FaUsers, FaCheck, FaLaptopCode, FaClipboardList,
  FaUserGraduate, FaRocket
} from 'react-icons/fa';
import { getJob } from '../api';
import './JobDetail.css';

export default function JobDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const [job, setJob]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJob(id)
      .then(r => setJob(r.data.data))
      .catch(() => setJob(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="job-detail-page"><div className="container jd-loading"><FaBriefcase /><p>Loading…</p></div></div>;
  if (!job)    return (
    <div className="job-detail-page"><div className="container jd-notfound">
      <h2>Position not found</h2>
      <p>This job may have been removed or closed.</p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: 20 }}>← Back to Jobs</Link>
    </div></div>
  );

  const isExpired = job.deadline && new Date(job.deadline) < new Date();
  const canApply  = !isExpired;
  const user      = JSON.parse(localStorage.getItem('careerUser') || 'null');

  const handleApply = () => {
    if (!user) { navigate(`/login?redirect=/apply/${id}`); return; }
    navigate(`/apply/${id}`);
  };

  return (
    <div className="job-detail-page">
      <div className="container">
        <Link to="/" className="jd-back"><FaArrowLeft /> Back to all positions</Link>

        <div className="jd-layout">
          {/* Main content */}
          <div className="jd-main anim-up">
            <div className="jd-header">
              <h1 className="jd-title">{job.title}</h1>
              <div className="jd-meta">
                {job.department && <span><FaBriefcase /> {job.department}</span>}
                <span><FaMapMarkerAlt /> {job.workingMode}</span>
                {job.openings > 0 && <span><FaUsers /> {job.openings} opening{job.openings > 1 ? 's' : ''}</span>}
                {job.deadline && <span><FaCalendarAlt /> Apply by {new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>}
              </div>
              <div className="jd-badges">
                <span className="badge badge-intern">{job.roleType || 'Intern'}</span>
                <span className={`badge badge-${job.workingMode.toLowerCase().replace(' ','-')}`}>{job.workingMode}</span>
                {isExpired && <span className="badge badge-rejected">Closed</span>}
              </div>
            </div>

            <hr className="jd-divider" />

            <div className="jd-section">
              <h3><FaClipboardList /> About the Role</h3>
              <p>{job.description}</p>
            </div>

            {job.eligibility && (
              <div className="jd-section">
                <h3><FaUserGraduate /> Eligibility</h3>
                <p>{job.eligibility}</p>
              </div>
            )}

            {job.techStack?.length > 0 && (
              <div className="jd-section">
                <h3><FaLaptopCode /> Tech Stack / Skills Required</h3>
                <div className="tech-chips">
                  {job.techStack.map(t => <span key={t} className="tech-chip">{t}</span>)}
                </div>
              </div>
            )}

            <div className="jd-section">
              <h3><FaRocket /> What You&apos;ll Get</h3>
              <ul>
                {[
                  'Official Internship Offer Letter from Meipuratchi',
                  'Internship Completion Certificate',
                  'Real-world experience on a live platform',
                  'Direct mentorship from the founding team',
                  job.stipend !== 'None' ? `Stipend: ${job.stipend}` : 'Certificate-based internship (no stipend)',
                  '6+ months follow-up support for your career',
                ].map(item => (
                  <li key={item}><FaCheck />{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="jd-sidebar">
            <div className="jd-apply-card">
              <h3>{canApply ? 'Ready to apply?' : 'Applications Closed'}</h3>
              <p>
                {canApply
                  ? 'Apply now — takes less than 5 minutes. No resume upload required, just a link.'
                  : 'This position has passed its application deadline.'}
              </p>
              {canApply ? (
                <button className="btn btn-accent" onClick={handleApply}>
                  Apply Now →
                </button>
              ) : (
                <p className="jd-apply-closed">Check back for future openings.</p>
              )}
            </div>

            <div className="jd-summary-card">
              <h4>Job Summary</h4>
              {[
                { icon: <FaBriefcase />, label: 'Role Type', value: job.roleType || 'Intern' },
                { icon: <FaMapMarkerAlt />, label: 'Working Mode', value: job.workingMode },
                { icon: <FaMoneyBillWave />, label: 'Stipend', value: job.stipend === 'None' ? 'Certificate-based' : job.stipend },
                { icon: <FaUsers />, label: 'Openings', value: job.openings },
                ...(job.deadline ? [{ icon: <FaCalendarAlt />, label: 'Last Date', value: new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) }] : []),
                ...(job.department ? [{ icon: <FaBriefcase />, label: 'Department', value: job.department }] : []),
              ].map(row => (
                <div key={row.label} className="summary-row">
                  <span className="summary-icon">{row.icon}</span>
                  <div>
                    <span>{row.label}</span>
                    <strong>{row.value}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
