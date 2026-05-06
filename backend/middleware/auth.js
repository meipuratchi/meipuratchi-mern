const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// Protect user routes
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

// Protect admin routes
const adminAuth = (req, res, next) => {
  const key = req.headers['x-admin-key'];
  if (key !== process.env.ADMIN_KEY)
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  next();
};

// Team member (any teamRole) or admin — for read operations
const teamAuth = (req, res, next) => {
  if (req.headers['x-admin-key'] === process.env.ADMIN_KEY) {
    req.isAdmin = true;
    return next();
  }
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'team') return res.status(403).json({ success: false, message: 'Team access required' });
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Team member with 'manage' role or admin — for write operations
const manageAuth = async (req, res, next) => {
  if (req.headers['x-admin-key'] === process.env.ADMIN_KEY) {
    req.isAdmin = true;
    return next();
  }
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'team') return res.status(403).json({ success: false, message: 'Team access required' });
    // Check teamRole from DB
    const member = await User.findById(decoded.id).select('teamRole name');
    if (!member || member.teamRole !== 'manage')
      return res.status(403).json({ success: false, message: 'You have view-only access. Ask admin to upgrade your role.' });
    req.user = { ...decoded, teamRole: 'manage', memberName: member.name };
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Log activity for team members (non-blocking helper)
const logActivity = async (memberId, action, targetId, targetName, detail) => {
  if (!memberId) return;
  try {
    await User.findByIdAndUpdate(memberId, {
      $push: {
        activityLog: {
          $each: [{ action, targetId, targetName, detail, at: new Date() }],
          $slice: -200, // keep last 200 entries
        }
      }
    });
  } catch { /* non-blocking */ }
};

module.exports = { userAuth, adminAuth, teamAuth, manageAuth, logActivity };
