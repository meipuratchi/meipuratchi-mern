import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaUser, FaLock, FaEye, FaEyeSlash, FaEnvelope,
  FaShieldAlt, FaArrowLeft, FaKey, FaCheckCircle
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { loginUser, loginVerifyOTP, forgotPassword, resetPassword } from '../api';
import './UserAuth.css';

// ── OTP box sub-component ─────────────────────────────────
function OtpBoxes({ otp, setOtp, otpRefs }) {
  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp]; next[i] = val; setOtp(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };
  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };
  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) { setOtp(pasted.split('')); otpRefs.current[5]?.focus(); }
  };
  return (
    <div className="otp-boxes" onPaste={handlePaste}>
      {otp.map((digit, i) => (
        <input key={i} ref={el => otpRefs.current[i] = el}
          className="otp-box" type="text" inputMode="numeric"
          maxLength={1} value={digit}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          autoFocus={i === 0} />
      ))}
    </div>
  );
}

export default function UserLogin() {
  // step: 'login' | 'otp' | 'forgot' | 'forgot-otp' | 'new-password' | 'done'
  const [step, setStep]             = useState('login');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword]     = useState('');
  const [showPw, setShowPw]         = useState(false);
  const [showNewPw, setShowNewPw]   = useState(false);
  const [loading, setLoading]       = useState(false);

  // Login OTP
  const [userId, setUserId]         = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [loginOtp, setLoginOtp]     = useState(['','','','','','']);
  const loginOtpRefs                = useRef([]);

  // Forgot password
  const [fpIdentifier, setFpIdentifier] = useState('');
  const [fpUserId, setFpUserId]         = useState('');
  const [fpMasked, setFpMasked]         = useState('');
  const [fpOtp, setFpOtp]               = useState(['','','','','','']);
  const [newPassword, setNewPassword]   = useState('');
  const [confirmNewPw, setConfirmNewPw] = useState('');
  const fpOtpRefs                       = useRef([]);

  const navigate = useNavigate();

  // ── Step 1: credentials ──────────────────────────────────
  const handleCredentials = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser({ identifier, password });
      if (res.data.requiresOTP) {
        setUserId(res.data.userId);
        setMaskedEmail(res.data.maskedEmail);
        setStep('otp');
        toast.success('OTP sent to your email!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  // ── Step 2: verify login OTP ─────────────────────────────
  const handleLoginOtp = async e => {
    e.preventDefault();
    const code = loginOtp.join('');
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
      setLoginOtp(['','','','','','']);
      loginOtpRefs.current[0]?.focus();
    } finally { setLoading(false); }
  };

  // ── Forgot: send OTP ─────────────────────────────────────
  const handleForgotSend = async e => {
    e.preventDefault();
    if (!fpIdentifier.trim()) { toast.error('Enter your email or phone'); return; }
    setLoading(true);
    try {
      const res = await forgotPassword({ identifier: fpIdentifier });
      setFpUserId(res.data.userId || '');
      setFpMasked(res.data.maskedEmail || fpIdentifier);
      setStep('forgot-otp');
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  // ── Forgot: verify OTP ───────────────────────────────────
  const handleForgotOtp = async e => {
    e.preventDefault();
    const code = fpOtp.join('');
    if (code.length < 6) { toast.error('Enter the 6-digit OTP'); return; }
    // Just move to new password step — actual reset happens on submit
    setStep('new-password');
  };

  // ── Forgot: set new password ─────────────────────────────
  const handleResetPassword = async e => {
    e.preventDefault();
    if (newPassword !== confirmNewPw) { toast.error('Passwords do not match'); return; }
    if (newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await resetPassword({ userId: fpUserId, code: fpOtp.join(''), newPassword });
      setStep('done');
      toast.success('Password reset successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
      setStep('forgot-otp');
      setFpOtp(['','','','','','']);
    } finally { setLoading(false); }
  };

  const slideIn = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    exit:    { opacity: 0, y: -16 },
    transition: { duration: 0.35 },
  };

  return (
    <div className="auth-page">
      <AnimatePresence mode="wait">

        {/* ══ STEP 1: Login credentials ══ */}
        {step === 'login' && (
          <motion.div key="login" className="auth-card" {...slideIn}>
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
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password" required />
                  <button type="button" onClick={() => setShowPw(!showPw)}>
                    {showPw ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="auth-forgot-row">
                <button type="button" className="auth-forgot-link"
                  onClick={() => setStep('forgot')}>
                  Forgot password?
                </button>
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

        {/* ══ STEP 2: Login OTP ══ */}
        {step === 'otp' && (
          <motion.div key="otp" className="auth-card" {...slideIn}>
            <div className="auth-logo">
              <div className="otp-shield-icon"><FaShieldAlt /></div>
              <h2>Verify Your Identity</h2>
              <p>OTP sent to <strong>{maskedEmail}</strong></p>
            </div>
            <form onSubmit={handleLoginOtp}>
              <OtpBoxes otp={loginOtp} setOtp={setLoginOtp} otpRefs={loginOtpRefs} />
              <p className="otp-hint"><FaEnvelope /> Check your email inbox (and spam folder)</p>
              <button type="submit" className="btn btn-primary auth-btn"
                disabled={loading || loginOtp.join('').length < 6}>
                {loading ? 'Verifying...' : '✅ Verify & Login'}
              </button>
            </form>
            <button className="auth-back-btn"
              onClick={() => { setStep('login'); setLoginOtp(['','','','','','']); }}>
              <FaArrowLeft /> Back
            </button>
          </motion.div>
        )}

        {/* ══ FORGOT: Enter email ══ */}
        {step === 'forgot' && (
          <motion.div key="forgot" className="auth-card" {...slideIn}>
            <div className="auth-logo">
              <div className="otp-shield-icon" style={{ background: 'linear-gradient(135deg,#f5a623,#e09520)' }}>
                <FaKey />
              </div>
              <h2>Forgot Password</h2>
              <p>Enter your registered email or phone</p>
            </div>
            <form onSubmit={handleForgotSend}>
              <div className="form-group">
                <label><FaEnvelope /> Email or Phone</label>
                <input value={fpIdentifier} onChange={e => setFpIdentifier(e.target.value)}
                  placeholder="your@email.com or 9XXXXXXXXX" required />
              </div>
              <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
                {loading ? 'Sending OTP...' : 'Send Reset OTP →'}
              </button>
            </form>
            <button className="auth-back-btn" onClick={() => setStep('login')}>
              <FaArrowLeft /> Back to Login
            </button>
          </motion.div>
        )}

        {/* ══ FORGOT: Verify OTP ══ */}
        {step === 'forgot-otp' && (
          <motion.div key="forgot-otp" className="auth-card" {...slideIn}>
            <div className="auth-logo">
              <div className="otp-shield-icon" style={{ background: 'linear-gradient(135deg,#f5a623,#e09520)' }}>
                <FaShieldAlt />
              </div>
              <h2>Enter Reset OTP</h2>
              <p>Sent to <strong>{fpMasked}</strong></p>
            </div>
            <form onSubmit={handleForgotOtp}>
              <OtpBoxes otp={fpOtp} setOtp={setFpOtp} otpRefs={fpOtpRefs} />
              <p className="otp-hint"><FaEnvelope /> Check your email inbox (and spam folder)</p>
              <button type="submit" className="btn btn-primary auth-btn"
                disabled={fpOtp.join('').length < 6}>
                Continue →
              </button>
            </form>
            <button className="auth-back-btn" onClick={() => setStep('forgot')}>
              <FaArrowLeft /> Back
            </button>
          </motion.div>
        )}

        {/* ══ FORGOT: New password ══ */}
        {step === 'new-password' && (
          <motion.div key="new-password" className="auth-card" {...slideIn}>
            <div className="auth-logo">
              <div className="otp-shield-icon" style={{ background: 'linear-gradient(135deg,#28a745,#20c997)' }}>
                <FaLock />
              </div>
              <h2>Set New Password</h2>
              <p>Choose a strong password</p>
            </div>
            <form onSubmit={handleResetPassword}>
              <div className="form-group">
                <label><FaLock /> New Password</label>
                <div className="input-eye">
                  <input type={showNewPw ? 'text' : 'password'} value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters" required />
                  <button type="button" onClick={() => setShowNewPw(!showNewPw)}>
                    {showNewPw ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label><FaLock /> Confirm New Password</label>
                <input type="password" value={confirmNewPw}
                  onChange={e => setConfirmNewPw(e.target.value)}
                  placeholder="Re-enter new password" required />
              </div>
              <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
                {loading ? 'Resetting...' : '🔐 Reset Password'}
              </button>
            </form>
          </motion.div>
        )}

        {/* ══ DONE ══ */}
        {step === 'done' && (
          <motion.div key="done" className="auth-card" {...slideIn}>
            <div className="auth-logo">
              <div className="otp-shield-icon" style={{ background: 'linear-gradient(135deg,#28a745,#20c997)' }}>
                <FaCheckCircle />
              </div>
              <h2>Password Reset!</h2>
              <p>Your password has been updated successfully.</p>
            </div>
            <button className="btn btn-primary auth-btn" onClick={() => setStep('login')}>
              Login Now →
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
