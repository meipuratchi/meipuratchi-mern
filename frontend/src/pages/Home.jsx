import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaFlask, FaPaintBrush, FaMusic, FaArrowRight, FaUsers, FaStar, FaHeart, FaCheckCircle } from 'react-icons/fa';
import { getStats } from '../api';
import { useCMS } from '../hooks/useCMS';
import './Home.css';

export default function Home() {
  const { c } = useCMS('home');
  const [stats, setStats] = useState({ total: 0, counseled: 0 });

  useEffect(() => {
    getStats().then(r => setStats(r.data.data)).catch(() => {});
  }, []);

  const careerCards = [
    { icon: <FaFlask />, title: c('card1_title','Science Stream'), titleTa: c('card1_title_ta','அறிவியல் துறை'), items: c('card1_items',['NEET for Medical','JEE for Engineering','Research Careers']), color: '#192441' },
    { icon: <FaPaintBrush />, title: c('card2_title','Arts Stream'), titleTa: c('card2_title_ta','கலைத் துறை'), items: c('card2_items',['Performing Arts','Literature & Languages','Social Sciences']), color: '#2196F3' },
    { icon: <FaMusic />, title: c('card3_title','Creative Fields'), titleTa: c('card3_title_ta','படைப்புத் துறைகள்'), items: c('card3_items',['Music & Composition','Film Direction','Fine Arts']), color: '#f5a623' },
  ];

  const steps = [
    { num: '01', title: c('step1_title','Register Online'),      desc: c('step1_desc','Fill a simple form on our website') },
    { num: '02', title: c('step2_title','Profile Verified'),     desc: c('step2_desc','Our team verifies within 48 hours') },
    { num: '03', title: c('step3_title','Get Confirmation'),     desc: c('step3_desc','Receive SMS/Email confirmation') },
    { num: '04', title: c('step4_title','Counseling Session'),   desc: c('step4_desc','One-on-one guidance with our counselor') },
    { num: '05', title: c('step5_title','Course Selection'),     desc: c('step5_desc','Choose your ideal career path') },
    { num: '06', title: c('step6_title','Follow-up Support'),    desc: c('step6_desc','6 months of continued support') },
  ];

  const checks = (c('about_checks',['Tamil Nadu Students','Government School Priority','Free of Cost','6 Months Follow-up']));
  const checkList = Array.isArray(checks) ? checks : ['Tamil Nadu Students','Government School Priority','Free of Cost','6 Months Follow-up'];

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${10 + Math.random() * 10}s`,
              width: `${5 + Math.random() * 10}px`,
              height: `${5 + Math.random() * 10}px`,
            }} />
          ))}
        </div>
        <div className="hero-bg" />
        <div className="container hero-content">
          <div className="hero-badge animate-fadeInUp">
            <FaStar /> {c('hero_badge','Free Career Guidance for TN Government School Students')}
          </div>
          <h1 className="hero-title animate-fadeInUp">
            {c('hero_title','மெய் புரட்சி')}
            <span>{c('hero_subtitle','Student Career Guidance')}</span>
          </h1>
          <p className="hero-desc animate-fadeInUp">
            {c('hero_desc','Empowering 10th, 12th & dropout students across Tamil Nadu with free, accessible career counseling.')}
          </p>
          <div className="hero-actions animate-fadeInUp">
            <Link to="/registration" className="btn btn-accent">
              <FaGraduationCap /> {c('hero_btn1',"Register Now — It's Free!")}
            </Link>
            <Link to="/engineering" className="btn btn-outline">
              {c('hero_btn2','Explore Opportunities')} <FaArrowRight />
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span>{stats.total || c('stat1_value','500+')} </span>
              <p>{c('stat1_label','Students Registered')}</p>
            </div>
            <div className="hero-stat">
              <span>{stats.counseled || c('stat2_value','200+')}</span>
              <p>{c('stat2_label','Students Counseled')}</p>
            </div>
            <div className="hero-stat">
              <span>{c('stat3_value','100%')}</span>
              <p>{c('stat3_label','Free Service')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="section-pad about-section">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <div className="tag">{c('about_tag','About the Initiative')}</div>
              <h2 className="section-title">{c('about_title_ta','முயற்சி பற்றி')}<br /><span>{c('about_title','About Us')}</span></h2>
              <p>{c('about_desc','We guide students from 10th, 12th, and even those who have failed in their board exams.')}</p>
              <div className="about-highlight">
                <FaHeart className="highlight-icon" />
                <p><strong>{c('mission_label','Our Mission:')}</strong> {c('mission_text','To provide free, accessible career guidance to every government school student in Tamil Nadu.')}</p>
              </div>
              <div className="about-checks">
                {checkList.map((item, i) => (
                  <div key={i} className="check-item"><FaCheckCircle /> {item}</div>
                ))}
              </div>
            </div>
            <div className="about-visual">
              <div className="about-card-stack">
                <div className="about-card ac1"><FaGraduationCap /><h4>{c('acard1_title','Career Guidance')}</h4><p>{c('acard1_desc','Personalized counseling sessions')}</p></div>
                <div className="about-card ac2"><FaUsers /><h4>{c('acard2_title','Volunteer Team')}</h4><p>{c('acard2_desc','Dedicated professionals')}</p></div>
                <div className="about-card ac3"><FaStar /><h4>{c('acard3_title','Success Stories')}</h4><p>{c('acard3_desc','Students placed in top colleges')}</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Career Cards */}
      <section className="section-pad bg-light">
        <div className="container text-center">
          <div className="tag">{c('careers_tag','Opportunities & Exams')}</div>
          <h2 className="section-title">{c('careers_title_ta','வாய்ப்புகள் & தேர்வுகள்')}<br /><span>{c('careers_title','Career Paths')}</span></h2>
          <p className="section-subtitle">{c('careers_desc','Comprehensive information about various career paths and examination opportunities')}</p>
          <div className="grid-3">
            {careerCards.map(card => (
              <div key={card.title} className="career-card card">
                <div className="career-icon" style={{ background: card.color }}>{card.icon}</div>
                <h3>{card.titleTa}</h3>
                <h4>{card.title}</h4>
                <ul>
                  {(Array.isArray(card.items) ? card.items : []).map(item => (
                    <li key={item}><FaCheckCircle /> {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="section-pad">
        <div className="container text-center">
          <div className="tag">{c('process_tag','Process')}</div>
          <h2 className="section-title">{c('process_title_ta','இது எப்படி வேலை செய்கிறது')}<br /><span>{c('process_title','How It Works')}</span></h2>
          <p className="section-subtitle">{c('process_desc','Simple 6-step process to get your career guidance')}</p>
          <div className="steps-grid">
            {steps.map(step => (
              <div key={step.num} className="step-card">
                <div className="step-num">{step.num}</div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container text-center">
          <h2>{c('cta_title','Ready to Shape Your Future?')}</h2>
          <p>{c('cta_desc','Join thousands of Tamil Nadu students who have found their career path with Meipuratchi')}</p>
          <div className="cta-actions">
            <Link to="/registration" className="btn btn-accent"><FaGraduationCap /> {c('cta_btn1',"Register Now — Free!")}</Link>
            <Link to="/volunteer" className="btn btn-outline"><FaHeart /> {c('cta_btn2','Volunteer With Us')}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
