import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { registerCareerUser } from '../api';
import './Auth.css';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    collegeOrOrg: '', degree: '', skills: '', resumeLink: '', linkedinUrl: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTerms] = useState(false);

  const set = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!termsAccepted) { toast.error('Please accept the Terms & Conditions'); return; }
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const { confirmPassword, ...data } = form;
      const res = await registerCareerUser(data);
      localStorage.setItem('careerToken', res.data.token);
      localStorage.setItem('careerUser',  JSON.stringify(res.data.user));
      toast.success('Account created! Welcome to Meipuratchi Careers.');
      navigate('/portal');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-register-wide">
        <div className="auth-logo">
          <img src="/mei_logo.png" alt="Meipuratchi" />
          <h2>Create Account</h2>
          <p>Join Meipuratchi Careers — apply to internships &amp; roles</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="auth-grid-2">
            <div className="form-group">
              <label><FaUser /> Full Name *</label>
              <input name="name" value={form.name} onChange={set} placeholder="Your full name" required />
            </div>
            <div className="form-group">
              <label><FaPhone /> Phone *</label>
              <input name="phone" value={form.phone} onChange={set} placeholder="+91 XXXXX XXXXX" required />
            </div>
          </div>
          <div className="form-group">
            <label><FaEnvelope /> Email *</label>
            <input type="email" name="email" value={form.email} onChange={set} placeholder="your@email.com" required />
          </div>
          <div className="auth-grid-2">
            <div className="form-group">
              <label><FaLock /> Password *</label>
              <div className="input-eye">
                <input type={showPw ? 'text' : 'password'} name="password" value={form.password} onChange={set} placeholder="Min 6 characters" required />
                <button type="button" onClick={() => setShowPw(!showPw)}>{showPw ? <FaEyeSlash /> : <FaEye />}</button>
              </div>
            </div>
            <div className="form-group">
              <label><FaLock /> Confirm Password *</label>
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={set} placeholder="Re-enter password" required />
            </div>
          </div>

          <hr className="auth-divider" />

          <div className="auth-grid-2">
            <div className="form-group">
              <label>College / Organization</label>
              <input name="collegeOrOrg" value={form.collegeOrOrg} onChange={set} placeholder="e.g. Anna University..." />
            </div>
            <div className="form-group">
              <label>Degree</label>
              <input name="degree" value={form.degree} onChange={set} placeholder="e.g. B.E. CSE, B.Sc..." />
            </div>
          </div>
          <div className="form-group">
            <label>Skills</label>
            <input name="skills" value={form.skills} onChange={set} placeholder="e.g. React, Node.js, Design..." />
          </div>
          <div className="form-group">
            <label>Resume Link <span style={{ fontSize:'0.78rem', color:'var(--gray)' }}>(Google Drive / any public link)</span></label>
            <input name="resumeLink" value={form.resumeLink} onChange={set} placeholder="https://drive.google.com/..." />
          </div>
          <div className="form-group">
            <label>LinkedIn URL</label>
            <input name="linkedinUrl" value={form.linkedinUrl} onChange={set} placeholder="https://linkedin.com/in/..." />
          </div>

          <div style={{ margin: '16px 0 12px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <input type="checkbox" id="terms" checked={termsAccepted} onChange={e => setTerms(e.target.checked)} style={{ marginTop: 3, width: 16, height: 16, accentColor: 'var(--primary)', cursor: 'pointer', flexShrink: 0 }} />
            <label htmlFor="terms" style={{ fontSize: '0.86rem', color: 'var(--gray)', cursor: 'pointer', lineHeight: 1.5 }}>
              I agree to the <Link to="/terms" target="_blank" style={{ color: 'var(--primary)', fontWeight: 600 }}>Terms & Conditions</Link> and <Link to="/privacy" target="_blank" style={{ color: 'var(--primary)', fontWeight: 600 }}>Privacy Policy</Link>
            </label>
          </div>

          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? 'Creating account…' : '🚀 Create My Account'}
          </button>
        </form>

        <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}
