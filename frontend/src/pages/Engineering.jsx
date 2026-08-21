import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCalculator, FaUniversity, FaExternalLinkAlt, FaSearch } from 'react-icons/fa';
import { useCMS } from '../hooks/useCMS';
import collegeData from '../data/engineeringColleges2025.json';
import './Engineering.css';

const categories = ['OC', 'BC', 'BCM', 'MBC', 'SC', 'SCA', 'ST'];
const catalogue = collegeData.flatMap(college => college.courses.map(course => ({ ...course, collegeCode: college.code, collegeName: college.name, district: college.district, pincode: college.pincode, id: `${college.code}-${course.code || course.name}` })));

export default function Engineering() {
  const { c } = useCMS('engineering');
  const [physics, setPhysics] = useState('');
  const [chemistry, setChemistry] = useState('');
  const [maths, setMaths] = useState('');
  const [cutoff, setCutoff] = useState(null);
  const [search, setSearch] = useState('');
  const [district, setDistrict] = useState('');
  const [course, setCourse] = useState('');
  const [category, setCategory] = useState('OC');
  const [filterCutoff, setFilterCutoff] = useState('');

  const calculate = e => {
    e.preventDefault();
    const p = parseFloat(physics), c = parseFloat(chemistry), m = parseFloat(maths);
    if (isNaN(p) || isNaN(c) || isNaN(m)) return;
    const result = (p / 2) + (c / 2) + m;
    setCutoff(result.toFixed(2));
  };

  const districts = [...new Set(collegeData.map(col => col.district))].sort();
  const courses = [...new Set(catalogue.map(item => item.name))].sort();
  const filtered = catalogue.filter(item => {
    const q = search.toLowerCase().trim();
    const mark = item.cutoffs[category];
    return (!q || [item.collegeName, item.collegeCode, item.district, item.pincode, item.name].join(' ').toLowerCase().includes(q))
      && (!district || item.district === district)
      && (!course || item.name === course)
      && (!filterCutoff || (mark !== null && mark <= Number(filterCutoff)));
  });

  return (
    <div className="eng-page">
      <div className="eng-hero">
        <div className="container">
          <h1>Tamil Nadu Engineering Counselling 2025</h1>
          <p>{c('hero_quote','"Design is the art of turning constraints into opportunities." – Aza Raskin')}</p>
          <div className="eng-hero-actions">
            <a href="#calculator" className="btn btn-accent"><FaCalculator /> {c('calc_btn','Calculate Cutoff')}</a>
            <a href="#colleges" className="btn btn-outline"><FaUniversity /> Explore Colleges</a>
            <Link to="/engineering/c-programming" className="btn btn-outline">Start C Foundations</Link>
            <Link to="/engineering/choice-filling" className="btn btn-accent">Build Choice Order</Link>
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
        <section className="c-onboarding-callout">
          <div>
            <span className="c-onboarding-label">For new engineering students</span>
            <h2>Start your C programming foundation</h2>
            <p>Prepare for CSE, IT, AI/ML, AI&amp;DS, and ECE with a simple onboarding guide, compiler setup steps, and beginner resources.</p>
          </div>
          <Link to="/engineering/c-programming" className="btn btn-accent">Open C Foundations</Link>
        </section>

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
          <h2><FaUniversity /> Engineering Colleges &amp; Course Cutoffs — 2025</h2>
          <div className="college-search">
            <FaSearch />
            <input
              type="text"
              placeholder="Search college, code, pincode, district or course..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="college-filters">
            <select value={district} onChange={e => setDistrict(e.target.value)}><option value="">All districts</option>{districts.map(item => <option key={item}>{item}</option>)}</select>
            <select value={course} onChange={e => setCourse(e.target.value)}><option value="">All courses</option>{courses.map(item => <option key={item}>{item}</option>)}</select>
            <select value={category} onChange={e => setCategory(e.target.value)}>{categories.map(item => <option key={item}>{item} cutoff</option>)}</select>
            <input type="number" min="0" max="200" step="0.5" placeholder="Your cutoff" value={filterCutoff} onChange={e => setFilterCutoff(e.target.value)} />
          </div>
          <div className="college-list-actions"><p className="college-count">Showing <strong>{filtered.length.toLocaleString()}</strong> course choices. {filterCutoff && `Eligible at ${filterCutoff} or below for ${category}.`}</p><Link to="/engineering/choice-filling" className="choice-fill-link">Choose &amp; order colleges →</Link></div>
          <div className="college-grid">
            {filtered.slice(0, 120).map(col => (
              <div key={col.id} className="college-card card">
                <div className="college-card-header">
                  <div className="college-code">{col.collegeCode}</div>
                  <Link to={`/engineering/choice-filling?add=${encodeURIComponent(col.id)}`} className="add-choice-btn">+ Add</Link>
                </div>
                <div className="college-info">
                  <h4>{col.collegeName}</h4>
                  <p className="college-course">{col.name}</p>
                  <p className="college-location">📍 {col.district}{col.pincode && ` · ${col.pincode}`}</p>
                  <div className="cutoff-grid">
                    {categories.map(cat => {
                      const val = col.cutoffs[cat];
                      return (
                        <div key={cat} className={`cutoff-cell ${cat === category ? 'cutoff-cell--active' : ''} ${val == null ? 'cutoff-cell--na' : ''}`}>
                          <span className="cutoff-cat">{cat}</span>
                          <span className="cutoff-val">{val ?? '—'}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filtered.length > 120 && <p className="catalogue-limit">Showing the first 120 matches. Narrow the filters or use the choice-filling page to search all results.</p>}
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
