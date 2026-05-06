const express    = require('express');
const router     = express.Router();
const SiteContent = require('../models/SiteContent');
const SiteTheme   = require('../models/SiteTheme');
const { adminAuth } = require('../middleware/auth');

// ── PUBLIC: get all visible pages (for nav) ────────────────
router.get('/pages', async (req, res) => {
  try {
    const pages = await SiteContent.find({ visible: true })
      .select('pageId title slug order isCustom')
      .sort({ order: 1 });
    res.json({ success: true, data: pages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PUBLIC: get single page content ───────────────────────
router.get('/pages/:pageId', async (req, res) => {
  try {
    const page = await SiteContent.findOne({ pageId: req.params.pageId, visible: true });
    if (!page) return res.status(404).json({ success: false, message: 'Page not found' });
    // Convert blocks array to a flat key→value map for easy use in frontend
    const content = {};
    page.blocks.forEach(b => {
      content[b.key] = b.type === 'list' ? b.listItems : b.value;
    });
    res.json({ success: true, data: { ...page.toObject(), content } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PUBLIC: get active theme ───────────────────────────────
router.get('/theme', async (req, res) => {
  try {
    const theme = await SiteTheme.findOne({ isActive: true });
    res.json({ success: true, data: theme });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── ADMIN: get all pages (including hidden) ────────────────
router.get('/admin/pages', adminAuth, async (req, res) => {
  try {
    const pages = await SiteContent.find().sort({ order: 1 });
    res.json({ success: true, data: pages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── ADMIN: update page blocks ──────────────────────────────
router.put('/admin/pages/:pageId', adminAuth, async (req, res) => {
  try {
    const { blocks, title, visible, order } = req.body;
    const page = await SiteContent.findOneAndUpdate(
      { pageId: req.params.pageId },
      { blocks, title, visible, order, updatedAt: new Date() },
      { new: true }
    );
    if (!page) return res.status(404).json({ success: false, message: 'Page not found' });
    res.json({ success: true, data: page });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ── ADMIN: create new custom page ─────────────────────────
router.post('/admin/pages', adminAuth, async (req, res) => {
  try {
    const { pageId, title, slug, blocks = [], order = 99 } = req.body;
    if (!pageId || !title || !slug)
      return res.status(400).json({ success: false, message: 'pageId, title and slug are required' });
    const exists = await SiteContent.findOne({ pageId });
    if (exists) return res.status(400).json({ success: false, message: 'Page ID already exists' });
    const page = await SiteContent.create({ pageId, title, slug, blocks, order, isCustom: true });
    res.status(201).json({ success: true, data: page });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ── ADMIN: delete custom page ──────────────────────────────
router.delete('/admin/pages/:pageId', adminAuth, async (req, res) => {
  try {
    const page = await SiteContent.findOne({ pageId: req.params.pageId });
    if (!page) return res.status(404).json({ success: false, message: 'Page not found' });
    if (!page.isCustom) return res.status(403).json({ success: false, message: 'Cannot delete built-in pages' });
    await SiteContent.deleteOne({ pageId: req.params.pageId });
    res.json({ success: true, message: 'Page deleted' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ── ADMIN: get all themes ──────────────────────────────────
router.get('/admin/themes', adminAuth, async (req, res) => {
  try {
    const themes = await SiteTheme.find();
    res.json({ success: true, data: themes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── ADMIN: activate a theme ────────────────────────────────
router.patch('/admin/themes/:id/activate', adminAuth, async (req, res) => {
  try {
    await SiteTheme.updateMany({}, { isActive: false });
    const theme = await SiteTheme.findByIdAndUpdate(req.params.id, { isActive: true, updatedAt: new Date() }, { new: true });
    res.json({ success: true, data: theme });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ── ADMIN: update theme colors ─────────────────────────────
router.put('/admin/themes/:id', adminAuth, async (req, res) => {
  try {
    const theme = await SiteTheme.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    res.json({ success: true, data: theme });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ── ADMIN: create custom theme ─────────────────────────────
router.post('/admin/themes', adminAuth, async (req, res) => {
  try {
    const theme = await SiteTheme.create({ ...req.body, isActive: false });
    res.status(201).json({ success: true, data: theme });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
