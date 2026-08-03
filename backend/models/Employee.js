const mongoose = require('mongoose');
const crypto   = require('crypto');

const employeeSchema = new mongoose.Schema({
  username:      { type: String, required: true, unique: true, trim: true, lowercase: true },
  displayName:   { type: String, required: true, trim: true },
  authKey:       { type: String, required: true },        // random key shown to employee
  role:          { type: String, default: 'employee' },   // employee | senior | lead
  department:    { type: String, default: '' },
  assignedCareer:{ type: mongoose.Schema.Types.ObjectId, ref: 'Career', default: null },
  isActive:      { type: Boolean, default: true },
  createdAt:     { type: Date, default: Date.now },
  lastLogin:     { type: Date },
});

// Generate a random 12-char alphanumeric key
employeeSchema.statics.generateKey = function () {
  return crypto.randomBytes(6).toString('hex').toUpperCase(); // e.g. A3F1C9D204B7
};

module.exports = mongoose.model('Employee', employeeSchema, 'employees');
