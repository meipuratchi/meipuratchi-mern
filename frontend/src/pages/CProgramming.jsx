import {
  FaAndroid,
  FaBookOpen,
  FaCode,
  FaDesktop,
  FaExternalLinkAlt,
  FaLaptopCode,
  FaPlayCircle,
  FaRocket,
} from 'react-icons/fa';
import './CProgramming.css';

const disciplines = [
  { name: 'CSE & IT', text: 'Build a strong base in algorithms, data structures, operating systems, and software development.' },
  { name: 'AI, ML & AI-DS', text: 'Understand the memory, performance, and mathematical foundations behind intelligent systems.' },
  { name: 'ECE', text: 'Program microcontrollers, embedded devices, sensors, and low-level hardware with confidence.' },
];

const topics = ['Variables and data types', 'Conditions and loops', 'Functions and modular thinking', 'Arrays, strings, and pointers', 'Structures and basic memory management'];

export default function CProgramming() {
  return (
    <div className="c-page">
      <header className="c-hero">
        <div className="container c-hero-content">
          <div className="c-hero-mark"><FaCode /></div>
          <p className="c-eyebrow">Engineering student onboarding</p>
          <h1>Start with C. Build the way you think.</h1>
          <p className="c-hero-copy">A practical first step for CSE, IT, AI/ML, AI&amp;DS, and ECE students before college begins.</p>
          <a href="#setup" className="btn btn-accent"><FaRocket /> Begin your setup</a>
        </div>
      </header>

      <main className="container c-content">
        <section className="c-intro c-section">
          <div>
            <p className="c-kicker">Your first engineering advantage</p>
            <h2>Why learn C before college?</h2>
          </div>
          <p>C is small enough to learn carefully and powerful enough to show what a computer is really doing. It teaches you to break a problem into steps, manage data, read errors, and write code that runs efficiently. Those habits make later languages and college subjects much easier to understand.</p>
        </section>

        <section className="c-section">
          <div className="c-section-heading">
            <div><p className="c-kicker">One foundation, many directions</p><h2>Where C helps you</h2></div>
            <FaLaptopCode className="c-heading-icon" />
          </div>
          <div className="discipline-grid">
            {disciplines.map(item => <article className="discipline-card" key={item.name}><h3>{item.name}</h3><p>{item.text}</p></article>)}
          </div>
        </section>

        <section id="setup" className="c-section">
          <div className="c-section-heading">
            <div><p className="c-kicker">Get ready to practise</p><h2>Install a C compiler</h2></div>
            <FaDesktop className="c-heading-icon" />
          </div>
          <div className="setup-grid">
            <article className="setup-card">
              <div className="setup-icon"><FaAndroid /></div>
              <h3>Android phone</h3>
              <ol><li>Open the Google Play link below.</li><li>Install <strong>C Programming - Compiler</strong> by Kvassyu.</li><li>Create a file, type a short program, and tap Run.</li></ol>
              <a className="resource-link" href="https://play.google.com/store/apps/details?id=com.kvassyu.coding2.c" target="_blank" rel="noreferrer">Open on Google Play <FaExternalLinkAlt /></a>
            </article>
            <article className="setup-card">
              <div className="setup-icon"><FaDesktop /></div>
              <h3>Windows or desktop</h3>
              <ol><li>Open SourceForge and choose a trusted C compiler project.</li><li>Download the installer for your operating system.</li><li>Install it, then compile and run a small program.</li></ol>
              <a className="resource-link" href="https://sourceforge.net/directory/?q=c%20compiler" target="_blank" rel="noreferrer">Browse SourceForge <FaExternalLinkAlt /></a>
            </article>
          </div>
          <p className="setup-note">Only download software from the official platform or project page, and check the publisher before installing.</p>
        </section>

        <section className="c-section">
          <div className="c-section-heading"><div><p className="c-kicker">A simple first week</p><h2>Learn in this order</h2></div><FaBookOpen className="c-heading-icon" /></div>
          <div className="learning-layout">
            <div className="topic-list">{topics.map((topic, index) => <div className="topic-item" key={topic}><span>{String(index + 1).padStart(2, '0')}</span><strong>{topic}</strong></div>)}</div>
            <div className="resource-panel">
              <h3>Use these guided resources</h3>
              <a className="resource-card" href="https://youtu.be/fmSnLiAv-zc?si=EL6MGvKKit6IH6Ew" target="_blank" rel="noreferrer"><FaPlayCircle /><span><strong>Watch the recommended video</strong><small>See the concepts explained before you practise.</small></span><FaExternalLinkAlt /></a>
              <a className="resource-card" href="https://www.w3schools.com/c/" target="_blank" rel="noreferrer"><FaBookOpen /><span><strong>Practise with W3Schools C</strong><small>Read a topic, run examples, and change the code yourself.</small></span><FaExternalLinkAlt /></a>
            </div>
          </div>
        </section>

        <section className="c-next-step">
          <span><FaCode /></span><div><p className="c-kicker">Your first challenge</p><h2>Write, run, and explain one small program.</h2><p>Start with a program that prints your name, then change it to print your intended branch and a goal for your first semester.</p></div>
        </section>
      </main>
    </div>
  );
}