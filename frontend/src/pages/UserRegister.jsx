import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaPhone, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { registerUser } from '../api';
import './UserAuth.css';

const districts = ['Chennai','Coimbatore','Madurai','Tiruchirappalli','Salem','Tirunelveli','Tiruppur','Vellore','Erode','Thoothukudi','Dindigul','Thanjavur','Kanyakumari','Dharmapuri','Krishnagiri','Namakkal','Cuddalore','Villupuram','Chengalpattu','Kancheepuram','Tiruvallur','Tiruvannamalai','Karur','Nilgiris'];
const roles = [
  { value: 'student',   label: '🎓 Student — Career Guidance' },
  { value: 'volunteer', label: '🤝 Volunteer — Join the Team' },
];

export default function UserRegister() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    role: 'student', school: '', district: '', standard: '',
    stream: '', careerInterest: '', skills: '',
  });
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const set = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const { confirmPassword, ...data } = form;
      const res = await registerUser(data);
      localStorage.setItem('userToken', res.data.token);
      localStorage.setItem('userInfo',  JSON.stringify(res.data.user));
      toast.success('Account created! Welcome to Meipuratchi 🎉');
      navigate('/portal');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page register-page">
      <AnimatePresence mode="wait">
      {/* ── Registration Form ── */}
      <motion.div key="form" className="auth-card wide"
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
        <div className="auth-logo">
          <img src="/mei_logo.png" alt="Meipuratchi" />
          <h2>Create Account</h2>
          <p>Free career guidance for Tamil Nadu students</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Role */}
          <div className="role-selector">
            {roles.map(r => (
              <label key={r.value} className={`role-option ${form.role === r.value ? 'active' : ''}`}>
                <input type="radio" name="role" value={r.value} checked={form.role === r.value} onChange={set} />
                {r.label}
              </label>
            ))}
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label><FaUser /> Full Name *</label>
              <input name="name" value={form.name} onChange={set} placeholder="Your full name" required />
            </div>
            <div className="form-group">
              <label><FaPhone /> Phone *</label>
              <input name="phone" value={form.phone} onChange={set} placeholder="+91 XXXXX XXXXX" required />
            </div>
            <div className="form-group span-2">
              <label><FaEnvelope /> Email *</label>
              <input type="email" name="email" value={form.email} onChange={set} placeholder="your@email.com" required />
            </div>
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

            {form.role === 'student' && <>
              <div className="form-group span-2">
                <label>School Name</label>
                <input name="school" value={form.school} onChange={set} placeholder="Your school name" />
              </div>
              <div className="form-group">
                <label>District</label>
                <select name="district" value={form.district} onChange={set}>
                  <option value="">Select District</option>
                  {districts.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Standard</label>
                <select name="standard" value={form.standard} onChange={set}>
                  <option value="">Select</option>
                  <option>10th</option><option>12th</option><option>Dropout</option>
                </select>
              </div>
              <div className="form-group">
                <label>Stream</label>
                <select name="stream" value={form.stream} onChange={set}>
                  <option value="">Select Stream</option>
                  {['Science (PCM)','Science (PCB)','Commerce','Arts','Vocational'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Career Interest</label>
                <select name="careerInterest" value={form.careerInterest} onChange={set}>
                  <option value="">Select Interest</option>
                  {['Engineering','Medical / NEET','Paramedical','Arts & Science','Law','Music / Fine Arts','Government Jobs','Other'].map(i => <option key={i}>{i}</option>)}
                </select>
              </div>
            </>}

            {form.role === 'volunteer' && (
              <div className="form-group span-2">
                <label>Your Skills</label>
                <input name="skills" value={form.skills} onChange={set} placeholder="e.g. Tamil, Graphic Design, Programming..." />
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? 'Creating account...' : '🎓 Create Account — Free!'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/portal/login">Login →</Link>
        </p>
      </motion.div>

      </AnimatePresence>
    </div>
  );
}
