const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const OTP     = require('../models/OTP');
const { logActivity } = require('../middleware/auth');
const {
  sendOTPEmail,
  sendWelcomeEmail,
  sendMessageNotification,
} = require('../utils/emailService');

// ── Test email endpoint (hit this from browser to verify SMTP works) ──
// GET /api/auth/test-email?to=your@email.com
router.get('/test-email', async (req, res) => {
  const to = req.query.to || process.env.EMAIL_USER;
  console.log(`[TestEmail] Sending test to: ${to}`);
  const result = await sendOTPEmail(to, '123456', 'login');
  console.log(`[TestEmail] Result:`, result);
  res.json({
    emailUser: process.env.EMAIL_USER || 'NOT SET',
    emailPassSet: !!process.env.EMAIL_PASS,
    to,
    result,
  });
});

// ── Helpers ───────────────────────────────────────────────
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

// Token valid for 7 days
const signToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role, name: user.name, teamRole: user.teamRole || null },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

function generateOTP() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// ══════════════════════════════════════════════════════════
//  POST /api/auth/send-otp
//  Send OTP to email for login or register
// ══════════════════════════════════════════════════════════
router.post('/send-otp', async (req, res) => {
  try {
    const { identifier, purpose = 'login' } = req.body;
    if (!identifier) return res.status(400).json({ success: false, message: 'Email or phone required' });

    const normalised = identifier.toLowerCase().trim();

    // For login: user must exist
    if (purpose === 'login') {
      const user = await User.findOne({
        $or: [{ email: normalised }, { phone: identifier.trim() }]
      });
      if (!user) return res.status(404).json({ success: false, message: 'No account found with this email/phone' });
    }

    // Delete any existing OTP for this identifier+purpose
    await OTP.deleteMany({ identifier: normalised, purpose });

    const code = generateOTP();
    await OTP.create({ identifier: normalised, code, purpose });

    // Send email if identifier looks like an email
    if (normalised.includes('@')) {
      await sendOTPEmail(normalised, code, purpose);
    }
    // Phone OTP: in production integrate SMS gateway here
    // For now we log it (dev mode)
    if (!normalised.includes('@')) {
      console.log(`[OTP] Phone OTP for ${identifier}: ${code}`);
    }

    res.json({ success: true, message: `OTP sent to ${normalised.includes('@') ? 'email' : 'phone'}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ══════════════════════════════════════════════════════════
//  POST /api/auth/verify-otp
//  Verify OTP (standalone — for email verification after register)
// ══════════════════════════════════════════════════════════
router.post('/verify-otp', userAuth, async (req, res) => {
  try {
    const { code } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const otp = await OTP.findOne({
      identifier: user.email,
      purpose: 'verify',
      used: false,
    });

    if (!otp) return res.status(400).json({ success: false, message: 'OTP expired or not found. Request a new one.' });

    otp.attempts += 1;
    if (otp.attempts > 5) {
      await otp.deleteOne();
      return res.status(429).json({ success: false, message: 'Too many attempts. Request a new OTP.' });
    }

    if (otp.code !== code) {
      await otp.save();
      return res.status(400).json({ success: false, message: `Incorrect OTP. ${5 - otp.attempts} attempts remaining.` });
    }

    otp.used = true;
    await otp.save();
    user.emailVerified = true;
    await user.save();

    res.json({ success: true, message: 'Email verified successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ══════════════════════════════════════════════════════════
//  POST /api/auth/register
//  Step 1: create account → send OTP → return pending token
// ══════════════════════════════════════════════════════════
router.post('/register', async (req, res) => {
  try {
    const {
      name, email, phone, password, role, school, district,
      standard, stream, careerInterest, skills, department,
      dateOfBirth, qualification, proofFileUrl,
    } = req.body;

    const exists = await User.findOne({ $or: [{ email: email?.toLowerCase() }, { phone }] });
    if (exists) return res.status(400).json({ success: false, message: 'Email or phone already registered' });

    const user = new User({
      name, email, phone, password,
      role: role || 'student',
      school, district, standard, stream, careerInterest, skills, department,
      dateOfBirth, qualification, proofFileUrl,
      emailVerified: false,
      messages: [{
        from: 'admin',
        text: `வணக்கம் ${name}! 🎉 Welcome to Meipuratchi! Your registration is received. Our team will review your details within 48 hours and contact you soon. — மெய் புரட்சி குழு`,
      }],
    });
    await user.save();

    // Send welcome email (non-blocking)
    sendWelcomeEmail(email, name, role || 'student').catch(console.error);

    // Generate & send OTP for email verification
    const code = generateOTP();
    await OTP.deleteMany({ identifier: email.toLowerCase(), purpose: 'verify' });
    await OTP.create({ identifier: email.toLowerCase(), code, purpose: 'verify' });
    sendOTPEmail(email, code, 'register').catch(console.error);

    const token = signToken(user);
    res.status(201).json({
      success: true,
      message: 'Registration successful! Check your email for the verification OTP.',
      token,
      requiresOTP: true,
      user: {
        id: user._id, name: user.name, email: user.email,
        role: user.role, status: user.status, emailVerified: false,
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ══════════════════════════════════════════════════════════
//  POST /api/auth/login
//  Verify credentials → return JWT directly (no OTP step)
// ══════════════════════════════════════════════════════════
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const user = await User.findOne({
      $or: [{ email: identifier?.toLowerCase() }, { phone: identifier }]
    });
    if (!user) return res.status(400).json({ success: false, message: 'User not found' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ success: false, message: 'Incorrect password' });

    // Mark messages as read
    user.messages.forEach(m => { m.read = true; });
    await user.save();

    if (user.role === 'team') {
      logActivity(user._id.toString(), 'login', null, null, 'Logged in');
    }

    const token = signToken(user);
    res.json({
      success: true,
      token,
      user: {
        id: user._id, name: user.name, email: user.email,
        phone: user.phone, role: user.role, status: user.status,
        teamRole: user.teamRole, emailVerified: user.emailVerified,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ══════════════════════════════════════════════════════════
//  GET /api/auth/me
// ══════════════════════════════════════════════════════════
router.get('/me', userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ══════════════════════════════════════════════════════════
//  POST /api/auth/me/message  — user sends message to admin
// ══════════════════════════════════════════════════════════
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

// ══════════════════════════════════════════════════════════
//  DELETE /api/auth/me
// ══════════════════════════════════════════════════════════
router.delete('/me', userAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ══════════════════════════════════════════════════════════
//  PATCH /api/auth/me/password
// ══════════════════════════════════════════════════════════
router.patch('/me/password', userAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ success: false, message: 'Current and new password required' });
    if (newPassword.length < 6)
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const match = await user.comparePassword(currentPassword);
    if (!match) return res.status(400).json({ success: false, message: 'Current password is incorrect' });

    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ══════════════════════════════════════════════════════════
//  POST /api/auth/forgot-password
//  Send OTP to email for password reset
// ══════════════════════════════════════════════════════════
router.post('/forgot-password', async (req, res) => {
  try {
    const { identifier } = req.body;
    if (!identifier) return res.status(400).json({ success: false, message: 'Email or phone required' });

    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase().trim() }, { phone: identifier.trim() }]
    });
    // Always respond success to prevent user enumeration
    if (!user) return res.json({ success: true, message: 'If an account exists, an OTP has been sent.' });

    const code = generateOTP();
    await OTP.deleteMany({ identifier: user.email.toLowerCase(), purpose: 'reset' });
    await OTP.create({ identifier: user.email.toLowerCase(), code, purpose: 'reset' });

    sendOTPEmail(user.email, code, 'reset').catch(console.error);

    res.json({
      success: true,
      message: 'OTP sent to your registered email.',
      maskedEmail: user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3'),
      userId: user._id,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ══════════════════════════════════════════════════════════
//  POST /api/auth/reset-password
//  Verify OTP + set new password
// ══════════════════════════════════════════════════════════
router.post('/reset-password', async (req, res) => {
  try {
    const { userId, code, newPassword } = req.body;
    if (!userId || !code || !newPassword)
      return res.status(400).json({ success: false, message: 'userId, code and newPassword required' });
    if (newPassword.length < 6)
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const otp = await OTP.findOne({
      identifier: user.email.toLowerCase(),
      purpose: 'reset',
      used: false,
    });

    if (!otp) return res.status(400).json({ success: false, message: 'OTP expired. Request a new one.' });

    otp.attempts += 1;
    if (otp.attempts > 5) {
      await otp.deleteOne();
      return res.status(429).json({ success: false, message: 'Too many attempts. Request a new OTP.' });
    }

    if (otp.code !== code) {
      await otp.save();
      return res.status(400).json({ success: false, message: `Incorrect OTP. ${5 - otp.attempts} attempts remaining.` });
    }

    otp.used = true;
    await otp.save();

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password reset successfully! You can now login.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
