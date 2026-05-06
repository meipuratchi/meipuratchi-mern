import { useState } from 'react';
import { FaHeart, FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { submitVolunteer } from '../api';
import { useCMS } from '../hooks/useCMS';
import './Volunteer.css';

const departments = ['Design', 'Social Media', 'Counseling', 'Technical', 'Language', 'Innovation', 'Student Support', 'Coordination'];

export default function Volunteer() {
  const { c } = useCMS('volunteer');
  const [form, setForm] = useState({ name: '', email: '', phone: '', department: '', skills: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitVolunteer(form);
      setSuccess(true);
      toast.success('Volunteer application submitted! We will reach out soon.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vol-page">
      <div className="vol-hero">
        <div className="container">
          <h1>{c('hero_title','Volunteer With Us')}</h1>
          <p>{c('hero_desc','Join our team of dedicated volunteers and help shape the future of Tamil Nadu students')}</p>
        </div>
      </div>

      <div className="container vol-container">
        <div className="vol-why">
          <h3>{c('why_title','Why Volunteer?')}</h3>
          <div className="why-grid">
            {[
              { emoji: '🎓', title: c('why1_title','Make an Impact'), desc: c('why1_desc','Directly help students find their career path') },
              { emoji: '🤝', title: c('why2_title','Build Network'),  desc: c('why2_desc','Connect with like-minded professionals') },
              { emoji: '📜', title: c('why3_title','Get Certificate'),desc: c('why3_desc','Receive official volunteer recognition letter') },
              { emoji: '💡', title: c('why4_title','Gain Experience'),desc: c('why4_desc','Develop leadership and mentoring skills') },
            ].map(w => (
              <div key={w.title} className="why-card">
                <span>{w.emoji}</span>
                <h4>{w.title}</h4>
                <p>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="vol-form-wrap card">
          {success ? (
            <div className="success-state">
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎉</div>
              <h2>Application Submitted!</h2>
              <p>Thank you for your interest in volunteering with Meipuratchi. We will review your application and contact you soon.</p>
              <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => setSuccess(false)}>
                Submit Another Application
              </button>
            </div>
          ) : (
            <>
              <h3><FaHeart /> Volunteer Application</h3>
              <form onSubmit={handleSubmit}>
                <div className="grid-2">
                  <div className="form-group">
                    <label><FaUser /> Full Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name" required />
                  </div>
                  <div className="form-group">
                    <label><FaPhone /> Phone *</label>
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" required />
                  </div>
                </div>
                <div className="form-group">
                  <label><FaEnvelope /> Email *</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
                </div>
                <div className="form-group">
                  <label>Preferred Department *</label>
                  <select name="department" value={form.department} onChange={handleChange} required>
                    <option value="">Select Department</option>
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Your Skills</label>
                  <input name="skills" value={form.skills} onChange={handleChange} placeholder="e.g., Graphic Design, Tamil, Programming..." />
                </div>
                <div className="form-group">
                  <label>Why do you want to volunteer?</label>
                  <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell us about your motivation..." />
                </div>
                <button type="submit" className="btn btn-primary submit-btn" disabled={loading}>
                  {loading ? 'Submitting...' : '❤️ Apply to Volunteer'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
