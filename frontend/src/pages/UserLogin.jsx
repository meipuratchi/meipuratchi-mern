import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaGraduationCap } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { loginUser } from '../api';
import './UserAuth.css';

export default function UserLogin() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword]     = useState('');
  const [showPw, setShowPw]         = useState(false);
  const [loading, setLoading]       = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser({ identifier, password });
      localStorage.setItem('userToken', res.data.token);
      localStorage.setItem('userInfo',  JSON.stringify(res.data.user));
      toast.success(`Welcome back, ${res.data.user.name}!`);
      navigate('/portal');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <img src="/mei_logo.png" alt="Meipuratchi" />
          <h2>மெய் புரட்சி</h2>
          <p>Student Portal</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><FaUser /> Email or Phone</label>
            <input
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              placeholder="Enter email or phone number"
              required
            />
          </div>
          <div className="form-group">
            <label><FaLock /> Password</label>
            <div className="input-eye">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <button type="button" onClick={() => setShowPw(!showPw)}>
                {showPw ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login to Portal'}
          </button>
        </form>
        <p className="auth-switch">
          New here? <Link to="/portal/register">Register for free guidance →</Link>
        </p>
      </div>
    </div>
  );
}
