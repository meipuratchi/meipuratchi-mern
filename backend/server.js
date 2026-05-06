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

app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'Meipuratchi API running' }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
})
  .then(() => {
    console.log('✅ MongoDB Atlas connected');
    app.listen(process.env.PORT, () => console.log(`🚀 Server running on port ${process.env.PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('Check: 1) IP whitelisted in Atlas  2) Username/password correct  3) Network allows SRV DNS');
    process.exit(1);
  });
