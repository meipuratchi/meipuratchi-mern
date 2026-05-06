# Meipuratchi MERN App

## Setup

### Backend
```bash
cd server
npm install
# Edit .env with your MongoDB URI
npm start
```

### Frontend
```bash
cd client
npm install
npm run dev
```

## Stack
- MongoDB + Mongoose
- Express.js
- React + Vite
- Node.js

## Pages
- `/` — Home (Hero, About, Career Paths, How It Works)
- `/registration` — Student Registration Form
- `/engineering` — TNEA 2025, Cutoff Calculator, College List
- `/paramedical` — Paramedical Degree Courses
- `/team` — Team Responsibilities
- `/volunteer` — Volunteer Application
- `/contact` — Contact Form

## API Endpoints
- `POST /api/registrations` — Register student
- `GET /api/registrations` — List all registrations
- `GET /api/registrations/stats` — Stats
- `POST /api/volunteers` — Volunteer application
- `POST /api/contacts` — Contact message

Here's the best free way to get your MERN app online — I'll cover both the database and hosting parts.

**1. Host your MongoDB database for free → MongoDB Atlas**

Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free account. The M0 free tier gives you a shared 512MB cluster. Once created, get your connection string and replace your local `mongodb://localhost:27017/yourdb` with it.

**2. Deploy your backend (Node/Express) for free**

The best free options right now:

- **Render** — render.com. Easiest. Connect your GitHub repo, set environment variables (your Atlas connection string, JWT secret, etc.), and it deploys automatically. Free tier spins down after inactivity but it's fine for testing.
- **Railway** — railway.app. Similar to Render, slightly more generous free hours.
- **Fly.io** — fly.io. More control, has a free allowance, better for persistent apps.

**3. Deploy your frontend (React) for free**

- **Vercel** — vercel.com. Best for React. Free, fast, and deploys from GitHub in one click.
- **Netlify** — also great, similar experience.

---

**Quick step-by-step:****Key things to set up before deploying:**

In your React frontend, change the API URL from `http://localhost:5000` to an environment variable:
```js
const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

In Vercel, add `REACT_APP_API_URL` = your Render backend URL.

In your backend, make sure CORS allows your Vercel domain:
```js
app.use(cors({ origin: 'https://your-app.vercel.app' }));
```

---

**Recommended stack for you:**
- Database → **MongoDB Atlas** (free M0)
- Backend → **Render** (free tier, easiest setup)
- Frontend → **Vercel** (best for React, very fast)

All three are free and connect together smoothly. Would you like help with any specific step like writing the Render config or setting up CORS?