const express = require('express');
const router = express.Router();
const Volunteer = require('../models/Volunteer');

router.post('/', async (req, res) => {
  try {
    const vol = new Volunteer(req.body);
    await vol.save();
    res.status(201).json({ success: true, message: 'Volunteer application submitted!', data: vol });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const vols = await Volunteer.find().sort({ createdAt: -1 });
    res.json({ success: true, data: vols });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
