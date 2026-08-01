const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const { Career, CareerApp, CareerUser } = require('../models/Career');
const { adminAuth } = require('../middleware/auth');

// ── Career portal JWT auth ─────────────────────────────────
const careerAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'No token provided' });
  try {
    req.careerUser = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

const signToken = (user) =>
  jwt.sign({ id: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '30d' });

// ══════════════════════════════════════════════════════════
//  PUBLIC — Jobs
// ══════════════════════════════════════════════════════════

// GET /api/careers/jobs  — list active jobs
router.get('/jobs', async (req, res) => {
  try {
    const { department, workingMode, roleType } = req.query;
    const filter = { isActive: true };
    if (department)  filter.department  = department;
    if (workingMode) filter.workingMode = workingMode;
    if (roleType)    filter.roleType    = roleType;
    const jobs = await Career.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/careers/jobs/:id  — single job detail
router.get('/jobs/:id', async (req, res) => {
  try {
    const job = await Career.findById(req.params.id);
    if (!job || !job.isActive)
      return res.status(404).json({ success: false, message: 'Job not found' });
    res.json({ success: true, data: job });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ══════════════════════════════════════════════════════════
//  CAREER USER AUTH
// ══════════════════════════════════════════════════════════

// POST /api/careers/auth/register
router.post('/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password, collegeOrOrg, degree, skills, resumeLink, linkedinUrl } = req.body;
    if (!name || !email || !phone || !password)
      return res.status(400).json({ success: false, message: 'Name, email, phone and password are required' });
    const exists = await CareerUser.findOne({ email: email.toLowerCase() });
    if (exists)
      return res.status(400).json({ success: false, message: 'Email already registered' });
    const user = await CareerUser.create({ name, email, phone, password, collegeOrOrg, degree, skills, resumeLink, linkedinUrl });
    const token = signToken(user);
    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// POST /api/careers/auth/login
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await CareerUser.findOne({ email: email?.toLowerCase() });
    if (!user) return res.status(400).json({ success: false, message: 'User not found' });
    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ success: false, message: 'Incorrect password' });
    const token = signToken(user);
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/careers/auth/me
router.get('/auth/me', careerAuth, async (req, res) => {
  try {
    const user = await CareerUser.findById(req.careerUser.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/careers/auth/me  — update profile
router.patch('/auth/me', careerAuth, async (req, res) => {
  try {
    const allowed = ['name', 'phone', 'collegeOrOrg', 'degree', 'skills', 'resumeLink', 'linkedinUrl'];
    const update = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) update[k] = req.body[k]; });
    const user = await CareerUser.findByIdAndUpdate(req.careerUser.id, update, { new: true }).select('-password');
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ══════════════════════════════════════════════════════════
//  APPLICATIONS (applicant-side)
// ══════════════════════════════════════════════════════════

// POST /api/careers/apply  — submit application
router.post('/apply', careerAuth, async (req, res) => {
  try {
    const { jobId, coverLetter, resumeLink, portfolioLink, linkedinUrl,
            skills, collegeOrOrg, degree, yearOfStudy } = req.body;
    if (!jobId) return res.status(400).json({ success: false, message: 'jobId required' });

    const job = await Career.findById(jobId);
    if (!job || !job.isActive)
      return res.status(404).json({ success: false, message: 'Job not found or closed' });

    // Prevent duplicate applications
    const existing = await CareerApp.findOne({ jobId, email: req.careerUser.email });
    if (existing)
      return res.status(400).json({ success: false, message: 'You have already applied for this position' });

    const user = await CareerUser.findById(req.careerUser.id).select('-password');
    const app = await CareerApp.create({
      jobId,
      jobTitle: job.title,
      applicantId: req.careerUser.id,
      name:  user.name,
      email: user.email,
      phone: user.phone,
      coverLetter,
      resumeLink:    resumeLink    || user.resumeLink,
      portfolioLink,
      linkedinUrl:   linkedinUrl   || user.linkedinUrl,
      skills:        skills        || user.skills,
      collegeOrOrg:  collegeOrOrg  || user.collegeOrOrg,
      degree:        degree        || user.degree,
      yearOfStudy,
      messages: [{
        from: 'admin',
        text: `Thank you ${user.name}! Your application for "${job.title}" has been received. We'll review it and get back to you within 5–7 working days.`,
      }],
    });
    res.status(201).json({ success: true, message: 'Application submitted!', data: { id: app._id } });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET /api/careers/my-applications  — applicant's own applications
router.get('/my-applications', careerAuth, async (req, res) => {
  try {
    const apps = await CareerApp.find({ applicantId: req.careerUser.id })
      .select('-adminNotes')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: apps });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/careers/my-applications/:id  — single application detail
router.get('/my-applications/:id', careerAuth, async (req, res) => {
  try {
    const app = await CareerApp.findOne({ _id: req.params.id, applicantId: req.careerUser.id })
      .select('-adminNotes');
    if (!app) return res.status(404).json({ success: false, message: 'Not found' });
    // mark admin messages read
    app.messages.forEach(m => { if (m.from === 'admin') m.read = true; });
    await app.save();
    res.json({ success: true, data: app });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/careers/my-applications/:id/message  — applicant sends message
router.post('/my-applications/:id/message', careerAuth, async (req, res) => {
  try {
    const app = await CareerApp.findOne({ _id: req.params.id, applicantId: req.careerUser.id });
    if (!app) return res.status(404).json({ success: false, message: 'Not found' });
    app.messages.push({ from: app.name, text: req.body.text });
    await app.save();
    res.json({ success: true, message: 'Sent' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ══════════════════════════════════════════════════════════
//  ADMIN — Jobs CRUD
// ══════════════════════════════════════════════════════════

// GET /api/careers/admin/jobs
router.get('/admin/jobs', adminAuth, async (req, res) => {
  try {
    const jobs = await Career.find().sort({ createdAt: -1 });
    res.json({ success: true, data: jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/careers/admin/jobs
router.post('/admin/jobs', adminAuth, async (req, res) => {
  try {
    const { title, roleType, department, workingMode, description,
            eligibility, techStack, stipend, openings, deadline } = req.body;
    if (!title || !description)
      return res.status(400).json({ success: false, message: 'title and description are required' });
    const job = await Career.create({
      title, roleType, department, workingMode, description,
      eligibility, techStack, stipend, openings, deadline,
    });
    res.status(201).json({ success: true, data: job });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/careers/admin/jobs/:id
router.put('/admin/jobs/:id', adminAuth, async (req, res) => {
  try {
    const job = await Career.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.json({ success: true, data: job });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/careers/admin/jobs/:id
router.delete('/admin/jobs/:id', adminAuth, async (req, res) => {
  try {
    await Career.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Job deleted' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PATCH /api/careers/admin/jobs/:id/toggle
router.patch('/admin/jobs/:id/toggle', adminAuth, async (req, res) => {
  try {
    const job = await Career.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Not found' });
    job.isActive = !job.isActive;
    job.updatedAt = new Date();
    await job.save();
    res.json({ success: true, data: { isActive: job.isActive } });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ══════════════════════════════════════════════════════════
//  ADMIN — Applications
// ══════════════════════════════════════════════════════════

// GET /api/careers/admin/applications
router.get('/admin/applications', adminAuth, async (req, res) => {
  try {
    const { jobId, status, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (jobId)  filter.jobId  = jobId;
    if (status) filter.status = status;
    if (search) filter.$or = [
      { name:  { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
    const total = await CareerApp.countDocuments(filter);
    const data  = await CareerApp.find(filter)
      .sort({ createdAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit);
    res.json({ success: true, data, total, page: +page, pages: Math.ceil(total / +limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/careers/admin/applications/:id
router.get('/admin/applications/:id', adminAuth, async (req, res) => {
  try {
    const app = await CareerApp.findById(req.params.id);
    if (!app) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: app });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/careers/admin/applications/:id/status
router.patch('/admin/applications/:id/status', adminAuth, async (req, res) => {
  try {
    const { status, message, adminNotes } = req.body;
    const app = await CareerApp.findById(req.params.id);
    if (!app) return res.status(404).json({ success: false, message: 'Not found' });

    const autoMsg = {
      under_review: 'Your application is now under review. We\'ll get back to you shortly.',
      shortlisted:  '🎉 Great news! You have been shortlisted for the next round.',
      selected:     '✅ Congratulations! You have been selected. Please check your messages for next steps.',
      rejected:     'Thank you for applying. After careful review, we regret that we cannot move forward with your application at this time.',
      offer_sent:   '📄 Your offer letter has been sent. Please review and confirm.',
      completed:    '🏆 Congratulations on completing your internship at Meipuratchi! Your internship completion letter is ready.',
    };

    if (status) app.status = status;
    if (adminNotes !== undefined) app.adminNotes = adminNotes;
    app.messages.push({ from: 'admin', text: message || autoMsg[status] || `Status updated to: ${status}`, read: false });
    await app.save();
    res.json({ success: true, data: app });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// POST /api/careers/admin/applications/:id/message
router.post('/admin/applications/:id/message', adminAuth, async (req, res) => {
  try {
    const { text } = req.body;
    const app = await CareerApp.findById(req.params.id);
    if (!app) return res.status(404).json({ success: false, message: 'Not found' });
    app.messages.push({ from: 'admin', text, read: false });
    await app.save();
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/careers/admin/applications/:id
router.delete('/admin/applications/:id', adminAuth, async (req, res) => {
  try {
    await CareerApp.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Application deleted' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PATCH /api/careers/admin/applications/:id/letter-data
// Save letter data (start date, end date, etc.) before generating
router.patch('/admin/applications/:id/letter-data', adminAuth, async (req, res) => {
  try {
    const { internshipStartDate, internshipEndDate, internshipDuration, mentorName } = req.body;
    const app = await CareerApp.findByIdAndUpdate(
      req.params.id,
      { 'letterData.internshipStartDate': internshipStartDate,
        'letterData.internshipEndDate':   internshipEndDate,
        'letterData.internshipDuration':  internshipDuration,
        'letterData.mentorName':          mentorName,
      },
      { new: true }
    );
    res.json({ success: true, data: app });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PATCH /api/careers/admin/applications/:id/mark-offer-sent
router.patch('/admin/applications/:id/mark-offer-sent', adminAuth, async (req, res) => {
  try {
    const app = await CareerApp.findByIdAndUpdate(
      req.params.id,
      { offerLetterGeneratedAt: new Date(), status: 'offer_sent' },
      { new: true }
    );
    res.json({ success: true, data: app });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PATCH /api/careers/admin/applications/:id/mark-completed
router.patch('/admin/applications/:id/mark-completed', adminAuth, async (req, res) => {
  try {
    const app = await CareerApp.findByIdAndUpdate(
      req.params.id,
      { completionLetterGeneratedAt: new Date(), status: 'completed' },
      { new: true }
    );
    res.json({ success: true, data: app });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET /api/careers/admin/stats
router.get('/admin/stats', adminAuth, async (req, res) => {
  try {
    const [totalJobs, activeJobs, totalApps, applied, shortlisted, selected, completed] = await Promise.all([
      Career.countDocuments(),
      Career.countDocuments({ isActive: true }),
      CareerApp.countDocuments(),
      CareerApp.countDocuments({ status: 'applied' }),
      CareerApp.countDocuments({ status: 'shortlisted' }),
      CareerApp.countDocuments({ status: 'selected' }),
      CareerApp.countDocuments({ status: 'completed' }),
    ]);
    res.json({ success: true, data: { totalJobs, activeJobs, totalApps, applied, shortlisted, selected, completed } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
