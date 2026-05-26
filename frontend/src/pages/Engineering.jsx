import { useState } from 'react';
import { FaCalculator, FaUniversity, FaExternalLinkAlt, FaSearch } from 'react-icons/fa';
import { useCMS } from '../hooks/useCMS';
import './Engineering.css';

const topColleges = [
  { code: '1315', name: 'Sri Sivasubramaniya Nadar College of Engineering', district: 'Kanchipuram' },
  { code: '1399', name: 'Chennai Institute of Technology', district: 'Chennai' },
  { code: '1211', name: 'Rajalakshmi Engineering College', district: 'Kanchipuram' },
  { code: '1116', name: 'Sri Venkateswara College of Engineering and Technology', district: 'Thiruvallur' },
  { code: '1309', name: 'Meenakshi Sundararajan Engineering College', district: 'Chennai' },
  { code: '1324', name: 'Sri Sai Ram Institute of Technology', district: 'Kanchipuram' },
  { code: '1432', name: 'Rajalakshmi Institute of Technology', district: 'Chennai' },
  { code: '1450', name: 'Loyola-ICAM College of Engineering and Technology', district: 'Chennai' },
  { code: '1304', name: 'Easwari Engineering College', district: 'Chennai' },
  { code: '1210', name: 'Panimalar Engineering College', district: 'Thiruvallur' },
  { code: '1216', name: 'Saveetha Engineering College', district: 'Kancheepuram' },
  { code: '1405', name: 'Dhanalakshmi College of Engineering', district: 'Kancheepuram' },
  { code: '1422', name: 'SRM Valliammai Engineering College', district: 'Kancheepuram' },
  { code: '1317', name: 'St. Joseph\'s College of Engineering', district: 'Kanchipuram' },
  { code: '1120', name: 'Velammal Engineering College', district: 'Thiruvallur' },
  { code: '1149', name: 'St. Joseph\'s Institute of Technology', district: 'Kanchipuram' },
  { code: '1311', name: 'KCG College of Technology', district: 'Chennai' },
  { code: '5008', name: 'Thiagarajar College of Engineering', district: 'Madurai' },
  { code: '5986', name: 'Velammal College of Engineering and Technology', district: 'Madurai' },
];

export default function Engineering() {
  const { c } = useCMS('engineering');
  const [physics, setPhysics] = useState('');
  const [chemistry, setChemistry] = useState('');
  const [maths, setMaths] = useState('');
  const [cutoff, setCutoff] = useState(null);
  const [search, setSearch] = useState('');

  // CMS-driven colleges list (falls back to hardcoded)
  const cmsColleges = c('colleges_list', null);
  const colleges = cmsColleges && Array.isArray(cmsColleges) ? cmsColleges : topColleges;

  const calculate = e => {
    e.preventDefault();
    const p = parseFloat(physics), c = parseFloat(chemistry), m = parseFloat(maths);
    if (isNaN(p) || isNaN(c) || isNaN(m)) return;
    const result = (p / 2) + (c / 2) + m;
    setCutoff(result.toFixed(2));
  };

  const filtered = colleges.filter(col =>
    col.name.toLowerCase().includes(search.toLowerCase()) ||
    col.code.includes(search) ||
    col.district.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="eng-page">
      <div className="eng-hero">
        <div className="container">
          <h1>{c('hero_title','Tamil Nadu Engineering Counselling 2026')}</h1>
          <p>{c('hero_quote','"Design is the art of turning constraints into opportunities." – Aza Raskin')}</p>
          <div className="eng-hero-actions">
            <a href="#calculator" className="btn btn-accent"><FaCalculator /> {c('calc_btn','Calculate Cutoff')}</a>
            <a href="#colleges" className="btn btn-outline"><FaUniversity /> {c('colleges_btn','Explore Colleges')}</a>
          </div>
        </div>
      </div>

      {/* Announcement */}
      <div className="announcement-bar">
        <div className="announcement-scroll">
          {c('announcement','Important: No tuition fee, no hostel fee, and no college bus fee for 7.5% students!')}
          &nbsp;&nbsp;&nbsp;
          {c('announcement','Important: No tuition fee, no hostel fee, and no college bus fee for 7.5% students!')}
        </div>
      </div>

      <div className="container eng-content">
        {/* Cutoff Info */}
        <section className="eng-section">
          <h2>{c('cutoff_title','How to Find Cutoff Marks')}</h2>
          <p>{c('cutoff_desc','Check the official cutoff marks for engineering colleges in Tamil Nadu through the TNEA portal.')}</p>
          <a href={c('cutoff_link','https://cutoff.tneaonline.org/')} target="_blank" rel="noreferrer" className="cutoff-link">
            {c('cutoff_link_text','Visit Official Cutoff Portal')} <FaExternalLinkAlt />
          </a>
          <p style={{ marginTop: 16 }}>{c('cutoff_desc2','On the cutoff portal, you can search by college, branch, or category to find the exact cutoff marks from previous years.')}</p>
        </section>

        {/* Calculator */}
        <section id="calculator" className="eng-section">
          <h2><FaCalculator /> {c('calc_title','Cutoff Mark Calculator')}</h2>
          <p>{c('calc_desc','Calculate your engineering cutoff mark based on your 12th standard Physics, Chemistry, and Mathematics scores.')}</p>
          <form onSubmit={calculate} className="calc-form">
            <div className="form-group">
              <label>Physics Mark (out of 100)</label>
              <input type="number" min="0" max="100" value={physics} onChange={e => setPhysics(e.target.value)} placeholder="Enter Physics mark" required />
            </div>
            <div className="form-group">
              <label>Chemistry Mark (out of 100)</label>
              <input type="number" min="0" max="100" value={chemistry} onChange={e => setChemistry(e.target.value)} placeholder="Enter Chemistry mark" required />
            </div>
            <div className="form-group">
              <label>Mathematics Mark (out of 100)</label>
              <input type="number" min="0" max="100" value={maths} onChange={e => setMaths(e.target.value)} placeholder="Enter Mathematics mark" required />
            </div>
            <button type="submit" className="btn btn-primary">Calculate Cutoff</button>
          </form>
          {cutoff && (
            <div className="cutoff-result">
              <h4>Your Engineering Cutoff Mark is:</h4>
              <p className="cutoff-score">{cutoff} / 200</p>
              <p className="cutoff-formula">Formula: (Physics/2) + (Chemistry/2) + Mathematics</p>
            </div>
          )}
        </section>

        {/* Colleges */}
        <section id="colleges" className="eng-section">
          <h2><FaUniversity /> {c('colleges_title','Engineering Colleges in Tamil Nadu')}</h2>
          <div className="college-search">
            <FaSearch />
            <input
              type="text"
              placeholder="Search by college name, code or district..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <p className="college-count">Showing <strong>{filtered.length}</strong> autonomous engineering colleges</p>
          <div className="college-grid">
            {filtered.map(col => (
              <div key={col.code} className="college-card card">
                <div className="college-code">{col.code}</div>
                <div className="college-info">
                  <h4>{col.name}</h4>
                  <p>📍 {col.district}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PDFs */}
        <section className="eng-section">
          <h2>Important Documents</h2>
          <div className="doc-grid">
            {[
              { label: 'All Colleges List', file: '/all_colleges.pdf' },
              { label: 'Choice Order Guide', file: '/ChoiceOrder.pdf' },
              { label: 'TNEA Tentative Schedule 2026', file: '/TNEA_Tent_Schedule_2026.pdf' },
              { label: 'Top Colleges', file: '/top_colleges.pdf' },
            ].map(doc => (
              <a key={doc.label} href={doc.file} target="_blank" rel="noreferrer" className="doc-card card">
                <span>📄</span>
                <p>{doc.label}</p>
                <small>Download PDF</small>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
