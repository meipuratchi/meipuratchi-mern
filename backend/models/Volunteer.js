const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  type: { type: String, default: 'volunteer' },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  department: {
    type: String,
    enum: ['Design', 'Social Media', 'Counseling', 'Technical', 'Language', 'Innovation', 'Student Support', 'Coordination'],
    required: true
  },
  skills: { type: String },
  message: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Volunteer', volunteerSchema, 'dbteam');
