const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  // Core info
  title:       { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },

  // Who raised it
  raisedBy:    { type: String, required: true },   // public user name / admin / employee username
  raisedByType:{ type: String, enum: ['public', 'admin', 'employee'], default: 'public' },
  email:       { type: String, default: '' },       // optional contact email for public tickets
  phone:       { type: String, default: '' },

  // Assignment
  assignee:    { type: String, default: '' },       // employee username assigned to
  assigneeId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },

  // Type
  type: {
    type: String,
    enum: ['support', 'task', 'bug', 'query', 'other'],
    default: 'support',
  },

  // Status
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'closed'],
    default: 'open',
  },

  // Priority
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },

  // Deadline (admin-set tasks)
  deadline:    { type: Date, default: null },

  // Internal note / resolution
  note:        { type: String, default: '' },

  createdAt:   { type: Date, default: Date.now },
  updatedAt:   { type: Date, default: Date.now },
});

ticketSchema.pre('save', function () {
  this.updatedAt = new Date();
});

module.exports = mongoose.model('Ticket', ticketSchema, 'tickets');
