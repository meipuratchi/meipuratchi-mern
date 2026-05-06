const mongoose = require('mongoose');

// Each "block" is a piece of editable content on a page
const blockSchema = new mongoose.Schema({
  key:      { type: String, required: true },  // e.g. "hero_title", "hero_subtitle"
  type:     { type: String, enum: ['text', 'textarea', 'image', 'link', 'color', 'list'], default: 'text' },
  label:    { type: String },                  // Human-readable label for admin
  value:    { type: String, default: '' },
  listItems:{ type: [String], default: [] },   // for type=list
});

const pageSchema = new mongoose.Schema({
  pageId:   { type: String, required: true, unique: true }, // e.g. "home", "engineering"
  title:    { type: String, required: true },
  slug:     { type: String, required: true },   // URL path e.g. "/engineering"
  isCustom: { type: Boolean, default: false },  // admin-created pages
  visible:  { type: Boolean, default: true },
  order:    { type: Number, default: 0 },
  blocks:   [blockSchema],
  updatedAt:{ type: Date, default: Date.now },
});

module.exports = mongoose.model('SiteContent', pageSchema, 'sitecontent');
