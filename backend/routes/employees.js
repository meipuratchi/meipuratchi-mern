const express  = require('express');
const router   = express.Router();
const Employee = require('../models/Employee');
const { adminAuth } = require('../middleware/auth');

// ── All routes protected by adminAuth

// GET /api/employees — list all
router.get('/', adminAuth, async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 }).select('-__v');
    res.json({ success: true, employees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/employees — create new employee with auto-generated key
router.post('/', adminAuth, async (req, res) => {
  try {
    const { username, displayName, role, department } = req.body;
    if (!username || !displayName)
      return res.status(400).json({ success: false, message: 'username and displayName required' });

    const existing = await Employee.findOne({ username: username.toLowerCase() });
    if (existing) return res.status(409).json({ success: false, message: 'Username already exists' });

    const authKey = Employee.generateKey();
    const emp = await Employee.create({
      username: username.toLowerCase(),
      displayName,
      authKey,
      role: role || 'employee',
      department: department || '',
    });

    res.json({ success: true, employee: emp, authKey }); // authKey returned once clearly
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/employees/:id/regenerate-key — regenerate auth key
router.patch('/:id/regenerate-key', adminAuth, async (req, res) => {
  try {
    const newKey = Employee.generateKey();
    const emp = await Employee.findByIdAndUpdate(
      req.params.id,
      { authKey: newKey },
      { new: true }
    );
    if (!emp) return res.status(404).json({ success: false, message: 'Employee not found' });
    res.json({ success: true, authKey: newKey, employee: emp });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/employees/:id — update employee info
router.patch('/:id', adminAuth, async (req, res) => {
  try {
    const { displayName, role, department, isActive } = req.body;
    const update = {};
    if (displayName !== undefined) update.displayName = displayName;
    if (role        !== undefined) update.role        = role;
    if (department  !== undefined) update.department  = department;
    if (isActive    !== undefined) update.isActive    = isActive;

    const emp = await Employee.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!emp) return res.status(404).json({ success: false, message: 'Employee not found' });
    res.json({ success: true, employee: emp });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/employees/:id
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
