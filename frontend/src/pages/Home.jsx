import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaFlask, FaPaintBrush, FaMusic, FaArrowRight, FaUsers, FaStar, FaHeart, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { getStats } from '../api';
import { useCMS } from '../hooks/useCMS';
import AnimatedSection, { AnimatedStagger, AnimatedItem } from '../components/AnimatedSection';
import AnimatedBackground from '../components/AnimatedBackground';
import './Home.css';

export default function Home() {
  const { c } = useCMS('home');
  const [stats, setStats] = useState({ total: 0, counseled: 0 });
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true });

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
      <section className="hero" ref={heroRef}>
        <AnimatedBackground variant="particles" />
        <div className="hero-bg" />
        <div className="container hero-content">
          <motion.div 
            className="hero-badge"
            initial={{ opacity: 0, y: -30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <FaStar />
            </motion.div>
            {c('hero_badge','Free Career Guidance for TN Government School Students')}
          </motion.div>

          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 40 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {c('hero_title','மெய் புரட்சி')}
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {c('hero_subtitle','Student Career Guidance')}
            </motion.span>
          </motion.h1>

          <motion.p 
            className="hero-desc"
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {c('hero_desc','Empowering 10th, 12th & dropout students across Tamil Nadu with free, accessible career counseling.')}
          </motion.p>

          <motion.div 
            className="hero-actions"
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(245, 166, 35, 0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/registration" className="btn btn-accent">
                <FaGraduationCap /> {c('hero_btn1',"Register Now — It's Free!")}
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/engineering" className="btn btn-outline">
                {c('hero_btn2','Explore Opportunities')} <FaArrowRight />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div 
            className="hero-stats"
            initial={{ opacity: 0, y: 40 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            {[
              { value: stats.total || c('stat1_value','500+'), label: c('stat1_label','Students Registered') },
              { value: stats.counseled || c('stat2_value','200+'), label: c('stat2_label','Students Counseled') },
              { value: c('stat3_value','100%'), label: c('stat3_label','Free Service') }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                className="hero-stat"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={heroInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 1.4 + i * 0.1 }}
                whileHover={{ scale: 1.1, y: -5 }}
              >
                <span>{stat.value}</span>
                <p>{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About */}
      <section className="section-pad about-section">
        <div className="container">
          <div className="about-grid">
            <AnimatedSection variant="fadeInLeft">
              <div className="about-text">
                <motion.div 
                  className="tag"
                  whileHover={{ scale: 1.05 }}
                >
                  {c('about_tag','About the Initiative')}
                </motion.div>
                <h2 className="section-title">{c('about_title_ta','முயற்சி பற்றி')}<br /><span>{c('about_title','About Us')}</span></h2>
                <p>{c('about_desc','We guide students from 10th, 12th, and even those who have failed in their board exams.')}</p>
                <motion.div 
                  className="about-highlight"
                  whileHover={{ scale: 1.02, x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <FaHeart className="highlight-icon" />
                  </motion.div>
                  <p><strong>{c('mission_label','Our Mission:')}</strong> {c('mission_text','To provide free, accessible career guidance to every government school student in Tamil Nadu.')}</p>
                </motion.div>
                <div className="about-checks">
                  {checkList.map((item, i) => (
                    <motion.div 
                      key={i} 
                      className="check-item"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      whileHover={{ x: 10, scale: 1.05 }}
                    >
                      <FaCheckCircle /> {item}
                    </motion.div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection variant="fadeInRight">
              <div className="about-visual">
                <div className="about-card-stack">
                  {[
                    { icon: <FaGraduationCap />, title: c('acard1_title','Career Guidance'), desc: c('acard1_desc','Personalized counseling sessions'), className: 'ac1' },
                    { icon: <FaUsers />, title: c('acard2_title','Volunteer Team'), desc: c('acard2_desc','Dedicated professionals'), className: 'ac2' },
                    { icon: <FaStar />, title: c('acard3_title','Success Stories'), desc: c('acard3_desc','Students placed in top colleges'), className: 'ac3' }
                  ].map((card, i) => (
                    <motion.div 
                      key={i}
                      className={`about-card ${card.className}`}
                      initial={{ opacity: 0, y: 50, rotate: -5 }}
                      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.2, duration: 0.6 }}
                      whileHover={{ 
                        scale: 1.05, 
                        rotate: 2,
                        zIndex: 10,
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                      }}
                    >
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                      >
                        {card.icon}
                      </motion.div>
                      <h4>{card.title}</h4>
                      <p>{card.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Career Cards */}
      <section className="section-pad bg-light">
        <div className="container text-center">
          <AnimatedSection variant="fadeInDown">
            <motion.div 
              className="tag"
              whileHover={{ scale: 1.1 }}
            >
              {c('careers_tag','Opportunities & Exams')}
            </motion.div>
            <h2 className="section-title">{c('careers_title_ta','வாய்ப்புகள் & தேர்வுகள்')}<br /><span>{c('careers_title','Career Paths')}</span></h2>
            <p className="section-subtitle">{c('careers_desc','Comprehensive information about various career paths and examination opportunities')}</p>
          </AnimatedSection>

          <AnimatedStagger className="grid-3">
            {careerCards.map((card, i) => (
              <AnimatedItem key={i}>
                <motion.div 
                  className="career-card card"
                  whileHover={{ 
                    y: -15, 
                    scale: 1.03,
                    boxShadow: '0 30px 60px rgba(0,0,0,0.2)'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div 
                    className="career-icon" 
                    style={{ background: card.color }}
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                  >
                    {card.icon}
                  </motion.div>
                  <h3>{card.titleTa}</h3>
                  <h4>{card.title}</h4>
                  <ul>
                    {(Array.isArray(card.items) ? card.items : []).map((item, j) => (
                      <motion.li 
                        key={j}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: j * 0.1 }}
                        whileHover={{ x: 10 }}
                      >
                        <FaCheckCircle /> {item}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatedItem>
            ))}
          </AnimatedStagger>
        </div>
      </section>

      {/* How it Works */}
      <section className="section-pad">
        <div className="container text-center">
          <AnimatedSection variant="fadeInUp">
            <motion.div 
              className="tag"
              whileHover={{ scale: 1.1 }}
            >
              {c('process_tag','Process')}
            </motion.div>
            <h2 className="section-title">{c('process_title_ta','இது எப்படி வேலை செய்கிறது')}<br /><span>{c('process_title','How It Works')}</span></h2>
            <p className="section-subtitle">{c('process_desc','Simple 6-step process to get your career guidance')}</p>
          </AnimatedSection>

          <AnimatedStagger className="steps-grid">
            {steps.map((step, i) => (
              <AnimatedItem key={i}>
                <motion.div 
                  className="step-card"
                  whileHover={{ 
                    scale: 1.05, 
                    y: -10,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div 
                    className="step-num"
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {step.num}
                  </motion.div>
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                </motion.div>
              </AnimatedItem>
            ))}
          </AnimatedStagger>
        </div>
      </section>

      {/* CTA Banner */}
      <AnimatedSection variant="scaleIn">
        <section className="cta-banner">
          <AnimatedBackground variant="gradient" />
          <div className="container text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {c('cta_title','Ready to Shape Your Future?')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {c('cta_desc','Join thousands of Tamil Nadu students who have found their career path with Meipuratchi')}
            </motion.p>
            <motion.div 
              className="cta-actions"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(245, 166, 35, 0.4)' }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/registration" className="btn btn-accent">
                  <FaGraduationCap /> {c('cta_btn1',"Register Now — Free!")}
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/volunteer" className="btn btn-outline">
                  <FaHeart /> {c('cta_btn2','Volunteer With Us')}
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
}
