import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaShieldAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from 'axios';
import './AdminLogin.css';

export default function AdminLogin() {
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.get('http://localhost:5000/api/admin/stats', {
        headers: { 'x-admin-key': key }
      });
      localStorage.setItem('adminKey', key);
      toast.success('Welcome, Admin!');
      navigate('/admin/dashboard');
    } catch {
      toast.error('Invalid admin key');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="login-card">
        <div className="login-icon"><FaShieldAlt /></div>
        <h2>Admin Access</h2>
        <p>Meipuratchi Dashboard</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><FaLock /> Admin Key</label>
            <input
              type="password"
              value={key}
              onChange={e => setKey(e.target.value)}
              placeholder="Enter admin key"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary submit-btn" disabled={loading}>
            {loading ? 'Verifying...' : 'Login to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
