import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { loginCareerUser } from '../api';
import './Auth.css';

export default function Login() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get('redirect') || '/portal';
  const [form, setForm]     = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginCareerUser(form);
      localStorage.setItem('careerToken', res.data.token);
      localStorage.setItem('careerUser',  JSON.stringify(res.data.user));
      toast.success(`Welcome back, ${res.data.user.name}!`);
      navigate(redirect);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <img src="/mei_logo.png" alt="Meipuratchi" />
          <h2>Sign In</h2>
          <p>Access your Meipuratchi Careers account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><FaEnvelope /> Email</label>
            <input type="email" name="email" value={form.email} onChange={set} placeholder="your@email.com" required />
          </div>
          <div className="form-group">
            <label><FaLock /> Password</label>
            <div className="input-eye">
              <input type={showPw ? 'text' : 'password'} name="password" value={form.password} onChange={set} placeholder="Your password" required />
              <button type="button" onClick={() => setShowPw(!showPw)}>{showPw ? <FaEyeSlash /> : <FaEye />}</button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
        </form>

        <p className="auth-switch">
          No account? <Link to="/register">Create one — it&apos;s free</Link>
        </p>
      </div>
    </div>
  );
}
