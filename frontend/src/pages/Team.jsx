import { useState, useEffect } from 'react';
import { FaPaintBrush, FaHashtag, FaHandsHelping, FaCode, FaLanguage, FaLightbulb, FaHeadset, FaUserShield, FaChartLine, FaCalendarAlt, FaUsers } from 'react-icons/fa';
import axios from 'axios';
import { useCMS } from '../hooks/useCMS';
import API_URL from '../config';
import './Team.css';

const departments = [
  {
    icon: <FaPaintBrush />,
    dept: 'Design Department',
    members: 'Sabareesh V & Jagadeeshwari K',
    role: 'Designers',
    color: '#192441',
    responsibilities: ['Craft visually appealing platform designs', 'Create intuitive user interfaces', 'Develop social media visuals', 'Maintain brand identity standards', 'Collaborate with technical team'],
  },
  {
    icon: <FaHashtag />,
    dept: 'Social Media',
    members: 'Dhanajayan M',
    role: 'Social Media Manager',
    color: '#1DA1F2',
    responsibilities: ['Manage all social media platforms', 'Create engagement campaigns', 'Schedule and publish content', 'Analyze performance metrics', 'Coordinate with design team'],
  },
  {
    icon: <FaHandsHelping />,
    dept: 'Counseling',
    members: 'Thamizharasi K, S. Jeevitha, Kanishka Manikandan',
    role: 'Student Advisors',
    color: '#28a745',
    responsibilities: ['Conduct counseling sessions', 'Provide career path guidance', 'Answer student queries', 'Paramedical / NEET / MBBS guidance'],
  },
  {
    icon: <FaCode />,
    dept: 'Technical',
    members: 'Kamesh Kumaran & Vinoth Kumar',
    role: 'Technicians',
    color: '#6f42c1',
    responsibilities: ['Maintain platform backend', 'Upload and manage course data', 'Resolve technical issues', 'Ensure system security', 'Optimize platform performance'],
  },
  {
    icon: <FaLanguage />,
    dept: 'Language & Content',
    members: 'Deepika K',
    role: 'Language Specialist',
    color: '#fd7e14',
    responsibilities: ['Proofread all written content', 'Ensure grammatical accuracy', 'Translate English-Tamil', 'Edit media scripts', 'Maintain cultural relevance'],
  },
  {
    icon: <FaLightbulb />,
    dept: 'Innovation & Research',
    members: 'Varsha S',
    role: 'Innovator / R&D Specialist',
    color: '#f5a623',
    responsibilities: ['Research new educational technologies', 'Develop innovative platform features', 'Analyze competitor strategies', 'Test new learning algorithms', 'Collaborate on prototype development'],
  },
  {
    icon: <FaHeadset />,
    dept: 'Student Support',
    members: 'Vijayalakshmi N',
    role: 'Student Support Specialist',
    color: '#17a2b8',
    responsibilities: ['Resolve technical/academic issues', 'Provide personalized support', 'Guide users through tutorials', 'Track recurring problems', 'Gather student feedback'],
  },
  {
    icon: <FaUserShield />,
    dept: 'User Experience',
    members: 'Abinaya M',
    role: 'Student Advocate',
    color: '#e83e8c',
    responsibilities: ['Represent student perspectives', 'Identify UX pain points', 'Test new features', 'Analyze user interactions', 'Conduct student surveys'],
  },
  {
    icon: <FaChartLine />,
    dept: 'Data Analysis',
    members: 'TBD',
    role: 'Statistician',
    color: '#20c997',
    responsibilities: ['Analyze user data metrics', 'Create performance reports', 'Identify behavioral trends', 'Maintain data hygiene', 'Develop analytics dashboards'],
  },
  {
    icon: <FaCalendarAlt />,
    dept: 'Coordination',
    members: 'TBD',
    role: 'Scheduler / Event Coordinator',
    color: '#6c757d',
    responsibilities: ['Manage organizational calendar', 'Coordinate events/webinars', 'Prepare meeting agendas', 'Track task deadlines', 'Facilitate cross-team coordination'],
  },
];

export default function Team() {
  const { c } = useCMS('team');
  const [liveMembers, setLiveMembers] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/api/admin/team/public`)
      .then(r => setLiveMembers(r.data.data))
      .catch(() => {}); // silently fall back
  }, []);

  // Group live members by department
  const liveByDept = liveMembers.reduce((acc, m) => {
    const d = m.department || 'General';
    if (!acc[d]) acc[d] = [];
    acc[d].push(m);
    return acc;
  }, {});
  return (
    <div className="team-page">
      <div className="team-hero">
        <div className="container">
          <h1>{c('hero_title','Team Responsibilities at Meipuratchi')}</h1>
          <p>{c('hero_desc','Recognizing the dedicated professionals guiding students to academic success')}</p>
        </div>
      </div>

      <div className="team-announcement">
        <div className="container text-center">
          <h2>{c('congrats_title','🏆 Congratulations to Our Team Members! 🏆')}</h2>
          <p>{c('congrats_desc',"We proudly recognize the individuals who have taken responsibility in their departments.")}</p>
        </div>
      </div>

      <div className="container team-content">
        <div className="team-grid">
          {departments.map(dep => (
            <div key={dep.dept} className="team-card card">
              <div className="team-icon" style={{ background: dep.color }}>
                {dep.icon}
              </div>
              <div className="dept-tag" style={{ background: dep.color }}>{dep.dept}</div>
              <h3>{dep.members}</h3>
              <p className="role">{dep.role}</p>
              <ul className="resp-list">
                {dep.responsibilities.map(r => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="collab-banner">
          <h3>👥 Interdepartmental Collaboration</h3>
          <p>Our {departments.length} specialized teams work in synergy to deliver comprehensive student support throughout the educational journey.</p>
        </div>

        {/* Live team members from DB */}
        {liveMembers.length > 0 && (
          <div className="live-team-section">
            <h2 className="section-title" style={{ marginTop: 48, marginBottom: 8 }}>
              Meet Our Team
            </h2>
            <p className="section-subtitle">Our dedicated team members across departments</p>
            {Object.keys(liveByDept).sort().map(dept => (
              <div key={dept} className="live-dept-group">
                <h3 className="live-dept-title">{dept}</h3>
                <div className="live-members-grid">
                  {liveByDept[dept].map(m => (
                    <div key={m._id} className="live-member-card card">
                      <div className="lm-avatar">{m.name[0].toUpperCase()}</div>
                      <h4>{m.name}</h4>
                      <span className="lm-dept">{m.department}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
