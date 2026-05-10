const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  type: { type: String, default: 'registration' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  school: { type: String },
  district: { type: String },
  standard: { type: String },
  stream: { type: String },
  careerInterest: { type: String },
  qualification: { type: String },
  dateOfBirth: { type: String },
  aadhaar: { type: String },
  // Google Drive link for the uploaded proof document
  proofFileUrl: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'verified', 'counseled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Registration', registrationSchema, 'dbteam');
