const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');

// POST - new registration
router.post('/', async (req, res) => {
  try {
    const reg = new Registration(req.body);
    await reg.save();
    res.status(201).json({ success: true, message: 'Registration successful!', data: reg });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET - all registrations
router.get('/', async (req, res) => {
  try {
    const regs = await Registration.find().sort({ createdAt: -1 });
    res.json({ success: true, data: regs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH - update status
router.patch('/:id/status', async (req, res) => {
  try {
    const reg = await Registration.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json({ success: true, data: reg });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET - stats
router.get('/stats', async (req, res) => {
  try {
    const total = await Registration.countDocuments();
    const pending = await Registration.countDocuments({ status: 'pending' });
    const verified = await Registration.countDocuments({ status: 'verified' });
    const counseled = await Registration.countDocuments({ status: 'counseled' });
    res.json({ success: true, data: { total, pending, verified, counseled } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
