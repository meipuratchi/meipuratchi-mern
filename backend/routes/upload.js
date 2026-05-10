/**
 * routes/upload.js
 * POST /api/upload/drive
 *
 * Accepts a single file (field name: "file") via multipart/form-data,
 * uploads it to Google Drive, and returns the public link.
 */

const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const { uploadToDrive } = require('../utils/driveUpload');

// Store file in memory (buffer) — no disk writes needed
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, and PDF files are allowed'));
    }
  },
});

/**
 * POST /api/upload/drive
 * Body: multipart/form-data with field "file"
 * Response: { success: true, url: "https://drive.google.com/..." }
 */
router.post('/drive', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided' });
    }

    const url = await uploadToDrive(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    res.json({ success: true, url });
  } catch (err) {
    console.error('Drive upload error:', err.message);
    res.status(500).json({ success: false, message: err.message || 'File upload failed' });
  }
});

module.exports = router;
