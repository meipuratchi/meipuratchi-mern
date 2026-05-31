import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaEnvelope, FaShieldAlt, FaArrowLeft } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { loginUser, loginVerifyOTP } from '../api';
import './UserAuth.css';

export default function UserLogin() {
  const [step, setStep]             = useState(1); // 1=credentials, 2=OTP
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword]     = useState('');
  const [showPw, setShowPw]         = useState(false);
  const [loading, setLoading]       = useState(false);
  const [userId, setUserId]         = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [otp, setOtp]               = useState(['', '', '', '', '', '']);
  const otpRefs                     = useRef([]);
  const navigate = useNavigate();

  // Step 1: submit credentials → get OTP sent
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

  // Step 2: submit OTP → get JWT
  const handleOTP = async e => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) { toast.error('Enter the 6-digit OTP'); return; }
    setLoading(true);
    try {
      const res = await loginVerifyOTP({ userId, code });
      localStorage.setItem('userToken', res.data.token);
      localStorage.setItem('userInfo',  JSON.stringify(res.data.user));
      toast.success(`Welcome back, ${res.data.user.name}! 🎉`);
      navigate('/portal');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // OTP input: auto-advance on digit entry
  const handleOtpChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      otpRefs.current[5]?.focus();
    }
  };

  return (
    <div className="auth-page">
      <AnimatePresence mode="wait">

        {/* ── Step 1: Credentials ── */}
        {step === 1 && (
          <motion.div key="creds" className="auth-card"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
            <div className="auth-logo">
              <img src="/mei_logo.png" alt="Meipuratchi" />
              <h2>மெய் புரட்சி</h2>
              <p>Student Portal</p>
            </div>
            <form onSubmit={handleCredentials}>
              <div className="form-group">
                <label><FaUser /> Email or Phone</label>
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
              <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
                {loading ? 'Sending OTP...' : 'Continue →'}
              </button>
            </form>
            <p className="auth-switch">
              New here? <Link to="/portal/register">Register for free guidance →</Link>
            </p>
          </motion.div>
        )}

        {/* ── Step 2: OTP ── */}
        {step === 2 && (
          <motion.div key="otp" className="auth-card"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
            <div className="auth-logo">
              <div className="otp-shield-icon"><FaShieldAlt /></div>
              <h2>Verify Your Identity</h2>
              <p>OTP sent to <strong>{maskedEmail}</strong></p>
            </div>

            <form onSubmit={handleOTP}>
              <div className="otp-boxes" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => otpRefs.current[i] = el}
                    className="otp-box"
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              <p className="otp-hint">
                <FaEnvelope /> Check your email inbox (and spam folder)
              </p>

              <button type="submit" className="btn btn-primary auth-btn" disabled={loading || otp.join('').length < 6}>
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
