const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const { logActivity } = require('../middleware/auth');

const userAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'No token provided' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

const signToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role, name: user.name, teamRole: user.teamRole || null },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, role, school, district,
            standard, stream, careerInterest, skills, department } = req.body;

    const exists = await User.findOne({ $or: [{ email }, { phone }] });
    if (exists) return res.status(400).json({ success: false, message: 'Email or phone already registered' });

    const user = new User({
      name, email, phone, password,
      role: role || 'student',
      school, district, standard, stream, careerInterest, skills, department,
      messages: [{
        from: 'admin',
        text: `Welcome ${name}! Your request has been submitted successfully. Our team will review it within 48 hours.`,
      }],
    });
    await user.save();

    const token = signToken(user);
    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, status: user.status },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// POST /api/auth/login  (email or phone + password)
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier = email or phone
    const user = await User.findOne({
      $or: [{ email: identifier?.toLowerCase() }, { phone: identifier }]
    });
    if (!user) return res.status(400).json({ success: false, message: 'User not found' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ success: false, message: 'Incorrect password' });

    // Mark unread messages as read on login
    user.messages.forEach(m => { m.read = true; });
    await user.save();

    const token = signToken(user);
    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, status: user.status, teamRole: user.teamRole },
    });

    // Log login for team members
    if (user.role === 'team') {
      logActivity(user._id.toString(), 'login', null, null, 'Logged in to team dashboard');
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/auth/me  — get own profile + messages + status
router.get('/me', userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/me/message  — user sends a message to admin
router.post('/me/message', userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.messages.push({ from: user.name, text: req.body.text });
    await user.save();
    res.json({ success: true, message: 'Message sent' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
