import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUsers, FaLock, FaEye, FaEyeSlash, FaEnvelope } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { loginUser } from '../api';
import './UserAuth.css';

export default function TeamLogin() {
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
      if (res.data.user.role !== 'team') {
        toast.error('Access denied. Team members only.');
        return;
      }
      localStorage.setItem('userToken', res.data.token);
      localStorage.setItem('userInfo',  JSON.stringify(res.data.user));
      toast.success(`Welcome, ${res.data.user.name}!`);
      navigate('/team/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ background: 'linear-gradient(135deg, #1a5c38 0%, #2d7a50 100%)' }}>
      <div className="auth-card">
        <div className="auth-logo">
          <img src="/mei_logo.png" alt="Meipuratchi" />
          <h2>Team Portal</h2>
          <p>Meipuratchi Team Members Only</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><FaEnvelope /> Email or Phone</label>
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
          <button type="submit" className="btn auth-btn" disabled={loading}
            style={{ background: '#1a5c38', color: 'white', width: '100%', justifyContent: 'center' }}>
            {loading ? 'Logging in...' : <><FaUsers /> Login to Team Dashboard</>}
          </button>
        </form>
        <p className="auth-switch">
          Student? <Link to="/portal/login">Go to Student Portal →</Link>
        </p>
      </div>
    </div>
  );
}
