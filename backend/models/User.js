const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const messageSchema = new mongoose.Schema({
  from:    { type: String, default: 'admin' }, // 'admin' or user name
  text:    { type: String, required: true },
  sentAt:  { type: Date, default: Date.now },
  read:    { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema({
  // Identity
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  phone:    { type: String, required: true },
  password: { type: String, required: true },

  // Role: student | volunteer | team
  role:     { type: String, enum: ['student', 'volunteer', 'team'], default: 'student' },

  // For team members — which department
  department: { type: String },

  // Team member permission level: 'view' (read-only) | 'manage' (edit + message)
  teamRole: { type: String, enum: ['view', 'manage'], default: 'manage' },

  // Activity log — tracks every action a team member takes
  activityLog: [{
    action:    { type: String },   // e.g. 'status_update', 'message_sent', 'login', 'viewed_user'
    targetId:  { type: String },   // user._id they acted on
    targetName:{ type: String },
    detail:    { type: String },
    at:        { type: Date, default: Date.now },
  }],

  // Request status (for students & volunteers)
  status: {
    type: String,
    enum: ['submitted', 'validating', 'verified', 'counseled', 'approved', 'rejected'],
    default: 'submitted',
  },

  // Extra profile fields
  school:        { type: String },
  district:      { type: String },
  standard:      { type: String },
  stream:        { type: String },
  careerInterest:{ type: String },
  skills:        { type: String },
  dateOfBirth:   { type: String },
  qualification: { type: String },
  proofFileUrl:  { type: String },

  // Messages thread between admin and user
  messages: [messageSchema],

  // Admin notes (internal, not shown to user)
  adminNotes: { type: String },

  createdAt: { type: Date, default: Date.now },
});

// Hash password before save — Mongoose 9 style (no next param)
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = bcrypt.hashSync(this.password, 10);
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', userSchema, 'dbteam');
