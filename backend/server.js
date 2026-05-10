const path = require('path');
// Load .env only in development (Render injects env vars directly)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.resolve(__dirname, '.env') });
}
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Startup check
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGO_URI set:', !!process.env.MONGO_URI);
console.log('PORT:', process.env.PORT);

// Routes
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/content',       require('./routes/content'));
app.use('/api/registrations', require('./routes/registrations'));
app.use('/api/volunteers',    require('./routes/volunteers'));
app.use('/api/contacts',      require('./routes/contacts'));
app.use('/api/admin',         require('./routes/admin'));
app.use('/api/upload',        require('./routes/upload'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'Meipuratchi API running' }));

// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  const frontendDist = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendDist));
  
  // SPA fallback - serve index.html for all non-API routes
  app.use((req, res, next) => {
    // Skip if it's an API route
    if (req.path.startsWith('/api/')) {
      return next();
    }
    // Serve index.html for all other routes
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
})
  .then(async () => {
    console.log('✅ MongoDB Atlas connected');

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
