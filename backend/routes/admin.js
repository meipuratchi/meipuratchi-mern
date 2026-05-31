const express = require('express');
const router  = express.Router();
const User    = require('../models/User');
const Contact = require('../models/Contact');
const { adminAuth, teamAuth, manageAuth, logActivity } = require('../middleware/auth');
const {
  sendMessageNotification,
  sendStatusUpdateEmail,
  sendBroadcastEmail,
} = require('../utils/emailService');

// ── Stats ──────────────────────────────────────────────────
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const Volunteer    = require('../models/Volunteer');
    const Registration = require('../models/Registration');

    const [students, volunteers, team,
           submitted, validating, verified, counseled,
           totalContact, unreplied,
           totalVols, pendingVols, approvedVols,
           totalRegs, pendingRegs] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'volunteer' }),
      User.countDocuments({ role: 'team' }),
      User.countDocuments({ status: 'submitted' }),
      User.countDocuments({ status: 'validating' }),
      User.countDocuments({ status: 'verified' }),
      User.countDocuments({ status: 'counseled' }),
      Contact.countDocuments({ type: 'contact' }),
      Contact.countDocuments({ type: 'contact', replied: false }),
      Volunteer.countDocuments({}),
      Volunteer.countDocuments({ status: 'pending' }),
      Volunteer.countDocuments({ status: 'approved' }),
      Registration.countDocuments({}),
      Registration.countDocuments({ status: 'pending' }),
    ]);
    res.json({
      success: true,
      data: {
        users:         { students, volunteers, team, total: students + volunteers + team },
        pipeline:      { submitted, validating, verified, counseled },
        contacts:      { total: totalContact, unreplied },
        volunteerApps: { total: totalVols, pending: pendingVols, approved: approvedVols },
        registrations: { total: totalRegs, pending: pendingRegs },
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Users list (admin + any team) ─────────────────────────
router.get('/users', teamAuth, async (req, res) => {
  try {
    const { role, status, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (role)   filter.role   = role;
    if (status) filter.status = status;
    if (search) filter.$or = [
      { name:  { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { school:{ $regex: search, $options: 'i' } },
    ];
    const total = await User.countDocuments(filter);
    const data  = await User.find(filter)
      .select('-password -activityLog')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, data, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Get single user (admin + any team, logs 'viewed') ─────
router.get('/users/:id', teamAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -activityLog');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    // Log view activity for team members
    if (req.user?.id) {
      logActivity(req.user.id, 'viewed_user', user._id.toString(), user.name, `Viewed profile`);
    }
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Update status (manage role only) ──────────────────────
router.patch('/users/:id/status', manageAuth, async (req, res) => {
  try {
    const { status, message, adminNotes } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const autoMsg = {
      submitted:  'Your request has been submitted and is in our queue.',
      validating: 'We are currently validating your details. This usually takes 24-48 hours.',
      verified:   '✅ Your profile has been verified! Our counselor will contact you soon.',
      counseled:  '🎉 Congratulations! Your counseling session is complete. Best wishes!',
      approved:   '✅ Your volunteer application has been approved! Welcome to the team.',
      rejected:   'We regret to inform you that your application could not be processed.',
    };

    const oldStatus = user.status;
    if (status) {
      user.status = status;
      user.messages.push({ from: 'admin', text: message || autoMsg[status] || `Status updated to: ${status}`, read: false });
    }
    if (adminNotes !== undefined) user.adminNotes = adminNotes;
    await user.save();

    // Log activity
    if (req.user?.id) {
      logActivity(req.user.id, 'status_update', user._id.toString(), user.name, `${oldStatus} → ${status}`);
    }

    // Send email notification (non-blocking)
    if (status && user.email) {
      sendStatusUpdateEmail(
        user.email,
        user.name,
        status,
        message || autoMsg[status] || `Your status has been updated to: ${status}`
      ).catch(console.error);
    }

    res.json({ success: true, data: { status: user.status, messages: user.messages } });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ── Send message (manage role only) ───────────────────────
router.post('/users/:id/message', manageAuth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, message: 'Message text required' });
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.messages.push({ from: 'admin', text, read: false });
    await user.save();

    if (req.user?.id) {
      logActivity(req.user.id, 'message_sent', user._id.toString(), user.name, text.slice(0, 60));
    }

    // Send email notification (non-blocking)
    if (user.email) {
      sendMessageNotification(user.email, user.name, text).catch(console.error);
    }

    res.json({ success: true, message: 'Message sent', data: user.messages });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ── Promote user role (admin only) ────────────────────────
router.patch('/users/:id/role', adminAuth, async (req, res) => {
  try {
    const { role, department } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, ...(department && { department }) },
      { new: true }
    ).select('-password');
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ── Delete user (admin only) ───────────────────────────────
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ── Volunteers list (admin only) ──────────────────────────
router.get('/volunteers', adminAuth, async (req, res) => {
  try {
    const Volunteer = require('../models/Volunteer');
    const { status, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) filter.$or = [
      { name:  { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { department: { $regex: search, $options: 'i' } },
    ];
    const total = await Volunteer.countDocuments(filter);
    const data  = await Volunteer.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, data, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Update volunteer status (admin only) ──────────────────
router.patch('/volunteers/:id/status', adminAuth, async (req, res) => {
  try {
    const Volunteer = require('../models/Volunteer');
    const vol = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!vol) return res.status(404).json({ success: false, message: 'Volunteer not found' });
    res.json({ success: true, data: vol });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ── Delete volunteer (admin only) ─────────────────────────
router.delete('/volunteers/:id', adminAuth, async (req, res) => {
  try {
    const Volunteer = require('../models/Volunteer');
    await Volunteer.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Volunteer deleted' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ── Registrations list (admin only) ───────────────────────
router.get('/registrations', adminAuth, async (req, res) => {
  try {
    const Registration = require('../models/Registration');
    const { status, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) filter.$or = [
      { name:     { $regex: search, $options: 'i' } },
      { email:    { $regex: search, $options: 'i' } },
      { phone:    { $regex: search, $options: 'i' } },
      { school:   { $regex: search, $options: 'i' } },
      { district: { $regex: search, $options: 'i' } },
    ];
    const total = await Registration.countDocuments(filter);
    const data  = await Registration.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, data, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Update registration status (admin only) ───────────────
router.patch('/registrations/:id/status', adminAuth, async (req, res) => {
  try {
    const Registration = require('../models/Registration');
    const reg = await Registration.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!reg) return res.status(404).json({ success: false, message: 'Registration not found' });
    res.json({ success: true, data: reg });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ── Delete registration (admin only) ──────────────────────
router.delete('/registrations/:id', adminAuth, async (req, res) => {
  try {
    const Registration = require('../models/Registration');
    await Registration.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Registration deleted' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});
router.get('/contacts', teamAuth, async (req, res) => {
  try {
    const data = await Contact.find({ type: 'contact' }).sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch('/contacts/:id/replied', manageAuth, async (req, res) => {
  try {
    const doc = await Contact.findByIdAndUpdate(req.params.id, { replied: true }, { new: true });
    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ── Change admin key ───────────────────────────────────────
router.post('/change-key', adminAuth, async (req, res) => {
  try {
    const { newKey } = req.body;
    if (!newKey || newKey.length < 6)
      return res.status(400).json({ success: false, message: 'Key must be at least 6 characters' });
    process.env.ADMIN_KEY = newKey;
    res.json({ success: true, message: 'Admin key updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Create team member (admin only) ───────────────────────
router.post('/team', adminAuth, async (req, res) => {
  try {
    const { name, email, phone, password, department, teamRole = 'manage' } = req.body;
    if (!name || !email || !phone || !password || !department)
      return res.status(400).json({ success: false, message: 'name, email, phone, password and department are required' });

    const exists = await User.findOne({ $or: [{ email: email.toLowerCase() }, { phone }] });
    if (exists) return res.status(400).json({ success: false, message: 'Email or phone already registered' });

    const user = new User({
      name, email, phone, password,
      role: 'team', department, teamRole,
      status: 'approved',
      messages: [{ from: 'admin', text: `Welcome to the Meipuratchi team, ${name}! You have been added as a ${teamRole === 'view' ? 'viewer' : 'manager'} in the ${department} department.` }],
    });
    await user.save();
    res.status(201).json({ success: true, message: 'Team member created', data: { id: user._id, name: user.name, email: user.email, department: user.department, teamRole: user.teamRole } });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ── Update team member role (admin only) ──────────────────
router.patch('/team/:id/role', adminAuth, async (req, res) => {
  try {
    const { teamRole, department } = req.body;
    if (teamRole && !['view','manage'].includes(teamRole))
      return res.status(400).json({ success: false, message: 'teamRole must be view or manage' });
    const update = {};
    if (teamRole)    update.teamRole   = teamRole;
    if (department)  update.department = department;
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'team' },
      update,
      { new: true }
    ).select('-password -activityLog');
    if (!user) return res.status(404).json({ success: false, message: 'Team member not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ── Get team member activity log (admin only) ─────────────
router.get('/team/:id/activity', adminAuth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, role: 'team' }).select('name department teamRole activityLog');
    if (!user) return res.status(404).json({ success: false, message: 'Team member not found' });
    // Return most recent first
    const log = [...(user.activityLog || [])].reverse().slice(0, 100);
    res.json({ success: true, data: { name: user.name, department: user.department, teamRole: user.teamRole, log } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Get all team members (public — for Team page) ──────────
router.get('/team/public', async (req, res) => {
  try {
    const members = await User.find({ role: 'team' })
      .select('name department skills createdAt')
      .sort({ department: 1, createdAt: 1 });
    res.json({ success: true, data: members });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Reset team member password (admin only) ────────────────
router.patch('/team/:id/password', adminAuth, async (req, res) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 6)
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    const user = await User.findOne({ _id: req.params.id, role: 'team' });
    if (!user) return res.status(404).json({ success: false, message: 'Team member not found' });
    user.password = password;
    await user.save();
    res.json({ success: true, message: 'Password updated' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ── View user password (admin only — for audit/recovery) ───
router.get('/users/:id/password', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('name email password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    // Note: password is hashed, so we return the hash for admin reference
    // In production, you might want to store original passwords encrypted separately
    res.json({ 
      success: true, 
      data: { 
        name: user.name, 
        email: user.email, 
        passwordHash: user.password,
        note: 'Password is hashed with bcrypt. Original password cannot be retrieved.'
      } 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Broadcast email (admin only) ──────────────────────────
// POST /api/admin/broadcast
// Body: { subject, message, targetRole: 'all'|'student'|'volunteer'|'team' }
router.post('/broadcast', adminAuth, async (req, res) => {
  try {
    const { subject, message, targetRole = 'all' } = req.body;
    if (!subject || !message)
      return res.status(400).json({ success: false, message: 'subject and message are required' });

    const filter = {};
    if (targetRole !== 'all') filter.role = targetRole;

    const users = await User.find(filter).select('name email role');
    if (users.length === 0)
      return res.status(404).json({ success: false, message: 'No users found for this target' });

    // Also push as in-app message to each user
    const msgText = `📢 ${subject}\n\n${message}`;
    await User.updateMany(filter, {
      $push: { messages: { from: 'admin', text: msgText, read: false } }
    });

    // Send emails in batches of 10 (avoid rate limits)
    let sent = 0, failed = 0;
    const batchSize = 10;
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      await Promise.allSettled(
        batch.map(u =>
          sendBroadcastEmail(u.email, u.name, subject, message.replace(/\n/g, '<br/>'))
            .then(r => { if (r.success) sent++; else failed++; })
        )
      );
      // Small delay between batches
      if (i + batchSize < users.length) await new Promise(r => setTimeout(r, 500));
    }

    res.json({
      success: true,
      message: `Broadcast complete. Sent: ${sent}, Failed: ${failed}, Total: ${users.length}`,
      stats: { sent, failed, total: users.length },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
