import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGraduationCap, FaUser, FaPhone, FaEnvelope, FaSchool, FaMapMarkerAlt, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { registerUser } from '../api';
import './Registration.css';

const districts = ['Chennai','Coimbatore','Madurai','Tiruchirappalli','Salem','Tirunelveli','Tiruppur','Vellore','Erode','Thoothukudi','Dindigul','Thanjavur','Ranipet','Sivaganga','Virudhunagar','Nagapattinam','Kanyakumari','Dharmapuri','Krishnagiri','Perambalur','Ariyalur','Pudukkottai','Ramanathapuram','Namakkal','Cuddalore','Villupuram','Kallakurichi','Chengalpattu','Kancheepuram','Tiruvallur','Tiruvannamalai','Nilgiris','Karur','Tiruvarur'];
const streams   = ['Science (PCM)', 'Science (PCB)', 'Commerce', 'Arts', 'Vocational'];
const interests = ['Engineering', 'Medical / NEET', 'Paramedical', 'Arts & Science', 'Law', 'Music / Fine Arts', 'Film Direction', 'Government Jobs', 'Other'];

export default function Registration() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    school: '', district: '', standard: '', stream: '', careerInterest: '', aadhaar: '',
  });
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match'); return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters'); return;
    }
    setLoading(true);
    try {
      const { confirmPassword, aadhaar, ...data } = form;
      const res = await registerUser({ ...data, role: 'student' });
      localStorage.setItem('userToken', res.data.token);
      localStorage.setItem('userInfo',  JSON.stringify(res.data.user));
      toast.success('Registration successful! Welcome to Meipuratchi.');
      navigate('/portal');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reg-page">
      <div className="reg-hero">
        <div className="container">
          <div className="reg-hero-badge"><FaGraduationCap /> Free Registration</div>
          <h1>Student Registration</h1>
          <p>Free Career Guidance for Tamil Nadu Government School Students</p>
        </div>
      </div>

      <div className="container reg-container">
        <div className="reg-info">
          <h3>Why Register?</h3>
          <ul>
            <li>✅ 100% Free career counseling</li>
            <li>✅ One-on-one guidance session</li>
            <li>✅ Expert counselors for NEET, JEE, Engineering, Paramedical</li>
            <li>✅ 6 months follow-up support</li>
            <li>✅ Priority for government school students</li>
          </ul>
          <div className="reg-eligibility">
            <h4>Eligibility</h4>
            <p>Students from Tamil Nadu who have completed or are studying 10th / 12th standard, including those who have faced setbacks in board exams.</p>
            <p style={{ marginTop: 12 }}><strong>Required Documents:</strong> ID Card, Aadhaar Card, 10th/12th Mark Sheet</p>
          </div>
          <div className="reg-eligibility" style={{ marginTop: 16 }}>
            <h4>Already registered?</h4>
            <Link to="/portal/login" className="btn btn-primary" style={{ marginTop: 10, display: 'inline-flex', fontSize: '0.85rem', padding: '10px 20px' }}>
              Login to your Portal →
            </Link>
          </div>
        </div>

        <div className="reg-form-wrap card">
          <h3><FaGraduationCap /> Register for Free Guidance</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label><FaUser /> Full Name *</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Enter your full name" required />
              </div>
              <div className="form-group">
                <label><FaPhone /> Phone Number *</label>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" required />
              </div>
            </div>
            <div className="form-group">
              <label><FaEnvelope /> Email Address *</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label><FaLock /> Password *</label>
                <div className="input-eye-reg">
                  <input type={showPw ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="Min 6 characters" required />
                  <button type="button" onClick={() => setShowPw(!showPw)}>{showPw ? <FaEyeSlash /> : <FaEye />}</button>
                </div>
              </div>
              <div className="form-group">
                <label><FaLock /> Confirm Password *</label>
                <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Re-enter password" required />
              </div>
            </div>
            <div className="form-group">
              <label><FaSchool /> School Name *</label>
              <input name="school" value={form.school} onChange={handleChange} placeholder="Enter your school name" required />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label><FaMapMarkerAlt /> District *</label>
                <select name="district" value={form.district} onChange={handleChange} required>
                  <option value="">Select District</option>
                  {districts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Standard *</label>
                <select name="standard" value={form.standard} onChange={handleChange} required>
                  <option value="">Select Standard</option>
                  <option value="10th">10th Standard</option>
                  <option value="12th">12th Standard</option>
                  <option value="Dropout">Dropout / Passed</option>
                </select>
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>Stream</label>
                <select name="stream" value={form.stream} onChange={handleChange}>
                  <option value="">Select Stream</option>
                  {streams.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Career Interest</label>
                <select name="careerInterest" value={form.careerInterest} onChange={handleChange}>
                  <option value="">Select Interest</option>
                  {interests.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary submit-btn" disabled={loading}>
              {loading ? 'Creating your account...' : '🎓 Register & Go to My Portal'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
