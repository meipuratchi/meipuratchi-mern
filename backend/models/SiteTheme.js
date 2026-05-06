const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  isActive:   { type: Boolean, default: false },
  colors: {
    primary:      { type: String, default: '#192441' },
    primaryLight: { type: String, default: '#2a3a6b' },
    accent:       { type: String, default: '#f5a623' },
    accentRed:    { type: String, default: '#e74c3c' },
    dark:         { type: String, default: '#212529' },
    light:        { type: String, default: '#f8f9fa' },
  },
  fonts: {
    heading: { type: String, default: 'Poppins' },
    body:    { type: String, default: 'Poppins' },
  },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SiteTheme', themeSchema, 'sitetheme');
