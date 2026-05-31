import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaPhone, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaShieldAlt, FaArrowLeft } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { registerUser, verifyEmailOTP, sendOTP } from '../api';
import './UserAuth.css';

const districts = ['Chennai','Coimbatore','Madurai','Tiruchirappalli','Salem','Tirunelveli','Tiruppur','Vellore','Erode','Thoothukudi','Dindigul','Thanjavur','Kanyakumari','Dharmapuri','Krishnagiri','Namakkal','Cuddalore','Villupuram','Chengalpattu','Kancheepuram','Tiruvallur','Tiruvannamalai','Karur','Nilgiris'];
const roles = [
  { value: 'student',   label: '🎓 Student — Career Guidance' },
  { value: 'volunteer', label: '🤝 Volunteer — Join the Team' },
];

export default function UserRegister() {
  const [step, setStep]       = useState('form'); // 'form' | 'otp'
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    role: 'student', school: '', district: '', standard: '',
    stream: '', careerInterest: '', skills: '',
  });
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp]         = useState(['', '', '', '', '', '']);
  const [resending, setResending] = useState(false);
  const otpRefs               = useRef([]);
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
      toast.success('Account created! Check your email for the verification OTP.');
      setStep('otp');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOTP = async e => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) { toast.error('Enter the 6-digit OTP'); return; }
    setLoading(true);
    try {
      await verifyEmailOTP({ code });
      toast.success('Email verified! Welcome to Meipuratchi 🎉');
      navigate('/portal');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await sendOTP({ identifier: form.email, purpose: 'verify' });
      toast.success('New OTP sent!');
    } catch { toast.error('Failed to resend OTP'); }
    finally { setResending(false); }
  };

  const handleOtpChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp]; next[i] = val; setOtp(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) { setOtp(pasted.split('')); otpRefs.current[5]?.focus(); }
  };

  return (
    <div className="auth-page register-page">
      <AnimatePresence mode="wait">

      {/* ── OTP Verification Step ── */}
      {step === 'otp' && (
        <motion.div key="otp" className="auth-card"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
          <div className="auth-logo">
            <div className="otp-shield-icon"><FaShieldAlt /></div>
            <h2>Verify Your Email</h2>
            <p>OTP sent to <strong>{form.email}</strong></p>
          </div>
          <form onSubmit={handleOTP}>
            <div className="otp-boxes" onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input key={i} ref={el => otpRefs.current[i] = el}
                  className="otp-box" type="text" inputMode="numeric"
                  maxLength={1} value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(i, e)}
                  autoFocus={i === 0} />
              ))}
            </div>
            <p className="otp-hint"><FaEnvelope /> Check your inbox (and spam folder)</p>
            <button type="submit" className="btn btn-primary auth-btn"
              disabled={loading || otp.join('').length < 6}>
              {loading ? 'Verifying...' : '✅ Verify Email'}
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button className="auth-resend-btn" onClick={handleResend} disabled={resending}>
              {resending ? 'Sending...' : "Didn't receive? Resend OTP"}
            </button>
          </div>
          <button className="auth-back-btn" onClick={() => { setStep('form'); setOtp(['','','','','','']); }}>
            <FaArrowLeft /> Back to form
          </button>
        </motion.div>
      )}

      {/* ── Registration Form ── */}
      {step === 'form' && (
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
      )}

      </AnimatePresence>
    </div>
  );
}
