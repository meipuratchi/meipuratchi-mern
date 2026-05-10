import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaGraduationCap, FaUser, FaPhone, FaEnvelope, FaSchool,
  FaMapMarkerAlt, FaLock, FaEye, FaEyeSlash, FaCheckCircle,
  FaArrowRight, FaArrowLeft, FaCalendarAlt, FaUpload, FaFileAlt
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { registerUser } from '../api';
import './Registration.css';

const districts = [
  'Chennai','Coimbatore','Madurai','Tiruchirappalli','Salem','Tirunelveli',
  'Tiruppur','Vellore','Erode','Thoothukudi','Dindigul','Thanjavur','Ranipet',
  'Sivaganga','Virudhunagar','Nagapattinam','Kanyakumari','Dharmapuri',
  'Krishnagiri','Perambalur','Ariyalur','Pudukkottai','Ramanathapuram',
  'Namakkal','Cuddalore','Villupuram','Kallakurichi','Chengalpattu',
  'Kancheepuram','Tiruvallur','Tiruvannamalai','Nilgiris','Karur','Tiruvarur'
];

const qualifications = [
  '6th to 9th Std',
  '10th Std',
  '11th Std',
  '12th Std',
  'Diploma',
  'Degree',
  'Other'
];

const careerInterests = [
  'MBBS',
  'Paramedical Degree',
  'Paramedical Diploma',
  'Engineering',
  'Bachelor of Science (B.Sc)',
  'Bachelor of Arts (B.A)',
  'Bachelor of Commerce (B.Com)',
  'Bachelor of Computer Applications (BCA)',
  'TNPSC / Government Jobs',
  'Other'
];

// Step metadata
const STEPS = [
  { num: 1, label: 'Account',  labelTa: 'கணக்கு',    icon: <FaLock /> },
  { num: 2, label: 'Personal', labelTa: 'தனிப்பட்ட', icon: <FaUser /> },
  { num: 3, label: 'Education',labelTa: 'கல்வி',      icon: <FaGraduationCap /> },
];

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit:  (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0, transition: { duration: 0.25 } }),
};

export default function Registration() {
  const navigate  = useNavigate();
  const fileRef   = useRef(null);

  const [step, setStep]       = useState(1);
  const [dir,  setDir]        = useState(1);
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [proofFile, setProofFile] = useState(null);
  const [otherQual, setOtherQual]     = useState('');
  const [otherInterest, setOtherInterest] = useState('');

  const [form, setForm] = useState({
    // Step 1 — Account
    email: '', phone: '', password: '', confirmPassword: '',
    // Step 2 — Personal
    name: '', dateOfBirth: '',
    // Step 3 — Education
    district: '', school: '', qualification: '', careerInterest: '',
  });

  const set = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const goNext = () => { setDir(1); setStep(s => s + 1); };
  const goPrev = () => { setDir(-1); setStep(s => s - 1); };

  /* ── Step 1 validation ── */
  const validateStep1 = () => {
    if (!form.email || !form.phone || !form.password || !form.confirmPassword) {
      toast.error('Please fill all required fields'); return false;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      toast.error('Enter a valid email address'); return false;
    }
    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      toast.error('Enter a valid 10-digit Indian mobile number'); return false;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters'); return false;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match'); return false;
    }
    return true;
  };

  /* ── Step 2 validation ── */
  const validateStep2 = () => {
    if (!form.name || !form.dateOfBirth) {
      toast.error('Please fill all required fields'); return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    goNext();
  };

  /* ── File upload handler ── */
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be under 10 MB'); return;
    }
    setProofFile(file);
  };

  /* ── Final submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalQual     = form.qualification === 'Other' ? otherQual     : form.qualification;
    const finalInterest = form.careerInterest === 'Other' ? otherInterest : form.careerInterest;

    if (!finalQual || !finalInterest) {
      toast.error('Please fill all required fields'); return;
    }

    setLoading(true);
    try {
      // Convert proof file to base64 if provided
      let proofFileUrl = '';
      if (proofFile) {
        proofFileUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload  = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(proofFile);
        });
      }

      const payload = {
        email:          form.email,
        phone:          form.phone,
        password:       form.password,
        name:           form.name,
        dateOfBirth:    form.dateOfBirth,
        district:       form.district,
        school:         form.school,
        qualification:  finalQual,
        careerInterest: finalInterest,
        proofFileUrl,
        role: 'student',
      };

      const res = await registerUser(payload);
      localStorage.setItem('userToken', res.data.token);
      localStorage.setItem('userInfo',  JSON.stringify(res.data.user));
      toast.success('Registration successful! Welcome to Meipuratchi 🎉');
      navigate('/portal');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reg-page">
      {/* Hero */}
      <div className="reg-hero">
        <div className="container">
          <motion.div
            className="reg-hero-badge"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FaGraduationCap /> கல்வி ஆலோசனை பதிவேடு
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Career Guidance Registration
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Career Guidance for Tamil Nadu Government School Students<br />
            <span style={{ fontSize: '0.9rem', opacity: 0.75 }}>
              தமிழ்நாடு அரசுப் பள்ளி மாணவர்களுக்கான வழிகாட்டுதல்
            </span>
          </motion.p>
        </div>
      </div>

      <div className="container reg-container">
        {/* Sidebar */}
        <div className="reg-info">
          <h3>Why Register?</h3>
          <ul>
            <li>✅ Dedicated one-on-one career counseling</li>
            <li>✅ Personalized guidance from expert counselors</li>
            <li>✅ Expert counselors for NEET, JEE, Engineering, Paramedical</li>
            <li>✅ 6 months follow-up support</li>
            <li>✅ Priority for government school students</li>
          </ul>
          <div className="reg-eligibility">
            <h4>Eligibility</h4>
            <p>Students from Tamil Nadu who have completed or are studying 6th–12th standard, including those who have faced setbacks in board exams.</p>
            <p style={{ marginTop: 12 }}>
              <strong>Required Documents:</strong> School ID Card or Mark Sheet (max 10 MB)
            </p>
          </div>
          <div className="reg-eligibility" style={{ marginTop: 16 }}>
            <h4>Already registered?</h4>
            <Link
              to="/portal/login"
              className="btn btn-primary"
              style={{ marginTop: 10, display: 'inline-flex', fontSize: '0.85rem', padding: '10px 20px' }}
            >
              Login to your Portal →
            </Link>
          </div>
        </div>

        {/* Multi-step form */}
        <div className="reg-form-wrap card">

          {/* Step indicator */}
          <div className="step-indicator">
            {STEPS.map((s, i) => (
              <div key={s.num} className="step-indicator-item">
                <motion.div
                  className={`step-circle ${step === s.num ? 'active' : step > s.num ? 'done' : ''}`}
                  whileHover={{ scale: 1.1 }}
                >
                  {step > s.num ? <FaCheckCircle /> : s.icon}
                </motion.div>
                <div className="step-label">
                  <span>{s.label}</span>
                  <small>{s.labelTa}</small>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`step-line ${step > s.num ? 'done' : ''}`} />
                )}
              </div>
            ))}
          </div>

          {/* Animated step content */}
          <div className="step-content-wrap">
            <AnimatePresence mode="wait" custom={dir}>
              {/* ── STEP 1: Account ── */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  custom={dir}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  <div className="step-heading">
                    <FaLock className="step-heading-icon" />
                    <div>
                      <h3>Create Your Account</h3>
                      <p>உங்கள் கணக்கை உருவாக்கவும்</p>
                    </div>
                  </div>

                  <div className="form-group">
                    <label><FaEnvelope /> Email Address *</label>
                    <input
                      name="email" type="email" value={form.email} onChange={set}
                      placeholder="your@email.com" required
                    />
                  </div>

                  <div className="form-group">
                    <label><FaPhone /> Phone Number *</label>
                    <input
                      name="phone" type="tel" value={form.phone} onChange={set}
                      placeholder="10-digit mobile number" maxLength={10} required
                    />
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label><FaLock /> Password *</label>
                      <div className="input-eye-reg">
                        <input
                          type={showPw ? 'text' : 'password'}
                          name="password" value={form.password} onChange={set}
                          placeholder="Min 6 characters" required
                        />
                        <button type="button" onClick={() => setShowPw(v => !v)}>
                          {showPw ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                    <div className="form-group">
                      <label><FaLock /> Confirm Password *</label>
                      <input
                        type="password" name="confirmPassword"
                        value={form.confirmPassword} onChange={set}
                        placeholder="Re-enter password" required
                      />
                    </div>
                  </div>

                  <div className="step-nav">
                    <span />
                    <motion.button
                      type="button" className="btn btn-primary step-btn"
                      onClick={handleNext}
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    >
                      Next — Personal Details <FaArrowRight />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 2: Personal Details ── */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  custom={dir}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  <div className="step-heading">
                    <FaUser className="step-heading-icon" />
                    <div>
                      <h3>Personal Details</h3>
                      <p>தனிப்பட்ட விவரங்கள்</p>
                    </div>
                  </div>

                  <div className="form-group">
                    <label><FaUser /> Full Name * <span className="label-ta">(முழு பெயர்)</span></label>
                    <input
                      name="name" value={form.name} onChange={set}
                      placeholder="Enter your full name" required
                    />
                  </div>

                  <div className="form-group">
                    <label><FaCalendarAlt /> Date of Birth * <span className="label-ta">(பிறந்த தேதி)</span></label>
                    <input
                      type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={set}
                      max={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div className="step-nav">
                    <motion.button
                      type="button" className="btn btn-outline-dark step-btn"
                      onClick={goPrev}
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    >
                      <FaArrowLeft /> Back
                    </motion.button>
                    <motion.button
                      type="button" className="btn btn-primary step-btn"
                      onClick={handleNext}
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    >
                      Next — Education Details <FaArrowRight />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 3: Education Details ── */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  custom={dir}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  <div className="step-heading">
                    <FaGraduationCap className="step-heading-icon" />
                    <div>
                      <h3>Education Details</h3>
                      <p>கல்வி விவரங்கள்</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="grid-2">
                      <div className="form-group">
                        <label><FaMapMarkerAlt /> District <span className="label-ta">(மாவட்டம்)</span></label>
                        <select name="district" value={form.district} onChange={set}>
                          <option value="">Select District</option>
                          {districts.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label><FaSchool /> School Name <span className="label-ta">(பள்ளி பெயர்)</span></label>
                        <input
                          name="school" value={form.school} onChange={set}
                          placeholder="Enter your school name"
                        />
                      </div>
                    </div>

                    {/* Qualification */}
                    <div className="form-group">
                      <label>
                        <FaGraduationCap /> Current Academic Qualification *
                        <span className="label-ta"> (தற்போதைய கல்வி தகுதி)</span>
                      </label>
                      <div className="radio-group">
                        {qualifications.map(q => (
                          <label key={q} className={`radio-card ${form.qualification === q ? 'selected' : ''}`}>
                            <input
                              type="radio" name="qualification"
                              value={q} checked={form.qualification === q}
                              onChange={set}
                            />
                            <span>{q}</span>
                          </label>
                        ))}
                      </div>
                      {form.qualification === 'Other' && (
                        <motion.input
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="other-input"
                          placeholder="Please specify your qualification"
                          value={otherQual}
                          onChange={e => setOtherQual(e.target.value)}
                          required
                        />
                      )}
                    </div>

                    {/* Career Interest */}
                    <div className="form-group">
                      <label>
                        Area of Interest (Career Stream) *
                        <span className="label-ta"> (விருப்பமான துறை)</span>
                      </label>
                      <div className="radio-group">
                        {careerInterests.map(ci => (
                          <label key={ci} className={`radio-card ${form.careerInterest === ci ? 'selected' : ''}`}>
                            <input
                              type="radio" name="careerInterest"
                              value={ci} checked={form.careerInterest === ci}
                              onChange={set}
                            />
                            <span>{ci}</span>
                          </label>
                        ))}
                      </div>
                      {form.careerInterest === 'Other' && (
                        <motion.input
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="other-input"
                          placeholder="Please specify your career interest"
                          value={otherInterest}
                          onChange={e => setOtherInterest(e.target.value)}
                          required
                        />
                      )}
                    </div>

                    {/* Proof Upload */}
                    <div className="form-group">
                      <label>
                        <FaUpload /> Proof Document *
                        <span className="label-ta"> (சான்று ஆவணம்)</span>
                      </label>
                      <p className="field-hint">
                        Upload School ID Card, Mark Sheet, or any valid proof (Max 10 MB — JPG, PNG, PDF)
                      </p>
                      <div
                        className={`file-drop-zone ${proofFile ? 'has-file' : ''}`}
                        onClick={() => fileRef.current?.click()}
                      >
                        <input
                          ref={fileRef}
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={handleFile}
                          style={{ display: 'none' }}
                        />
                        {proofFile ? (
                          <div className="file-selected">
                            <FaFileAlt className="file-icon" />
                            <div>
                              <p className="file-name">{proofFile.name}</p>
                              <p className="file-size">{(proofFile.size / 1024).toFixed(1)} KB</p>
                            </div>
                            <button
                              type="button"
                              className="file-remove"
                              onClick={e => { e.stopPropagation(); setProofFile(null); }}
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="file-placeholder">
                            <FaUpload className="upload-icon" />
                            <p>Click to upload or drag & drop</p>
                            <small>JPG, PNG, PDF — Max 10 MB</small>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="step-nav">
                      <motion.button
                        type="button" className="btn btn-outline-dark step-btn"
                        onClick={goPrev}
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      >
                        <FaArrowLeft /> Back
                      </motion.button>
                      <motion.button
                        type="submit" className="btn btn-primary step-btn submit-btn"
                        disabled={loading}
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      >
                        {loading ? 'Submitting...' : '🎓 Complete Registration'}
                      </motion.button>
                    </div>

                    <p className="submit-note">
                      No fees. No charges. Fully supported by volunteers.
                    </p>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Thank-you note at bottom */}
          <div className="reg-thankyou">
            <p>
              After verifying your details, our team will contact you via the provided phone number or email.
              We'll help you discover the best career path tailored for you.
              <strong> Wishing you success and joy in your life journey! 🌟</strong>
            </p>
            <p className="reg-thankyou-ta">
              உங்கள் விவரங்களை சரிபார்த்த பிறகு, எங்கள் குழு உங்களை தொடர்பு கொள்ளும்.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
