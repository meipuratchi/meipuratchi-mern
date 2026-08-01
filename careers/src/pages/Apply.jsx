import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaExternalLinkAlt, FaCheck } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getJob, applyJob, getCareerMe } from '../api';
import './Apply.css';

export default function Apply() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const user     = JSON.parse(localStorage.getItem('careerUser') || 'null');

  const [job, setJob]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone]   = useState(false);
  const [form, setForm]   = useState({
    coverLetter: '',
    resumeLink: '',
    portfolioLink: '',
    linkedinUrl: '',
    skills: '',
    collegeOrOrg: '',
    degree: '',
    yearOfStudy: '',
  });
  const [termsAccepted, setTerms] = useState(false);

  // Guard: must be logged in
  useEffect(() => {
    if (!user) { navigate(`/login?redirect=/apply/${id}`); return; }
    Promise.all([
      getJob(id),
      getCareerMe(),
    ]).then(([jobRes, meRes]) => {
      setJob(jobRes.data.data);
      const me = meRes.data.data;
      setForm(f => ({
        ...f,
        resumeLink:    me.resumeLink    || '',
        linkedinUrl:   me.linkedinUrl   || '',
        skills:        me.skills        || '',
        collegeOrOrg:  me.collegeOrOrg  || '',
        degree:        me.degree        || '',
      }));
    }).catch(() => { toast.error('Could not load job details'); navigate('/'); })
      .finally(() => setLoading(false));
  }, [id]);

  const set = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!termsAccepted) { toast.error('Please accept the Terms & Conditions to apply'); return; }
    if (!form.resumeLink) { toast.error('Please provide your resume link'); return; }
    setSubmitting(true);
    try {
      await applyJob({ jobId: id, ...form });
      setDone(true);
      toast.success('Application submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="apply-page"><div className="container apply-loading">Loading…</div></div>;

  if (done) return (
    <div className="apply-page">
      <div className="container">
        <div className="apply-success">
          <div className="success-icon"><FaCheck /></div>
          <h2>Application Submitted!</h2>
          <p>Thank you for applying for <strong>{job?.title}</strong>. Our team will review your application and get back to you within 5–7 working days.</p>
          <p>You can track your application status in <Link to="/portal">My Applications</Link>.</p>
          <div className="success-actions">
            <Link to="/portal" className="btn btn-primary">View My Applications</Link>
            <Link to="/" className="btn btn-outline-dark">Browse More Roles</Link>
          </div>
        </div>
      </div>
    </div>
  );

  if (!job) return <div className="apply-page"><div className="container apply-loading">Job not found.</div></div>;
  const isExpired = job.deadline && new Date(job.deadline) < new Date();
  if (isExpired) return (
    <div className="apply-page"><div className="container apply-loading">
      <h3>Applications for this role are closed.</h3>
      <Link to="/" className="btn btn-primary" style={{ marginTop: 20 }}>← Back to Jobs</Link>
    </div></div>
  );

  return (
    <div className="apply-page">
      <div className="container">
        <Link to={`/jobs/${id}`} className="apply-back"><FaArrowLeft /> Back to job details</Link>

        <div className="apply-layout">
          {/* Form */}
          <div className="apply-form-area anim-up">
            <div className="apply-form-header">
              <h2>Apply for <span>{job.title}</span></h2>
              <p>Applying as <strong>{user?.name}</strong> · <Link to="/portal">Not you?</Link></p>
            </div>

            <form onSubmit={handleSubmit}>
              <fieldset className="apply-fieldset">
                <legend>Your Background</legend>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>College / Organization</label>
                    <input name="collegeOrOrg" value={form.collegeOrOrg} onChange={set} placeholder="e.g. Anna University, TCS..." />
                  </div>
                  <div className="form-group">
                    <label>Degree / Qualification</label>
                    <input name="degree" value={form.degree} onChange={set} placeholder="e.g. B.E. CSE, B.Sc., MCA..." />
                  </div>
                  <div className="form-group">
                    <label>Year of Study</label>
                    <select name="yearOfStudy" value={form.yearOfStudy} onChange={set}>
                      <option value="">Select Year</option>
                      <option>1st Year</option>
                      <option>2nd Year</option>
                      <option>3rd Year</option>
                      <option>4th Year</option>
                      <option>Graduate / Alumni</option>
                      <option>Fresher</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Your Key Skills</label>
                    <input name="skills" value={form.skills} onChange={set} placeholder="e.g. React, Node.js, Figma..." />
                  </div>
                </div>
              </fieldset>

              <fieldset className="apply-fieldset">
                <legend>Links</legend>
                <div className="form-group">
                  <label>Resume Link * <span className="field-note">(Google Drive, Dropbox, or any public link)</span></label>
                  <div className="link-input-wrap">
                    <input name="resumeLink" value={form.resumeLink} onChange={set} placeholder="https://drive.google.com/..." required />
                    {form.resumeLink && <a href={form.resumeLink} target="_blank" rel="noreferrer" className="link-open-btn"><FaExternalLinkAlt /></a>}
                  </div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>LinkedIn Profile</label>
                    <input name="linkedinUrl" value={form.linkedinUrl} onChange={set} placeholder="https://linkedin.com/in/..." />
                  </div>
                  <div className="form-group">
                    <label>Portfolio / GitHub</label>
                    <input name="portfolioLink" value={form.portfolioLink} onChange={set} placeholder="https://github.com/..." />
                  </div>
                </div>
              </fieldset>

              <fieldset className="apply-fieldset">
                <legend>Cover Letter</legend>
                <div className="form-group">
                  <label>Why do you want to join Meipuratchi? <span className="field-note">(optional but recommended)</span></label>
                  <textarea
                    name="coverLetter"
                    value={form.coverLetter}
                    onChange={set}
                    rows={5}
                    placeholder="Tell us about yourself, your motivation, and what you can contribute to our mission of guiding Tamil Nadu students..."
                  />
                </div>
              </fieldset>

              <div className="apply-terms-check">
                <label>
                  <input type="checkbox" checked={termsAccepted} onChange={e => setTerms(e.target.checked)} required />
                  <span>I have read and agree to the <Link to="/terms" target="_blank">Terms & Conditions</Link> and <Link to="/privacy" target="_blank">Privacy Policy</Link></span>
                </label>
              </div>

              <button type="submit" className="btn btn-accent" disabled={submitting} style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
                {submitting ? 'Submitting…' : 'Submit Application →'}
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="apply-sidebar">
            <div className="apply-job-card">
              <h4>You&apos;re applying for</h4>
              <h3>{job.title}</h3>
              <div className="apply-job-meta">
                <span>{job.workingMode}</span>
                <span>{job.roleType || 'Intern'}</span>
                {job.stipend !== 'None' && <span>{job.stipend}</span>}
              </div>
              {job.techStack?.length > 0 && (
                <div className="apply-tech">
                  {job.techStack.map(t => <span key={t}>{t}</span>)}
                </div>
              )}
            </div>

            <div className="apply-tips-card">
              <h4>💡 Application Tips</h4>
              <ul>
                <li>Make sure your resume link is publicly accessible (set sharing to "Anyone with link")</li>
                <li>A short, genuine cover letter improves your chances significantly</li>
                <li>Include your GitHub / portfolio if relevant</li>
                <li>We respond within 5–7 working days</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
