const path = require('path');
// Always load .env — Render injects env vars which override these in production
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Attach worker identity header to every response (visible in DevTools)
app.use((req, res, next) => {
  if (process.env.WORKER_NAME) {
    res.setHeader('X-Worker', process.env.WORKER_NAME);
    res.setHeader('X-Worker-Port', process.env.PORT);
  }
  next();
});

// Startup check
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGO_URI set:', !!process.env.MONGO_URI);
console.log('PORT:', process.env.PORT);
if (process.env.WORKER_NAME) {
  console.log(`WORKER: ${process.env.WORKER_NAME} (id=${process.env.WORKER_ID})`);
}

// Routes
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/content',       require('./routes/content'));
app.use('/api/registrations', require('./routes/registrations'));
app.use('/api/volunteers',    require('./routes/volunteers'));
app.use('/api/contacts',      require('./routes/contacts'));
app.use('/api/admin',         require('./routes/admin'));
app.use('/api/upload',        require('./routes/upload'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'Meipuratchi API running' }));

// Temp debug — remove after testing
app.get('/api/debug-env', (req, res) => res.json({
  GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || 'NOT SET',
  GOOGLE_DRIVE_FOLDER_ID: process.env.GOOGLE_DRIVE_FOLDER_ID || 'NOT SET',
  GOOGLE_PRIVATE_KEY_SET: !!process.env.GOOGLE_PRIVATE_KEY,
}));

// Serve frontend static files in production
// NOTE: Frontend is deployed separately (Netlify/Vercel)
// Backend only serves the API on Render


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
})
  .then(async () => {
    console.log('✅ MongoDB connected to:', mongoose.connection.host);
    console.log('📊 Database name:', mongoose.connection.name);

    // Auto-seed content if DB is empty
    try {
      const SiteContent = require('./models/SiteContent');
      const count = await SiteContent.countDocuments();
      if (count === 0) {
        console.log('📦 No content found — running seed...');
        const SiteTheme = require('./models/SiteTheme');
        const { defaultPages, defaultThemes } = require('./seed/seedContent');
        for (const page of defaultPages) {
          await SiteContent.findOneAndUpdate({ pageId: page.pageId }, { $set: { blocks: page.blocks, title: page.title, slug: page.slug, order: page.order } }, { upsert: true });
        }
        for (const theme of defaultThemes) {
          await SiteTheme.findOneAndUpdate({ name: theme.name }, { $setOnInsert: theme }, { upsert: true });
        }
        console.log('✅ Auto-seed complete');
      }
    } catch (e) {
      console.log('Seed skipped:', e.message);
    }

    app.listen(process.env.PORT, () => console.log(`🚀 Server running on port ${process.env.PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('Check: 1) IP whitelisted in Atlas  2) Username/password correct  3) Network allows SRV DNS');
    process.exit(1);
  });
