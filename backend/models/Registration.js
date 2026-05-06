const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  type: { type: String, default: 'registration' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  school: { type: String, required: true },
  district: { type: String, required: true },
  standard: { type: String, enum: ['10th', '12th', 'Dropout'], required: true },
  stream: { type: String },
  careerInterest: { type: String },
  aadhaar: { type: String },
  status: { type: String, enum: ['pending', 'verified', 'counseled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Registration', registrationSchema, 'dbteam');
