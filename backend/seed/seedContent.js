require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const SiteContent = require('../models/SiteContent');
const SiteTheme   = require('../models/SiteTheme');

const defaultPages = [
  {
    pageId: 'home', title: 'Home', slug: '/', order: 1,
    blocks: [
      // Hero
      { key: 'hero_badge',    type: 'text',     label: 'Hero Badge',         value: 'Free Career Guidance for TN Government School Students' },
      { key: 'hero_title',    type: 'text',     label: 'Hero Title (Tamil)', value: 'மெய் புரட்சி' },
      { key: 'hero_subtitle', type: 'text',     label: 'Hero Subtitle',      value: 'Student Career Guidance' },
      { key: 'hero_desc',     type: 'textarea', label: 'Hero Description',   value: 'Empowering 10th, 12th & dropout students across Tamil Nadu with free, accessible career counseling. Discover your potential and find the right path.' },
      { key: 'hero_btn1',     type: 'text',     label: 'Primary Button',     value: "Register Now — It's Free!" },
      { key: 'hero_btn2',     type: 'text',     label: 'Secondary Button',   value: 'Explore Opportunities' },
      // Stats
      { key: 'stat1_value',   type: 'text',     label: 'Stat 1 Value',       value: '500+' },
      { key: 'stat1_label',   type: 'text',     label: 'Stat 1 Label',       value: 'Students Registered' },
      { key: 'stat2_value',   type: 'text',     label: 'Stat 2 Value',       value: '200+' },
      { key: 'stat2_label',   type: 'text',     label: 'Stat 2 Label',       value: 'Students Counseled' },
      { key: 'stat3_value',   type: 'text',     label: 'Stat 3 Value',       value: '100%' },
      { key: 'stat3_label',   type: 'text',     label: 'Stat 3 Label',       value: 'Free Service' },
      // About
      { key: 'about_tag',     type: 'text',     label: 'About Tag',          value: 'About the Initiative' },
      { key: 'about_title_ta',type: 'text',     label: 'About Title Tamil',  value: 'முயற்சி பற்றி' },
      { key: 'about_title',   type: 'text',     label: 'About Title English',value: 'About Us' },
      { key: 'about_desc',    type: 'textarea', label: 'About Description',  value: 'We guide students from 10th, 12th, and even those who have failed in their board exams by showing them proper government opportunities and career paths in Arts & Science, Engineering, Medicine, Music, Direction, and more.' },
      { key: 'mission_label', type: 'text',     label: 'Mission Label',      value: 'Our Mission:' },
      { key: 'mission_text',  type: 'textarea', label: 'Mission Statement',  value: 'To provide free, accessible career guidance to every government school student in Tamil Nadu, helping them discover their potential and find the right path for their future.' },
      { key: 'about_checks',  type: 'list',     label: 'About Checklist',    listItems: ['Tamil Nadu Students', 'Government School Priority', 'Free of Cost', '6 Months Follow-up'] },
      // About cards
      { key: 'acard1_title',  type: 'text',     label: 'About Card 1 Title', value: 'Career Guidance' },
      { key: 'acard1_desc',   type: 'text',     label: 'About Card 1 Desc',  value: 'Personalized counseling sessions' },
      { key: 'acard2_title',  type: 'text',     label: 'About Card 2 Title', value: 'Volunteer Team' },
      { key: 'acard2_desc',   type: 'text',     label: 'About Card 2 Desc',  value: 'Dedicated professionals' },
      { key: 'acard3_title',  type: 'text',     label: 'About Card 3 Title', value: 'Success Stories' },
      { key: 'acard3_desc',   type: 'text',     label: 'About Card 3 Desc',  value: 'Students placed in top colleges' },
      // Career cards
      { key: 'careers_tag',      type: 'text',  label: 'Careers Section Tag',    value: 'Opportunities & Exams' },
      { key: 'careers_title_ta', type: 'text',  label: 'Careers Title Tamil',    value: 'வாய்ப்புகள் & தேர்வுகள்' },
      { key: 'careers_title',    type: 'text',  label: 'Careers Title English',  value: 'Career Paths' },
      { key: 'careers_desc',     type: 'textarea', label: 'Careers Description', value: 'Comprehensive information about various career paths and examination opportunities' },
      { key: 'card1_title',      type: 'text',  label: 'Card 1 Title',           value: 'Science Stream' },
      { key: 'card1_title_ta',   type: 'text',  label: 'Card 1 Title Tamil',     value: 'அறிவியல் துறை' },
      { key: 'card1_items',      type: 'list',  label: 'Card 1 Items',           listItems: ['NEET for Medical', 'JEE for Engineering', 'Research Careers'] },
      { key: 'card2_title',      type: 'text',  label: 'Card 2 Title',           value: 'Arts Stream' },
      { key: 'card2_title_ta',   type: 'text',  label: 'Card 2 Title Tamil',     value: 'கலைத் துறை' },
      { key: 'card2_items',      type: 'list',  label: 'Card 2 Items',           listItems: ['Performing Arts', 'Literature & Languages', 'Social Sciences'] },
      { key: 'card3_title',      type: 'text',  label: 'Card 3 Title',           value: 'Creative Fields' },
      { key: 'card3_title_ta',   type: 'text',  label: 'Card 3 Title Tamil',     value: 'படைப்புத் துறைகள்' },
      { key: 'card3_items',      type: 'list',  label: 'Card 3 Items',           listItems: ['Music & Composition', 'Film Direction', 'Fine Arts'] },
      // Process steps
      { key: 'process_tag',      type: 'text',  label: 'Process Tag',            value: 'Process' },
      { key: 'process_title_ta', type: 'text',  label: 'Process Title Tamil',    value: 'இது எப்படி வேலை செய்கிறது' },
      { key: 'process_title',    type: 'text',  label: 'Process Title English',  value: 'How It Works' },
      { key: 'process_desc',     type: 'text',  label: 'Process Description',    value: 'Simple 6-step process to get your career guidance' },
      { key: 'step1_title',      type: 'text',  label: 'Step 1 Title',           value: 'Register Online' },
      { key: 'step1_desc',       type: 'text',  label: 'Step 1 Description',     value: 'Fill a simple form on our website' },
      { key: 'step2_title',      type: 'text',  label: 'Step 2 Title',           value: 'Profile Verified' },
      { key: 'step2_desc',       type: 'text',  label: 'Step 2 Description',     value: 'Our team verifies within 48 hours' },
      { key: 'step3_title',      type: 'text',  label: 'Step 3 Title',           value: 'Get Confirmation' },
      { key: 'step3_desc',       type: 'text',  label: 'Step 3 Description',     value: 'Receive SMS/Email confirmation' },
      { key: 'step4_title',      type: 'text',  label: 'Step 4 Title',           value: 'Counseling Session' },
      { key: 'step4_desc',       type: 'text',  label: 'Step 4 Description',     value: 'One-on-one guidance with our counselor' },
      { key: 'step5_title',      type: 'text',  label: 'Step 5 Title',           value: 'Course Selection' },
      { key: 'step5_desc',       type: 'text',  label: 'Step 5 Description',     value: 'Choose your ideal career path' },
      { key: 'step6_title',      type: 'text',  label: 'Step 6 Title',           value: 'Follow-up Support' },
      { key: 'step6_desc',       type: 'text',  label: 'Step 6 Description',     value: '6 months of continued support' },
      // CTA
      { key: 'cta_title',        type: 'text',     label: 'CTA Title',           value: 'Ready to Shape Your Future?' },
      { key: 'cta_desc',         type: 'textarea', label: 'CTA Description',     value: 'Join thousands of Tamil Nadu students who have found their career path with Meipuratchi' },
      { key: 'cta_btn1',         type: 'text',     label: 'CTA Button 1',        value: 'Register Now — Free!' },
      { key: 'cta_btn2',         type: 'text',     label: 'CTA Button 2',        value: 'Volunteer With Us' },
    ],
  },
  {
    pageId: 'engineering', title: 'Engineering', slug: '/engineering', order: 2,
    blocks: [
      { key: 'hero_title',      type: 'text',     label: 'Page Title',           value: 'Tamil Nadu Engineering Counselling 2025' },
      { key: 'hero_quote',      type: 'text',     label: 'Hero Quote',           value: '"Design is the art of turning constraints into opportunities." – Aza Raskin' },
      { key: 'calc_btn',        type: 'text',     label: 'Calculator Button',    value: 'Calculate Cutoff' },
      { key: 'colleges_btn',    type: 'text',     label: 'Colleges Button',      value: 'Explore Colleges' },
      { key: 'announcement',    type: 'textarea', label: 'Announcement Banner',  value: 'Important: No tuition fee, no hostel fee, and no college bus fee for 7.5% students! (Some colleges may collect stationary fee)' },
      { key: 'cutoff_title',    type: 'text',     label: 'Cutoff Section Title', value: 'How to Find Cutoff Marks' },
      { key: 'cutoff_desc',     type: 'textarea', label: 'Cutoff Description',   value: 'Check the official cutoff marks for engineering colleges in Tamil Nadu through the TNEA portal. The cutoff marks are essential for determining your eligibility for various engineering courses.' },
      { key: 'cutoff_link',     type: 'link',     label: 'Cutoff Portal URL',    value: 'https://cutoff.tneaonline.org/' },
      { key: 'cutoff_link_text',type: 'text',     label: 'Cutoff Link Text',     value: 'Visit Official Cutoff Portal' },
      { key: 'cutoff_desc2',    type: 'textarea', label: 'Cutoff Extra Info',    value: 'On the cutoff portal, you can search by college, branch, or category to find the exact cutoff marks from previous years. This will help you estimate your chances of admission.' },
      { key: 'calc_title',      type: 'text',     label: 'Calculator Title',     value: 'Cutoff Mark Calculator' },
      { key: 'calc_desc',       type: 'textarea', label: 'Calculator Description',value: 'Calculate your engineering cutoff mark based on your 12th standard Physics, Chemistry, and Mathematics scores.' },
      { key: 'colleges_title',  type: 'text',     label: 'Colleges Section Title',value: 'Engineering Colleges in Tamil Nadu' },
      { key: 'docs_title',      type: 'text',     label: 'Documents Section Title',value: 'Important Documents' },
      { key: 'doc1_label',      type: 'text',     label: 'Document 1 Label',     value: 'All Colleges List' },
      { key: 'doc1_file',       type: 'link',     label: 'Document 1 File URL',  value: '/all_colleges.pdf' },
      { key: 'doc2_label',      type: 'text',     label: 'Document 2 Label',     value: 'Choice Order Guide' },
      { key: 'doc2_file',       type: 'link',     label: 'Document 2 File URL',  value: '/ChoiceOrder.pdf' },
      { key: 'doc3_label',      type: 'text',     label: 'Document 3 Label',     value: 'TNEA Tentative Schedule 2025' },
      { key: 'doc3_file',       type: 'link',     label: 'Document 3 File URL',  value: '/TNEA_Tent_Schedule_2025.pdf' },
      { key: 'doc4_label',      type: 'text',     label: 'Document 4 Label',     value: 'Top Colleges' },
      { key: 'doc4_file',       type: 'link',     label: 'Document 4 File URL',  value: '/top_colleges.pdf' },
    ],
  },
  {
    pageId: 'paramedical', title: 'Paramedical', slug: '/paramedical', order: 3,
    blocks: [
      { key: 'hero_title',      type: 'text',     label: 'Page Title',           value: 'Paramedical Degree Courses 2024-25' },
      { key: 'hero_desc',       type: 'textarea', label: 'Hero Description',     value: 'Government of Tamil Nadu — Comprehensive information about all paramedical degree courses offered in government and self-financing colleges' },
      { key: 'explore_btn',     type: 'text',     label: 'Explore Button Text',  value: 'Explore Courses' },
      { key: 'seat_title',      type: 'text',     label: 'Seat Info Title',      value: 'Seat Allocation Information' },
      { key: 'seat_info',       type: 'textarea', label: 'Seat Allocation Info', value: '65% of total seats in Non-Minority Institution and 50% of total seats in Minority Institution, subject to the Policy of the State Government and the court orders in this regard for each Para Medical Course in Self Financing institutions surrendered to Government Quota will be filled as per merit following the rule of reservation in force.' },
      { key: 'courses_title',   type: 'text',     label: 'Courses Table Title',  value: 'Available Courses' },
      { key: 'eligibility_title',type: 'text',    label: 'Eligibility Title',    value: 'Eligibility Criteria' },
      { key: 'elig_bpharm',     type: 'textarea', label: 'B.Pharm Eligibility',  value: 'English as one of the subjects and: Physics, Chemistry, Biology (mandatory) OR Physics, Chemistry, Botany and Zoology OR Physics, Chemistry, Mathematics' },
      { key: 'elig_others',     type: 'textarea', label: 'Other Courses Eligibility', value: 'English as one of the subjects and: Physics, Chemistry, Biology (mandatory) OR Physics, Chemistry, Botany and Zoology' },
      { key: 'fees_title',      type: 'text',     label: 'Fees Section Title',   value: 'Tuition Fees (Self-Financing Colleges)' },
      { key: 'fees_note',       type: 'textarea', label: 'Fees Note',            value: 'Note: The actual number of seats offered by the Self-Financing Institutions will be displayed at the time of Counselling.' },
      { key: 'docs_title',      type: 'text',     label: 'Documents Title',      value: 'Important Documents' },
      { key: 'doc1_label',      type: 'text',     label: 'Document 1 Label',     value: 'Explore Courses PDF' },
      { key: 'doc1_file',       type: 'link',     label: 'Document 1 URL',       value: '/explore.pdf' },
      { key: 'doc2_label',      type: 'text',     label: 'Document 2 Label',     value: 'Merit List' },
      { key: 'doc2_file',       type: 'link',     label: 'Document 2 URL',       value: '/meritlist.pdf' },
      { key: 'doc3_label',      type: 'text',     label: 'Document 3 Label',     value: 'Seat Matrix' },
      { key: 'doc3_file',       type: 'link',     label: 'Document 3 URL',       value: '/seat_matix.pdf' },
      { key: 'doc4_label',      type: 'text',     label: 'Document 4 Label',     value: 'Vacancy Details' },
      { key: 'doc4_file',       type: 'link',     label: 'Document 4 URL',       value: '/vacancy.pdf' },
    ],
  },
  {
    pageId: 'team', title: 'Our Team', slug: '/team', order: 4,
    blocks: [
      { key: 'hero_title',      type: 'text',     label: 'Page Title',           value: 'Team Responsibilities at Meipuratchi' },
      { key: 'hero_desc',       type: 'text',     label: 'Hero Subtitle',        value: 'Recognizing the dedicated professionals guiding students to academic success' },
      { key: 'congrats_title',  type: 'text',     label: 'Announcement Title',   value: '🏆 Congratulations to Our Team Members! 🏆' },
      { key: 'congrats_desc',   type: 'textarea', label: 'Announcement Text',    value: "We proudly recognize the individuals who have taken responsibility in their departments, strengthening Meipuratchi's mission of student guidance." },
      // Design dept
      { key: 'dept1_name',      type: 'text',     label: 'Dept 1 Name',          value: 'Design Department' },
      { key: 'dept1_members',   type: 'text',     label: 'Dept 1 Members',       value: 'Sabareesh V & Jagadeeshwari K' },
      { key: 'dept1_role',      type: 'text',     label: 'Dept 1 Role',          value: 'Designers' },
      { key: 'dept1_resp',      type: 'list',     label: 'Dept 1 Responsibilities', listItems: ['Craft visually appealing platform designs','Create intuitive user interfaces','Develop social media visuals','Maintain brand identity standards','Collaborate with technical team'] },
      // Social Media
      { key: 'dept2_name',      type: 'text',     label: 'Dept 2 Name',          value: 'Social Media' },
      { key: 'dept2_members',   type: 'text',     label: 'Dept 2 Members',       value: 'Dhanajayan M' },
      { key: 'dept2_role',      type: 'text',     label: 'Dept 2 Role',          value: 'Social Media Manager' },
      { key: 'dept2_resp',      type: 'list',     label: 'Dept 2 Responsibilities', listItems: ['Manage all social media platforms','Create engagement campaigns','Schedule and publish content','Analyze performance metrics','Coordinate with design team'] },
      // Counseling
      { key: 'dept3_name',      type: 'text',     label: 'Dept 3 Name',          value: 'Counseling' },
      { key: 'dept3_members',   type: 'text',     label: 'Dept 3 Members',       value: 'Thamizharasi K, S. Jeevitha, Kanishka Manikandan' },
      { key: 'dept3_role',      type: 'text',     label: 'Dept 3 Role',          value: 'Student Advisors' },
      { key: 'dept3_resp',      type: 'list',     label: 'Dept 3 Responsibilities', listItems: ['Conduct counseling sessions','Provide career path guidance','Answer student queries','Paramedical / NEET / MBBS guidance'] },
      // Technical
      { key: 'dept4_name',      type: 'text',     label: 'Dept 4 Name',          value: 'Technical' },
      { key: 'dept4_members',   type: 'text',     label: 'Dept 4 Members',       value: 'Kamesh Kumaran & Vinoth Kumar' },
      { key: 'dept4_role',      type: 'text',     label: 'Dept 4 Role',          value: 'Technicians' },
      { key: 'dept4_resp',      type: 'list',     label: 'Dept 4 Responsibilities', listItems: ['Maintain platform backend','Upload and manage course data','Resolve technical issues','Ensure system security','Optimize platform performance'] },
      // Language
      { key: 'dept5_name',      type: 'text',     label: 'Dept 5 Name',          value: 'Language & Content' },
      { key: 'dept5_members',   type: 'text',     label: 'Dept 5 Members',       value: 'Deepika K' },
      { key: 'dept5_role',      type: 'text',     label: 'Dept 5 Role',          value: 'Language Specialist' },
      { key: 'dept5_resp',      type: 'list',     label: 'Dept 5 Responsibilities', listItems: ['Proofread all written content','Ensure grammatical accuracy','Translate English-Tamil','Edit media scripts','Maintain cultural relevance'] },
      // Innovation
      { key: 'dept6_name',      type: 'text',     label: 'Dept 6 Name',          value: 'Innovation & Research' },
      { key: 'dept6_members',   type: 'text',     label: 'Dept 6 Members',       value: 'Varsha S' },
      { key: 'dept6_role',      type: 'text',     label: 'Dept 6 Role',          value: 'Innovator / R&D Specialist' },
      { key: 'dept6_resp',      type: 'list',     label: 'Dept 6 Responsibilities', listItems: ['Research new educational technologies','Develop innovative platform features','Analyze competitor strategies','Test new learning algorithms','Collaborate on prototype development'] },
      // Student Support
      { key: 'dept7_name',      type: 'text',     label: 'Dept 7 Name',          value: 'Student Support' },
      { key: 'dept7_members',   type: 'text',     label: 'Dept 7 Members',       value: 'Vijayalakshmi N' },
      { key: 'dept7_role',      type: 'text',     label: 'Dept 7 Role',          value: 'Student Support Specialist' },
      { key: 'dept7_resp',      type: 'list',     label: 'Dept 7 Responsibilities', listItems: ['Resolve technical/academic issues','Provide personalized support','Guide users through tutorials','Track recurring problems','Gather student feedback'] },
      // UX
      { key: 'dept8_name',      type: 'text',     label: 'Dept 8 Name',          value: 'User Experience' },
      { key: 'dept8_members',   type: 'text',     label: 'Dept 8 Members',       value: 'Abinaya M' },
      { key: 'dept8_role',      type: 'text',     label: 'Dept 8 Role',          value: 'Student Advocate' },
      { key: 'dept8_resp',      type: 'list',     label: 'Dept 8 Responsibilities', listItems: ['Represent student perspectives','Identify UX pain points','Test new features','Analyze user interactions','Conduct student surveys'] },
      // Collab banner
      { key: 'collab_title',    type: 'text',     label: 'Collaboration Banner Title', value: '👥 Interdepartmental Collaboration' },
      { key: 'collab_desc',     type: 'textarea', label: 'Collaboration Banner Text',  value: 'Our specialized teams work in synergy to deliver comprehensive student support throughout the educational journey.' },
    ],
  },
  {
    pageId: 'registration', title: 'Registration', slug: '/registration', order: 5,
    blocks: [
      { key: 'hero_title',      type: 'text',     label: 'Page Title',           value: 'Student Registration' },
      { key: 'hero_desc',       type: 'text',     label: 'Hero Subtitle',        value: 'Free Career Guidance for Tamil Nadu Government School Students' },
      { key: 'why_title',       type: 'text',     label: 'Why Register Title',   value: 'Why Register?' },
      { key: 'why_points',      type: 'list',     label: 'Why Register Points',  listItems: ['100% Free career counseling','One-on-one guidance session','Expert counselors for NEET, JEE, Engineering, Paramedical','6 months follow-up support','Priority for government school students'] },
      { key: 'eligibility_title',type: 'text',    label: 'Eligibility Title',    value: 'Eligibility' },
      { key: 'eligibility',     type: 'textarea', label: 'Eligibility Text',     value: 'Students from Tamil Nadu who have completed or are studying 10th / 12th standard, including those who have faced setbacks in board exams.' },
      { key: 'docs_required',   type: 'textarea', label: 'Required Documents',   value: 'ID Card, Aadhaar Card, 10th/12th Mark Sheet' },
      { key: 'submit_btn',      type: 'text',     label: 'Submit Button Text',   value: "Register & Go to My Portal" },
    ],
  },
  {
    pageId: 'contact', title: 'Contact', slug: '/contact', order: 6,
    blocks: [
      { key: 'hero_title',      type: 'text',     label: 'Page Title',           value: 'Contact Us' },
      { key: 'hero_desc',       type: 'text',     label: 'Hero Subtitle',        value: "We're here to help. Reach out to us anytime." },
      { key: 'contact_title',   type: 'text',     label: 'Contact Info Title',   value: 'Get In Touch' },
      { key: 'contact_desc',    type: 'textarea', label: 'Contact Info Desc',    value: "Have questions about career guidance, registration, or volunteering? We'd love to hear from you." },
      { key: 'phone_label',     type: 'text',     label: 'Phone Label',          value: 'Phone' },
      { key: 'phone',           type: 'text',     label: 'Phone Number',         value: '+91 72002 82924' },
      { key: 'whatsapp_label',  type: 'text',     label: 'WhatsApp Label',       value: 'WhatsApp Group' },
      { key: 'whatsapp_desc',   type: 'text',     label: 'WhatsApp Description', value: 'Join our community' },
      { key: 'whatsapp_link',   type: 'link',     label: 'WhatsApp Group Link',  value: 'https://chat.whatsapp.com/LM8lhAO5wReB5V4Yes1DXq' },
      { key: 'social_label',    type: 'text',     label: 'Social Media Label',   value: 'Follow Us' },
      { key: 'facebook',        type: 'link',     label: 'Facebook URL',         value: 'https://www.facebook.com/people/Mei-Puratchi/pfbid02CebTu4BGTjdLaneMEbRXa7QQwAxpHQ4tVukDr9XCAzokawjEC28d8YSeeang6JGFl/' },
      { key: 'instagram',       type: 'link',     label: 'Instagram URL',        value: 'https://www.instagram.com/meipuratchi/' },
      { key: 'twitter',         type: 'link',     label: 'Twitter/X URL',        value: 'https://x.com/meipuratchi' },
      { key: 'linkedin',        type: 'link',     label: 'LinkedIn URL',         value: 'https://www.linkedin.com/in/%E0%AE%AE%E0%AF%86%E0%AE%AF%E0%AF%8D%E0%AE%AA%E0%AF%81%E0%AE%B0%E0%AE%9F%E0%AF%8D%E0%AE%9A%E0%AE%BF/' },
      { key: 'form_title',      type: 'text',     label: 'Form Title',           value: 'Send Us a Message' },
    ],
  },
  {
    pageId: 'volunteer', title: 'Volunteer', slug: '/volunteer', order: 7,
    blocks: [
      { key: 'hero_title',      type: 'text',     label: 'Page Title',           value: 'Volunteer With Us' },
      { key: 'hero_desc',       type: 'text',     label: 'Hero Subtitle',        value: 'Join our team of dedicated volunteers and help shape the future of Tamil Nadu students' },
      { key: 'why_title',       type: 'text',     label: 'Why Volunteer Title',  value: 'Why Volunteer?' },
      { key: 'why1_title',      type: 'text',     label: 'Why Card 1 Title',     value: 'Make an Impact' },
      { key: 'why1_desc',       type: 'text',     label: 'Why Card 1 Desc',      value: 'Directly help students find their career path' },
      { key: 'why2_title',      type: 'text',     label: 'Why Card 2 Title',     value: 'Build Network' },
      { key: 'why2_desc',       type: 'text',     label: 'Why Card 2 Desc',      value: 'Connect with like-minded professionals' },
      { key: 'why3_title',      type: 'text',     label: 'Why Card 3 Title',     value: 'Get Certificate' },
      { key: 'why3_desc',       type: 'text',     label: 'Why Card 3 Desc',      value: 'Receive official volunteer recognition letter' },
      { key: 'why4_title',      type: 'text',     label: 'Why Card 4 Title',     value: 'Gain Experience' },
      { key: 'why4_desc',       type: 'text',     label: 'Why Card 4 Desc',      value: 'Develop leadership and mentoring skills' },
      { key: 'form_title',      type: 'text',     label: 'Form Title',           value: 'Volunteer Application' },
      { key: 'submit_btn',      type: 'text',     label: 'Submit Button',        value: '❤️ Apply to Volunteer' },
    ],
  },
];

const defaultThemes = [
  { name: 'Navy & Gold (Default)', isActive: true,  colors: { primary: '#192441', primaryLight: '#2a3a6b', accent: '#f5a623', accentRed: '#e74c3c', dark: '#212529', light: '#f8f9fa' } },
  { name: 'Green & Orange',        isActive: false, colors: { primary: '#1a5c38', primaryLight: '#2d7a50', accent: '#ff6b35', accentRed: '#e74c3c', dark: '#212529', light: '#f8f9fa' } },
  { name: 'Deep Purple & Yellow',  isActive: false, colors: { primary: '#4a148c', primaryLight: '#6a1fb5', accent: '#ffd600', accentRed: '#e74c3c', dark: '#212529', light: '#f8f9fa' } },
  { name: 'Dark Mode',             isActive: false, colors: { primary: '#1a1a2e', primaryLight: '#16213e', accent: '#e94560', accentRed: '#ff6b6b', dark: '#eee',    light: '#0f3460' } },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');
  // Force update all pages (replace blocks completely)
  for (const page of defaultPages) {
    await SiteContent.findOneAndUpdate(
      { pageId: page.pageId },
      { $set: { blocks: page.blocks, title: page.title, slug: page.slug, order: page.order } },
      { upsert: true, returnDocument: 'after' }
    );
    console.log(`✅ Page seeded: ${page.pageId} (${page.blocks.length} blocks)`);
  }

  for (const theme of defaultThemes) {
    await SiteTheme.findOneAndUpdate(
      { name: theme.name },
      { $setOnInsert: theme },
      { upsert: true, returnDocument: 'after' }
    );
    console.log(`✅ Theme seeded: ${theme.name}`);
  }

  console.log('\n🎉 Seed complete!');
  process.exit(0);
}

// Only run when executed directly
if (require.main === module) {
  seed().catch(e => { console.error(e); process.exit(1); });
}

// Export for auto-seed on startup
module.exports = { defaultPages, defaultThemes };

