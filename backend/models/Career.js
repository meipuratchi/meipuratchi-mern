const mongoose = require('mongoose');

// ── Job Posting ────────────────────────────────────────────
const jobSchema = new mongoose.Schema({
  title:        { type: String, required: true },           // e.g. "Full Stack Developer Intern"
  roleType:     { type: String, default: 'Intern' },        // Intern | Part-time | Contract
  department:   { type: String },                           // Engineering, Design, etc.
  workingMode:  { type: String, enum: ['Remote', 'On-site', 'Hybrid'], default: 'Remote' },
  description:  { type: String, required: true },           // Job description (markdown/plain)
  eligibility:  { type: String },                           // Who can apply
  techStack:    [{ type: String }],                         // ['React', 'Node.js', ...]
  stipend:      { type: String, default: 'None' },          // 'None' or amount like '₹5,000/month'
  openings:     { type: Number, default: 1 },
  deadline:     { type: Date },                             // Application deadline
  isActive:     { type: Boolean, default: true },           // Toggle visibility
  postedBy:     { type: String, default: 'admin' },
  createdAt:    { type: Date, default: Date.now },
  updatedAt:    { type: Date, default: Date.now },
});

// ── Job Application ────────────────────────────────────────
const applicationSchema = new mongoose.Schema({
  jobId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Career', required: true },
  jobTitle:     { type: String },                           // Denormalized for quick access
  applicantId:  { type: mongoose.Schema.Types.ObjectId, ref: 'CareerUser' },
  // Applicant details
  name:         { type: String, required: true },
  email:        { type: String, required: true, lowercase: true },
  phone:        { type: String, required: true },
  collegeOrOrg: { type: String },                           // College / Current Organization
  degree:       { type: String },                           // B.E., B.Sc., etc.
  yearOfStudy:  { type: String },                           // 1st / 2nd / 3rd / 4th / Graduate
  skills:       { type: String },                           // Free-text skills
  resumeLink:   { type: String },                           // Google Drive / LinkedIn / any URL
  portfolioLink:{ type: String },                           // GitHub, Behance, etc.
  coverLetter:  { type: String },                           // Why do you want to join?
  linkedinUrl:  { type: String },

  // Admin workflow
  status: {
    type: String,
    enum: ['applied', 'under_review', 'shortlisted', 'selected', 'rejected', 'offer_sent', 'completed'],
    default: 'applied',
  },
  adminNotes:   { type: String },
  messages:     [{
    from:   { type: String },   // 'admin' or applicant name
    text:   { type: String, required: true },
    sentAt: { type: Date, default: Date.now },
    read:   { type: Boolean, default: false },
  }],

  // Letter generation
  offerLetterGeneratedAt:      { type: Date },
  completionLetterGeneratedAt: { type: Date },
  // Store generated letter data for reprinting
  letterData: {
    internshipStartDate: { type: String },
    internshipEndDate:   { type: String },
    internshipDuration:  { type: String },   // e.g. "2 months"
    mentorName:          { type: String },
  },

  createdAt: { type: Date, default: Date.now },
});

// ── Career Portal User (separate from main site users) ───
const careerUserSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  phone:     { type: String, required: true },
  password:  { type: String, required: true },
  collegeOrOrg: { type: String },
  degree:    { type: String },
  skills:    { type: String },
  resumeLink:{ type: String },
  linkedinUrl:{ type: String },
  createdAt: { type: Date, default: Date.now },
});

const bcrypt = require('bcryptjs');
careerUserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = bcrypt.hashSync(this.password, 10);
});
careerUserSchema.methods.comparePassword = function (plain) {
  return require('bcryptjs').compare(plain, this.password);
};

const Career     = mongoose.model('Career',     jobSchema,          'careers');
const CareerApp  = mongoose.model('CareerApp',  applicationSchema,  'career_applications');
const CareerUser = mongoose.model('CareerUser', careerUserSchema,   'career_users');

module.exports = { Career, CareerApp, CareerUser };
