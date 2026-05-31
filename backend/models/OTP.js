/**
 * OTP Model
 * Stores one-time passwords for login/register verification.
 * Auto-expires via MongoDB TTL index after 10 minutes.
 */

const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  // Who this OTP belongs to (email or phone)
  identifier: { type: String, required: true, lowercase: true },

  // The 6-digit code
  code: { type: String, required: true },

  // Purpose: 'login' | 'register' | 'verify'
  purpose: { type: String, enum: ['login', 'register', 'verify'], default: 'login' },

  // How many times it has been attempted (prevent brute force)
  attempts: { type: Number, default: 0 },

  // Whether it has been used
  used: { type: Boolean, default: false },

  // Auto-delete after 10 minutes (MongoDB TTL)
  createdAt: { type: Date, default: Date.now, expires: 600 },
});

// Compound index: one active OTP per identifier+purpose at a time
otpSchema.index({ identifier: 1, purpose: 1 });

module.exports = mongoose.model('OTP', otpSchema);
