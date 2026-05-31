import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUsers, FaLock, FaEye, FaEyeSlash, FaEnvelope, FaShieldAlt, FaArrowLeft } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { loginUser, loginVerifyOTP } from '../api';
import './UserAuth.css';

export default function TeamLogin() {
  const [step, setStep]             = useState(1);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword]     = useState('');
  const [showPw, setShowPw]         = useState(false);
  const [loading, setLoading]       = useState(false);
  const [userId, setUserId]         = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [otp, setOtp]               = useState(['', '', '', '', '', '']);
  const otpRefs                     = useRef([]);
  const navigate = useNavigate();

  const handleCredentials = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser({ identifier, password });
      if (res.data.requiresOTP) {
        setUserId(res.data.userId);
        setMaskedEmail(res.data.maskedEmail);
        setStep(2);
        toast.success('OTP sent to your email!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
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
      const res = await loginVerifyOTP({ userId, code });
      if (res.data.user.role !== 'team') {
        toast.error('Access denied. Team members only.');
        return;
      }
      localStorage.setItem('userToken', res.data.token);
      localStorage.setItem('userInfo',  JSON.stringify(res.data.user));
      toast.success(`Welcome, ${res.data.user.name}!`);
      navigate('/team/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
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

  const green = 'linear-gradient(135deg, #1a5c38 0%, #2d7a50 100%)';

  return (
    <div className="auth-page" style={{ background: green }}>
      <AnimatePresence mode="wait">

        {step === 1 && (
          <motion.div key="creds" className="auth-card"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
            <div className="auth-logo">
              <img src="/mei_logo.png" alt="Meipuratchi" />
              <h2>Team Portal</h2>
              <p>Meipuratchi Team Members Only</p>
            </div>
            <form onSubmit={handleCredentials}>
              <div className="form-group">
                <label><FaEnvelope /> Email or Phone</label>
                <input value={identifier} onChange={e => setIdentifier(e.target.value)}
                  placeholder="Enter email or phone number" required />
              </div>
              <div className="form-group">
                <label><FaLock /> Password</label>
                <div className="input-eye">
                  <input type={showPw ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required />
                  <button type="button" onClick={() => setShowPw(!showPw)}>
                    {showPw ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn auth-btn" disabled={loading}
                style={{ background: '#1a5c38', color: 'white', width: '100%', justifyContent: 'center' }}>
                {loading ? 'Sending OTP...' : <><FaUsers /> Continue →</>}
              </button>
            </form>
            <p className="auth-switch">Student? <Link to="/portal/login">Go to Student Portal →</Link></p>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="otp" className="auth-card"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
            <div className="auth-logo">
              <div className="otp-shield-icon" style={{ background: '#1a5c38' }}><FaShieldAlt /></div>
              <h2>Verify Identity</h2>
              <p>OTP sent to <strong>{maskedEmail}</strong></p>
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
              <p className="otp-hint"><FaEnvelope /> Check your email inbox</p>
              <button type="submit" className="btn auth-btn" disabled={loading || otp.join('').length < 6}
                style={{ background: '#1a5c38', color: 'white', width: '100%', justifyContent: 'center' }}>
                {loading ? 'Verifying...' : '✅ Verify & Login'}
              </button>
            </form>
            <button className="auth-back-btn" onClick={() => { setStep(1); setOtp(['','','','','','']); }}>
              <FaArrowLeft /> Back
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
