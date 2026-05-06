import { useState } from 'react';
import { FaStethoscope, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useCMS } from '../hooks/useCMS';
import './Paramedical.css';

const courses = [
  { sl: 1, name: 'B.PHARM', govt: true, sf: true },
  { sl: 2, name: 'B.SC.(NURSING)', govt: true, sf: true },
  { sl: 3, name: 'BPT', govt: true, sf: true },
  { sl: 4, name: 'B.O.T', govt: true, sf: true },
  { sl: 5, name: 'BASLP', govt: true, sf: false },
  { sl: 6, name: 'B.SC. RADIOGRAPHY AND IMAGING TECHNOLOGY', govt: true, sf: true },
  { sl: 7, name: 'B.SC. RADIO THERAPY TECHNOLOGY', govt: true, sf: false },
  { sl: 8, name: 'B.SC. CARDIO-PULMONARY PERFUSION TECHNOLOGY', govt: true, sf: false },
  { sl: 9, name: 'B.SC MEDICAL LABORATORY TECHNOLOGY', govt: false, sf: true },
  { sl: 10, name: 'B.SC OPERATION THEATRE & ANAESTHESIA TECHNOLOGY', govt: false, sf: true },
  { sl: 11, name: 'B.SC CARDIAC TECHNOLOGY', govt: false, sf: true },
  { sl: 12, name: 'B.SC CRITICAL CARE TECHNOLOGY', govt: false, sf: true },
  { sl: 13, name: 'B.SC DIALYSIS TECHNOLOGY', govt: true, sf: false },
  { sl: 14, name: 'B.SC PHYSICIAN ASSISTANT', govt: false, sf: true },
  { sl: 15, name: 'B.SC ACCIDENT & EMERGENCY CARE TECHNOLOGY', govt: false, sf: true },
  { sl: 16, name: 'B.SC RESPIRATORY THERAPY', govt: true, sf: false },
  { sl: 17, name: 'B. OPTOM', govt: false, sf: true },
  { sl: 18, name: 'B.Sc. NEURO ELECTRO PHYSIOLOGY', govt: false, sf: true },
  { sl: 19, name: 'B.Sc. CLINICAL NUTRITION', govt: false, sf: true },
];

const fees = [
  { name: 'B. Pharm', fee: 'Rs. 43,000/-' },
  { name: 'B.Sc., (Nursing)', fee: 'Rs. 45,000/-' },
  { name: 'B.P.T.', fee: 'Rs. 33,000/-' },
  { name: 'B.O.T.', fee: 'Rs. 33,000/-' },
];

function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="accordion">
      <button className={`accordion-header ${open ? 'open' : ''}`} onClick={() => setOpen(!open)}>
        <span>{title}</span>
        {open ? <FaChevronUp /> : <FaChevronDown />}
      </button>
      {open && <div className="accordion-body">{children}</div>}
    </div>
  );
}

export default function Paramedical() {
  const { c } = useCMS('paramedical');
  return (
    <div className="para-page">
      <div className="para-hero">
        <div className="floating-circles">
          {[...Array(3)].map((_, i) => <div key={i} className="fc" />)}
        </div>
        <div className="container para-hero-content">
          <h1>{c('hero_title','Paramedical Degree Courses 2024-25')}</h1>
          <p>{c('hero_desc','Government of Tamil Nadu — Comprehensive information about all paramedical degree courses offered in government and self-financing colleges')}</p>
          <a href="#courses" className="btn btn-accent"><FaStethoscope /> {c('explore_btn','Explore Courses')}</a>
        </div>
      </div>

      <div className="container para-content">
        {/* Seat Info */}
        <div className="info-banner">
          <h3>{c('seat_title','Seat Allocation Information')}</h3>
          <p>{c('seat_info','65% of total seats in Non-Minority Institution and 50% of total seats in Minority Institution...')}</p>
        </div>

        {/* Courses Table */}
        <section id="courses" className="para-section">
          <h2>{c('courses_title','Available Courses')}</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>SL. No.</th>
                  <th>Name of the Course</th>
                  <th>Govt. Colleges</th>
                  <th>Self-Financing (Govt. Quota)</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(c => (
                  <tr key={c.sl}>
                    <td>{c.sl}</td>
                    <td>{c.name}</td>
                    <td><span className={`badge ${c.govt ? 'yes' : 'no'}`}>{c.govt ? 'YES' : 'NO'}</span></td>
                    <td><span className={`badge ${c.sf ? 'yes' : 'no'}`}>{c.sf ? 'YES' : 'NO'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Eligibility */}
        <section id="eligibility" className="para-section">
          <h2>Eligibility Criteria</h2>
          <Accordion title="Educational Qualifications">
            <div className="elig-box">
              <h4>For B.Pharm, BASLP & B.Optom:</h4>
              <p>English as one of the subjects and:</p>
              <ul>
                <li>Physics, Chemistry, Biology (mandatory) OR</li>
                <li>Physics, Chemistry, Botany and Zoology OR</li>
                <li>Physics, Chemistry, Mathematics</li>
              </ul>
            </div>
            <div className="elig-box">
              <h4>For All Other Courses:</h4>
              <p>English as one of the subjects and:</p>
              <ul>
                <li>Physics, Chemistry, Biology (mandatory) OR</li>
                <li>Physics, Chemistry, Botany and Zoology</li>
              </ul>
            </div>
          </Accordion>
          <Accordion title="Calculation of Marks">
            <p style={{ marginBottom: 16, color: 'var(--gray)' }}>Merit List will be made on merit on the basis of marks obtained by the eligible candidates in the prescribed subjects in the qualifying examinations reduced to the base of 200 marks.</p>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Subjects</th><th>Calculation</th></tr>
                </thead>
                <tbody>
                  <tr><td>Biology % (X) + Physics % (Y)</td><td>X + Y = 200 max</td></tr>
                  <tr><td>Maths % (Z) + Physics % (Y)</td><td>Z + Y = 200 max</td></tr>
                </tbody>
              </table>
            </div>
          </Accordion>
        </section>

        {/* Fees */}
        <section id="fees" className="para-section">
          <h2>Tuition Fees (Self-Financing Colleges)</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>SL. No.</th><th>Course</th><th>Tuition Fee (per Annum)</th></tr>
              </thead>
              <tbody>
                {fees.map((f, i) => (
                  <tr key={f.name}><td>{i + 1}</td><td>{f.name}</td><td className="fee-cell">{f.fee}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="note">Note: The actual number of seats offered by the Self-Financing Institutions will be displayed at the time of Counselling.</p>
        </section>

        {/* Documents */}
        <section className="para-section">
          <h2>Important Documents</h2>
          <div className="doc-links">
            {[
              { label: 'Explore Courses PDF', file: '/explore.pdf' },
              { label: 'Merit List', file: '/meritlist.pdf' },
              { label: 'Seat Matrix', file: '/seat_matix.pdf' },
              { label: 'Vacancy Details', file: '/vacancy.pdf' },
            ].map(d => (
              <a key={d.label} href={d.file} target="_blank" rel="noreferrer" className="doc-link-card">
                📄 {d.label}
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
