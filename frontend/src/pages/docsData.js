// meiDocs — All documentation content
// Each doc has: id, category, icon, title, readTime, content (array of blocks)
// Block types: heading, subheading, para, code, note, warning, tip, step, video, divider, list, table

export const DOC_CATEGORIES = [
  { id: 'getting-started', label: 'Getting Started',   icon: '🚀' },
  { id: 'local-setup',     label: 'Local Setup',        icon: '🖥️' },
  { id: 'tools',           label: 'Tools & IDE',         icon: '🔧' },
  { id: 'mern-stack',      label: 'MERN Stack',          icon: '⚡' },
  { id: 'database',        label: 'Database (MongoDB)', icon: '🗄️' },
  { id: 'project',         label: 'Project Guide',      icon: '📁' },
];

export const DOCS = [
  // ─────────────────────────────────────────────────────────────
  //  GETTING STARTED
  // ─────────────────────────────────────────────────────────────
  {
    id: 'welcome',
    category: 'getting-started',
    icon: '👋',
    title: 'Welcome to Meipuratchi',
    readTime: '3 min',
    content: [
      { type: 'heading', text: 'Welcome to மெய் புரட்சி — Meipuratchi' },
      { type: 'para', text: 'Meipuratchi is a career guidance and educational support platform built for students across Tamil Nadu and India. As a new intern or employee, this portal (meiDocs) is your complete onboarding resource.' },
      { type: 'note', text: '📌 This portal is accessible only to employees and interns using the organisation access key. Keep it confidential.' },
      { type: 'subheading', text: 'What we do' },
      { type: 'list', items: [
        '🎓 Career counseling for students in Tamil Nadu',
        '🏥 Medical & Engineering college guidance (NEET / JEE)',
        '📋 Registration management and team coordination',
        '🎫 Internal ticket and task tracking system',
        '📚 TakeYouForward — centralized course & exam discovery',
      ]},
      { type: 'subheading', text: 'Tech Stack Overview' },
      { type: 'table', headers: ['Layer', 'Technology', 'Purpose'], rows: [
        ['Frontend', 'React 18 + Vite', 'User interface'],
        ['Styling', 'Plain CSS + Poppins font', 'Design system'],
        ['Backend', 'Node.js + Express', 'REST API server'],
        ['Database', 'MongoDB + Mongoose', 'Data storage'],
        ['Auth', 'JWT + OTP (email)', 'Security'],
        ['Email', 'Nodemailer / SendGrid', 'Notifications'],
        ['File Upload', 'Google Drive API', 'Document storage'],
        ['Deployment', 'Render / Netlify / VPS', 'Hosting'],
      ]},
      { type: 'subheading', text: 'Monorepo Structure' },
      { type: 'code', lang: 'bash', text: `meipuratchi-mern/
├── frontend/      ← React + Vite  (Port 5173)
├── backend/       ← Express API   (Port 5000)
├── admin/         ← Admin panel   (Port 5174)
└── careers/       ← Careers app   (Port 5175)` },
      { type: 'tip', text: 'Start by reading the Local Setup guide next. It walks you step-by-step from zero to running the project on your machine.' },
    ],
  },
  {
    id: 'onboarding-checklist',
    category: 'getting-started',
    icon: '✅',
    title: 'Intern Onboarding Checklist',
    readTime: '5 min',
    content: [
      { type: 'heading', text: 'Intern Onboarding Checklist' },
      { type: 'para', text: 'Complete these steps in order during your first week. Check off each item with your team lead.' },
      { type: 'step', number: 1, title: 'Receive Access Key', text: 'Get the organisation access key from your team lead. This key unlocks the Tickets portal and meiDocs.' },
      { type: 'step', number: 2, title: 'Set Up Your Machine', text: 'Follow the Local Setup guide in this portal to install Node.js, MongoDB, VS Code/Kiro, and get the project running locally.' },
      { type: 'step', number: 3, title: 'Team Login', text: 'Log in at /team using your registered email and password. Your account must have role = "team" (ask admin if needed).' },
      { type: 'step', number: 4, title: 'Explore the Codebase', text: 'Read through the Project Guide doc in this portal. Understand the folder structure, naming conventions, and data flow.' },
      { type: 'step', number: 5, title: 'Complete the MERN Learning Path', text: 'Watch the recommended YouTube videos in the MERN Stack section. These cover everything from basics to full-stack patterns.' },
      { type: 'step', number: 6, title: 'Pick Your First Task', text: 'Check the Tickets portal at /tickets. Pick an "open" task tagged for interns and assign it to yourself (ask your team lead first).' },
      { type: 'step', number: 7, title: 'Daily Standup', text: 'Join the daily standup (time shared by team lead). Report: What you did yesterday, what you plan to do today, any blockers.' },
      { type: 'note', text: 'If you are stuck at any step, raise a ticket in the Tickets portal with type = "query" and tag it to your team lead.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  //  LOCAL SETUP
  // ─────────────────────────────────────────────────────────────
  {
    id: 'install-nodejs',
    category: 'local-setup',
    icon: '🟩',
    title: 'Install Node.js',
    readTime: '8 min',
    content: [
      { type: 'heading', text: 'Install Node.js' },
      { type: 'para', text: 'Node.js is the JavaScript runtime that powers our backend server. You need Node.js 18 or higher for this project.' },
      { type: 'subheading', text: 'Step 1 — Download' },
      { type: 'para', text: 'Go to https://nodejs.org and download the LTS (Long-Term Support) version. As of 2025 that is Node.js 20.x LTS.' },
      { type: 'note', text: '✅ Always install the LTS version, never the "Current" version, for production projects.' },
      { type: 'subheading', text: 'Step 2 — Install (Windows)' },
      { type: 'list', items: [
        'Run the downloaded .msi installer',
        'Accept the license, click Next through all screens',
        'On the "Tools for Native Modules" screen — check the box "Automatically install necessary tools"',
        'Click Install and wait for it to finish',
        'Restart your terminal / VS Code after installation',
      ]},
      { type: 'subheading', text: 'Step 3 — Install (macOS)' },
      { type: 'code', lang: 'bash', text: `# Using Homebrew (recommended)
brew install node@20
brew link node@20

# Or using nvm (Node Version Manager) — best for managing multiple versions
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.zshrc   # or ~/.bashrc
nvm install 20
nvm use 20` },
      { type: 'subheading', text: 'Step 4 — Verify Installation' },
      { type: 'code', lang: 'bash', text: `node --version   # should print v20.x.x
npm --version    # should print 10.x.x` },
      { type: 'subheading', text: 'Step 5 — Install project dependencies' },
      { type: 'code', lang: 'bash', text: `# From the project root
cd backend
npm install

cd ../frontend
npm install

cd ../admin
npm install` },
      { type: 'warning', text: 'Never commit the node_modules/ folder. It is already in .gitignore. If you accidentally did, run: git rm -r --cached node_modules' },
      { type: 'subheading', text: 'Useful npm commands' },
      { type: 'table', headers: ['Command', 'What it does'], rows: [
        ['npm install', 'Install all dependencies from package.json'],
        ['npm run dev', 'Start development server (Vite for frontend, nodemon for backend)'],
        ['npm run build', 'Build for production'],
        ['npm install <pkg>', 'Install a new package and add to package.json'],
        ['npm install -D <pkg>', 'Install as dev dependency'],
        ['npm outdated', 'Show packages with newer versions available'],
      ]},
    ],
  },
  {
    id: 'install-mongodb',
    category: 'local-setup',
    icon: '🍃',
    title: 'Install MongoDB (Local)',
    readTime: '12 min',
    content: [
      { type: 'heading', text: 'Install MongoDB Locally' },
      { type: 'para', text: 'MongoDB is our primary database. You have two options: run it locally on your machine, or use MongoDB Atlas (cloud). This guide covers the local setup first, then Atlas.' },
      { type: 'subheading', text: 'Option A — Local Install (Windows)' },
      { type: 'step', number: 1, title: 'Download MongoDB Community Server', text: 'Go to https://www.mongodb.com/try/download/community — select Version 7.0, Platform: Windows, Package: msi. Download and run the installer.' },
      { type: 'step', number: 2, title: 'Run the Installer', text: 'Choose "Complete" setup type. Keep the default install path (C:\\Program Files\\MongoDB). Check "Install MongoDB as a Service" — this auto-starts MongoDB when Windows boots.' },
      { type: 'step', number: 3, title: 'Install MongoDB Compass (GUI)', text: 'During installation, leave "Install MongoDB Compass" checked. Compass is a visual GUI for browsing your database — essential for debugging.' },
      { type: 'step', number: 4, title: 'Verify it is running', text: 'Open a terminal and run:' },
      { type: 'code', lang: 'bash', text: `# Check service status (Windows PowerShell)
Get-Service MongoDB

# Or connect directly
mongosh
# You should see: connecting to: mongodb://127.0.0.1:27017` },
      { type: 'subheading', text: 'Option A — Local Install (macOS)' },
      { type: 'code', lang: 'bash', text: `# Install via Homebrew
brew tap mongodb/brew
brew install mongodb-community@7.0

# Start MongoDB service
brew services start mongodb-community@7.0

# Verify
mongosh
# Should connect to mongodb://127.0.0.1:27017` },
      { type: 'subheading', text: 'Option B — MongoDB Atlas (Cloud) — Recommended for Team Work' },
      { type: 'step', number: 1, title: 'Create an Atlas account', text: 'Go to https://www.mongodb.com/cloud/atlas/register — sign up for free.' },
      { type: 'step', number: 2, title: 'Create a Free Cluster', text: 'Click "Build a Database" → Choose M0 Free tier → Select region closest to you (Mumbai/Singapore for India). Click Create.' },
      { type: 'step', number: 3, title: 'Create a Database User', text: 'In Security → Database Access → Add New Database User. Set username and a strong password. Role: Atlas Admin (for dev). Save.' },
      { type: 'step', number: 4, title: 'Whitelist Your IP', text: 'Security → Network Access → Add IP Address → Click "Allow Access from Anywhere" (0.0.0.0/0) for development. Confirm.' },
      { type: 'step', number: 5, title: 'Get the Connection String', text: 'Clusters → Connect → Drivers → Select Node.js → Copy the connection string. It looks like:' },
      { type: 'code', lang: 'bash', text: `mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/meipuratchi?retryWrites=true&w=majority` },
      { type: 'step', number: 6, title: 'Add to backend .env', text: 'Open backend/.env and set:' },
      { type: 'code', lang: 'bash', text: `MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/meipuratchi?retryWrites=true&w=majority` },
      { type: 'warning', text: 'Never commit your .env file to Git. It contains your database password. It is already in .gitignore — make sure it stays that way.' },
      { type: 'note', text: 'For local development, you can also use: MONGODB_URI=mongodb://127.0.0.1:27017/meipuratchi' },
      { type: 'subheading', text: 'Verify connection' },
      { type: 'code', lang: 'bash', text: `cd backend
npm run dev
# You should see: ✅ MongoDB connected to meipuratchi` },
    ],
  },
  {
    id: 'run-project',
    category: 'local-setup',
    icon: '▶️',
    title: 'Run the Project Locally',
    readTime: '10 min',
    content: [
      { type: 'heading', text: 'Run the Project Locally' },
      { type: 'para', text: 'Once Node.js and MongoDB are installed, follow these steps to get all services running on your local machine.' },
      { type: 'subheading', text: 'Step 1 — Clone the Repository' },
      { type: 'code', lang: 'bash', text: `git clone https://github.com/meipuratchi/meipuratchi-mern.git
cd meipuratchi-mern` },
      { type: 'subheading', text: 'Step 2 — Set Up Environment Variables' },
      { type: 'para', text: 'The backend has a .env.example file. Copy it and fill in your values:' },
      { type: 'code', lang: 'bash', text: `cd backend
cp .env.example .env` },
      { type: 'para', text: 'Open backend/.env and fill in these required values:' },
      { type: 'code', lang: 'bash', text: `# Required — get from team lead
MONGODB_URI=mongodb://127.0.0.1:27017/meipuratchi
JWT_SECRET=your_super_secret_key_change_this
ADMIN_KEY=your_admin_key

# Optional — for email OTP (get SendGrid key from team lead)
EMAIL_FROM=noreply@meipuratchi.org
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx

# Server
PORT=5000
NODE_ENV=development` },
      { type: 'subheading', text: 'Step 3 — Install Dependencies' },
      { type: 'code', lang: 'bash', text: `# Run from project root — installs all three apps
cd backend  && npm install && cd ..
cd frontend && npm install && cd ..
cd admin    && npm install && cd ..` },
      { type: 'subheading', text: 'Step 4 — Set Up Frontend Environment' },
      { type: 'code', lang: 'bash', text: `# frontend/.env
VITE_API_URL=http://localhost:5000

# admin/.env
VITE_API_URL=http://localhost:5000` },
      { type: 'subheading', text: 'Step 5 — Start All Services' },
      { type: 'para', text: 'Open three separate terminal windows:' },
      { type: 'code', lang: 'bash', text: `# Terminal 1 — Backend API
cd backend
npm run dev
# Runs on http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm run dev
# Runs on http://localhost:5173

# Terminal 3 — Admin panel (optional)
cd admin
npm run dev
# Runs on http://localhost:5174` },
      { type: 'subheading', text: 'Step 6 — Seed the Database (first time only)' },
      { type: 'code', lang: 'bash', text: `cd backend
node seed/seedContent.js
# Seeds initial CMS content` },
      { type: 'tip', text: 'Use the VS Code integrated terminals: View → Terminal → split into 3 panels. Much easier than managing 3 separate windows.' },
      { type: 'subheading', text: 'Port Summary' },
      { type: 'table', headers: ['Service', 'Port', 'URL'], rows: [
        ['Backend API', '5000', 'http://localhost:5000'],
        ['Frontend', '5173', 'http://localhost:5173'],
        ['Admin Panel', '5174', 'http://localhost:5174'],
        ['MongoDB (local)', '27017', 'mongodb://localhost:27017'],
      ]},
      { type: 'warning', text: 'Make sure ports 5000, 5173, and 5174 are not used by other applications. If they are, change the PORT in .env or the vite.config.js.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  //  TOOLS & IDE
  // ─────────────────────────────────────────────────────────────
  {
    id: 'install-vscode',
    category: 'tools',
    icon: '💙',
    title: 'Install VS Code',
    readTime: '6 min',
    content: [
      { type: 'heading', text: 'Install Visual Studio Code' },
      { type: 'para', text: 'VS Code is the most popular free code editor for web development. It has excellent support for JavaScript, React, and Node.js.' },
      { type: 'subheading', text: 'Download & Install' },
      { type: 'step', number: 1, title: 'Download', text: 'Visit https://code.visualstudio.com and download the installer for your OS (Windows / macOS / Linux).' },
      { type: 'step', number: 2, title: 'Install (Windows)', text: 'Run the installer. On the "Additional Tasks" screen, check both: "Add to PATH" and "Add Open with Code to context menu" — these are very useful.' },
      { type: 'step', number: 3, title: 'Open the project', text: 'Launch VS Code. File → Open Folder → navigate to meipuratchi-mern and open it.' },
      { type: 'subheading', text: 'Essential Extensions to Install' },
      { type: 'para', text: 'Press Ctrl+Shift+X (Cmd+Shift+X on Mac) to open the Extensions panel. Search and install these:' },
      { type: 'table', headers: ['Extension', 'Publisher', 'Why'], rows: [
        ['ESLint', 'Microsoft', 'Catches JavaScript errors in real-time'],
        ['Prettier', 'Prettier', 'Auto-formats code on save'],
        ['ES7+ React/Redux snippets', 'dsznajder', 'Type rafce → instant React component'],
        ['Tailwind CSS IntelliSense', 'Tailwind Labs', 'Autocomplete for class names'],
        ['MongoDB for VS Code', 'MongoDB', 'Browse DB from within VS Code'],
        ['GitLens', 'GitKraken', 'See who changed each line, blame view'],
        ['Thunder Client', 'Ranga Vadhineni', 'Test APIs without leaving VS Code'],
        ['Auto Rename Tag', 'Jun Han', 'Auto-renames matching HTML/JSX tags'],
        ['Path IntelliSense', 'Christian Kohler', 'Autocomplete file paths in imports'],
        ['DotENV', 'mikestead', 'Syntax highlighting for .env files'],
      ]},
      { type: 'subheading', text: 'Recommended VS Code Settings' },
      { type: 'para', text: 'Open settings: Ctrl+Shift+P → "Open User Settings (JSON)" and add:' },
      { type: 'code', lang: 'json', text: `{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.tabSize": 2,
  "editor.wordWrap": "on",
  "terminal.integrated.defaultProfile.windows": "PowerShell",
  "emmet.includeLanguages": { "javascript": "javascriptreact" },
  "editor.bracketPairColorization.enabled": true,
  "editor.guides.bracketPairs": true
}` },
      { type: 'subheading', text: 'Useful Keyboard Shortcuts' },
      { type: 'table', headers: ['Shortcut', 'Action'], rows: [
        ['Ctrl + `', 'Open / focus terminal'],
        ['Ctrl + P', 'Quick file open (fuzzy search)'],
        ['Ctrl + Shift + P', 'Command palette'],
        ['Alt + Click', 'Multi-cursor editing'],
        ['Ctrl + D', 'Select next occurrence of selection'],
        ['Ctrl + Shift + K', 'Delete current line'],
        ['Ctrl + /', 'Toggle comment'],
        ['F12', 'Go to definition'],
        ['Ctrl + Shift + F', 'Search across all files'],
      ]},
    ],
  },
  {
    id: 'install-kiro',
    category: 'tools',
    icon: '🤖',
    title: 'Install Kiro IDE',
    readTime: '7 min',
    content: [
      { type: 'heading', text: 'Install Kiro IDE — AI-Powered Development Environment' },
      { type: 'para', text: 'Kiro is an AI-powered IDE built on VS Code. It adds intelligent code generation, spec-driven development, autonomous task execution, and a built-in AI agent that works alongside you in your editor. It is the IDE used by the Meipuratchi team.' },
      { type: 'subheading', text: 'Download & Install' },
      { type: 'step', number: 1, title: 'Download Kiro', text: 'Visit https://kiro.dev and download the installer for your OS. Kiro is available for Windows, macOS, and Linux.' },
      { type: 'step', number: 2, title: 'Install', text: 'Run the installer — it sets up Kiro just like VS Code. All your existing VS Code settings and extensions can be imported.' },
      { type: 'step', number: 3, title: 'Sign In', text: 'Launch Kiro and sign in with your GitHub, Google, or AWS Builder ID account. This unlocks the AI features.' },
      { type: 'step', number: 4, title: 'Open the project', text: 'File → Open Folder → select meipuratchi-mern.' },
      { type: 'subheading', text: 'Key Kiro Features for Interns' },
      { type: 'table', headers: ['Feature', 'What it does'], rows: [
        ['Vibe Mode', 'Chat with Kiro about your code — ask questions, get explanations, debug'],
        ['Spec Mode', 'Break a feature into Requirements → Design → Tasks, then auto-implement'],
        ['Autopilot', 'Kiro reads files, writes code, runs commands end-to-end autonomously'],
        ['Agent Hooks', 'Auto-run linting/tests whenever you save a file'],
        ['Steering Files', '.kiro/steering/*.md — add project rules Kiro always follows'],
        ['Context (#File)', 'Drag a file into chat or type #File to include it in AI context'],
      ]},
      { type: 'subheading', text: 'Using Kiro for this Project' },
      { type: 'list', items: [
        'Open a chat (Vibe session) and ask: "Explain how auth works in this project"',
        'To add a feature: start a Spec session, describe the feature, let Kiro generate tasks',
        'To debug: paste the error message into chat and ask what is wrong',
        'Use #File to include specific files: "Look at #File:backend/routes/auth.js and explain the login flow"',
      ]},
      { type: 'note', text: 'Kiro is built on VS Code so all VS Code extensions work in Kiro. Install the same extensions listed in the VS Code guide.' },
      { type: 'tip', text: 'Ask Kiro to explain any file before editing it. This saves hours of reading unfamiliar code.' },
    ],
  },
  {
    id: 'git-github',
    category: 'tools',
    icon: '🐙',
    title: 'Git & GitHub Workflow',
    readTime: '10 min',
    content: [
      { type: 'heading', text: 'Git & GitHub Workflow' },
      { type: 'para', text: 'All code changes go through Git. We use a branch-based workflow — never commit directly to main.' },
      { type: 'subheading', text: 'Install Git' },
      { type: 'code', lang: 'bash', text: `# Windows: download from https://git-scm.com
# macOS:
brew install git

# Verify
git --version` },
      { type: 'subheading', text: 'Configure Git (first time only)' },
      { type: 'code', lang: 'bash', text: `git config --global user.name "Your Name"
git config --global user.email "you@email.com"
git config --global core.editor "code --wait"` },
      { type: 'subheading', text: 'Daily Workflow' },
      { type: 'code', lang: 'bash', text: `# 1. Always pull latest changes before starting work
git pull origin main

# 2. Create a feature branch
git checkout -b feature/your-feature-name

# 3. Make changes, then stage and commit
git add src/pages/MyPage.jsx
git commit -m "feat: add MyPage component"

# 4. Push your branch
git push -u origin feature/your-feature-name

# 5. Open a Pull Request on GitHub — ask team lead to review` },
      { type: 'subheading', text: 'Commit Message Format' },
      { type: 'table', headers: ['Prefix', 'Use for'], rows: [
        ['feat:', 'New feature or page'],
        ['fix:', 'Bug fix'],
        ['style:', 'CSS / visual changes only'],
        ['refactor:', 'Code restructure (no new feature)'],
        ['docs:', 'Documentation updates'],
        ['chore:', 'Config, build, dependency updates'],
      ]},
      { type: 'warning', text: 'Never force-push to main. Never commit .env files. Always create a new branch for each feature or fix.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  //  MERN STACK — LEARNING
  // ─────────────────────────────────────────────────────────────
  {
    id: 'mern-overview',
    category: 'mern-stack',
    icon: '⚡',
    title: 'MERN Stack — Full Course',
    readTime: '2 hr watch',
    content: [
      { type: 'heading', text: 'MERN Stack — Full Learning Path' },
      { type: 'para', text: 'MERN stands for MongoDB, Express.js, React, Node.js. This is our complete tech stack. Watch the videos below in order for a comprehensive understanding.' },
      { type: 'subheading', text: '🎬 MERN Full Stack Crash Course' },
      { type: 'video', youtubeId: 'J4aMJ53PQsk', title: 'MERN Stack Full Course — MongoDB, Express, React & Node.js', channel: 'Traversy Media', note: 'Start here. Covers the entire MERN stack from scratch — setting up Node/Express API, connecting MongoDB, building React frontend, and deploying.' },
      { type: 'subheading', text: 'What you will learn' },
      { type: 'list', items: [
        '🔷 Node.js: event-driven, non-blocking I/O, npm, modules',
        '🔷 Express.js: routing, middleware, REST API design',
        '🔷 MongoDB: documents, collections, queries, aggregation',
        '🔷 Mongoose: schemas, models, validation, relationships',
        '🔷 React: components, props, state, hooks, routing',
        '🔷 JWT: stateless authentication, token flow',
        '🔷 Full-stack data flow: Frontend → API → DB → Response',
      ]},
      { type: 'subheading', text: 'MERN Stack — Request-Response Flow' },
      { type: 'code', lang: 'bash', text: `User clicks button in React
  → axios.post('/api/auth/login', { email, password })
  → Express router: POST /api/auth/login
  → Middleware: validates input
  → Controller: queries MongoDB via Mongoose
  → MongoDB returns user document
  → Controller: verifies password, creates JWT
  → Response: { token, user }
  → React: saves token to localStorage, redirects` },
      { type: 'note', text: 'Watch the video at 1.25x speed. Pause and type along with every code section — do not just watch.' },
    ],
  },
  {
    id: 'react-learning',
    category: 'mern-stack',
    icon: '⚛️',
    title: 'React — Complete Guide',
    readTime: '3 hr watch',
    content: [
      { type: 'heading', text: 'React — Complete Guide for Beginners' },
      { type: 'para', text: 'React is our frontend library. The project uses React 18 with Vite. Watch this full tutorial to understand components, hooks, state, and routing.' },
      { type: 'subheading', text: '🎬 React Full Course' },
      { type: 'video', youtubeId: '01bEb7R-F4s', title: 'React JS Full Course for Beginners', channel: 'Dave Gray', note: 'Covers React from zero: JSX, components, props, useState, useEffect, useRef, custom hooks, React Router, and fetching data from APIs. Perfect for MERN frontend work.' },
      { type: 'subheading', text: 'React Concepts Used in this Project' },
      { type: 'table', headers: ['Concept', 'Where we use it'], rows: [
        ['useState', 'Form inputs, loading states, toggling modals'],
        ['useEffect', 'Fetch data on mount, auth guard on every protected page'],
        ['useCallback', 'Memoize fetch functions to prevent infinite re-renders'],
        ['useRef', 'OTP input boxes, focus management'],
        ['useNavigate', 'Programmatic redirect after login/logout'],
        ['useLocation', 'Key for AnimatePresence route transitions'],
        ['Props', 'Passing data between parent/child components'],
        ['React Router v6', 'All page routing in App.jsx'],
        ['framer-motion', 'Page transitions and animated components'],
        ['react-hot-toast', 'Toast notifications for success/error messages'],
      ]},
      { type: 'subheading', text: 'Component Anatomy (our pattern)' },
      { type: 'code', lang: 'jsx', text: `// frontend/src/pages/MyPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { API_FUNCTION } from '../api';
import './MyPage.css';

export default function MyPage() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auth guard — redirect if not team member
  useEffect(() => {
    const info = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (!info.role || info.role !== 'team') navigate('/team');
  }, [navigate]);

  // Fetch data on mount
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API_FUNCTION();
        setData(res.data);
      } catch (err) {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="mp-loading">Loading…</div>;

  return (
    <div className="mp-page">
      {data.map(item => (
        <div key={item._id} className="mp-card">
          <h3>{item.title}</h3>
        </div>
      ))}
    </div>
  );
}` },
      { type: 'tip', text: 'Always check localStorage auth at the top of every team/admin page. This prevents unauthorised access even if someone navigates directly to the URL.' },
    ],
  },
  {
    id: 'mongodb-learning',
    category: 'mern-stack',
    icon: '🍃',
    title: 'MongoDB — Complete Guide',
    readTime: '2 hr watch',
    content: [
      { type: 'heading', text: 'MongoDB — Complete Guide' },
      { type: 'para', text: 'MongoDB is our NoSQL database. Data is stored as JSON-like documents in collections. Watch this full tutorial then read the database setup doc.' },
      { type: 'subheading', text: '🎬 MongoDB Full Course' },
      { type: 'video', youtubeId: 'oY-0v7w-Ac8', title: 'MongoDB Full Tutorial — Beginner to Advanced', channel: 'Web Dev Simplified', note: 'Covers: documents vs tables, CRUD operations, queries, aggregation pipeline, indexes, Mongoose ODM, and Atlas cloud setup. Essential before working on backend models.' },
      { type: 'subheading', text: 'MongoDB vs SQL — Key Differences' },
      { type: 'table', headers: ['SQL', 'MongoDB', 'Our usage'], rows: [
        ['Table', 'Collection', 'users, tickets, registrations'],
        ['Row', 'Document', '{ _id, name, email, role }'],
        ['Column', 'Field', 'name, email, createdAt'],
        ['JOIN', 'Populate (Mongoose)', 'ticket.assignee → employee doc'],
        ['Schema', 'Mongoose Schema', 'models/User.js, models/Ticket.js'],
        ['SQL query', 'MongoDB query', 'User.find({ role: "team" })'],
      ]},
      { type: 'subheading', text: 'Our Models (backend/models/)' },
      { type: 'code', lang: 'javascript', text: `// models/User.js — most important model
{
  name, email, phone, password (hashed),
  role: 'student' | 'team' | 'admin',
  teamRole: 'view' | 'manage',
  status: 'submitted' | 'validating' | 'verified' | 'counseled',
  emailVerified: Boolean,
  messages: [{ from, text, read, createdAt }],
  activityLog: [{ action, detail, at }],
}

// models/Ticket.js
{
  title, description, type, status, priority,
  raisedBy, raisedByType, assignee,
  email, phone, deadline, note,
}

// models/Registration.js
{
  name, email, phone, role, school, district,
  standard, stream, careerInterest, skills,
  department, qualification, proofFileUrl,
  status, counselingNotes,
}` },
    ],
  },
  {
    id: 'express-nodejs',
    category: 'mern-stack',
    icon: '🟨',
    title: 'Node.js & Express — Backend Guide',
    readTime: '15 min',
    content: [
      { type: 'heading', text: 'Node.js & Express — Backend Architecture' },
      { type: 'para', text: 'Our backend is a Node.js + Express REST API. Here is how it is structured and how to add new routes.' },
      { type: 'subheading', text: 'Server Entry Point (backend/server.js)' },
      { type: 'code', lang: 'javascript', text: `const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/admin',         require('./routes/admin'));
app.use('/api/tickets',       require('./routes/tickets'));
app.use('/api/registrations', require('./routes/registrations'));
app.use('/api/employees',     require('./routes/employees'));
app.use('/api/content',       require('./routes/content'));

// MongoDB connect
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ DB error:', err));

app.listen(process.env.PORT || 5000, () =>
  console.log('🚀 Server running on port', process.env.PORT || 5000)
);` },
      { type: 'subheading', text: 'Adding a New Route' },
      { type: 'step', number: 1, title: 'Create the route file', text: 'Add backend/routes/myroute.js:' },
      { type: 'code', lang: 'javascript', text: `const express = require('express');
const router  = express.Router();
const { teamAuth } = require('../middleware/auth');
const MyModel = require('../models/MyModel');

// GET all items (team members only)
router.get('/', teamAuth, async (req, res) => {
  try {
    const items = await MyModel.find().sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;` },
      { type: 'step', number: 2, title: 'Register it in server.js', text: "Add: app.use('/api/myroute', require('./routes/myroute'));" },
      { type: 'step', number: 3, title: 'Add to api.js on frontend', text: "Add: export const getMyItems = () => API.get('/myroute');" },
      { type: 'subheading', text: 'Auth Middleware Usage' },
      { type: 'code', lang: 'javascript', text: `const { userAuth, teamAuth, adminAuth, manageAuth } = require('../middleware/auth');

router.get('/public', handler);             // No auth — anyone can access
router.get('/me', userAuth, handler);       // Any logged-in user (student or team)
router.get('/team', teamAuth, handler);     // Team members or admin only
router.post('/edit', manageAuth, handler);  // Team with "manage" role + admin only
router.get('/admin', adminAuth, handler);   // Admin only (x-admin-key header)` },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  //  DATABASE
  // ─────────────────────────────────────────────────────────────
  {
    id: 'mongodb-atlas-setup',
    category: 'database',
    icon: '☁️',
    title: 'MongoDB Atlas — Full Setup',
    readTime: '15 min',
    content: [
      { type: 'heading', text: 'MongoDB Atlas — Cloud Database Setup' },
      { type: 'para', text: 'MongoDB Atlas is the cloud-hosted version of MongoDB. It is free for development (M0 tier) and is what we use for staging and production.' },
      { type: 'subheading', text: 'Step-by-Step Atlas Setup' },
      { type: 'step', number: 1, title: 'Create Account', text: 'Go to https://www.mongodb.com/cloud/atlas/register — register with your email.' },
      { type: 'step', number: 2, title: 'Create Organisation & Project', text: 'After login: Create Organisation (name: Meipuratchi) → Create Project (name: meipuratchi-dev).' },
      { type: 'step', number: 3, title: 'Build a Free Cluster', text: 'Click Build a Database → M0 Free → AWS → Mumbai (ap-south-1) → Cluster name: Cluster0 → Create.' },
      { type: 'step', number: 4, title: 'Create Database User', text: 'Security → Database Access → Add New Database User → Username: meipuratchi-dev, Password: (generate a strong one, save it) → Role: Atlas Admin → Add User.' },
      { type: 'step', number: 5, title: 'Set Network Access', text: 'Security → Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0) for development.' },
      { type: 'warning', text: 'For production, restrict the IP whitelist to only your server\'s IP address. Never leave 0.0.0.0/0 in production.' },
      { type: 'step', number: 6, title: 'Get Connection String', text: 'Clusters → Connect → Connect your application → Driver: Node.js, Version: 5.5 or later → Copy the string:' },
      { type: 'code', lang: 'bash', text: `mongodb+srv://meipuratchi-dev:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0` },
      { type: 'step', number: 7, title: 'Configure in .env', text: 'Replace <password> with your actual password and add the database name:' },
      { type: 'code', lang: 'bash', text: `MONGODB_URI=mongodb+srv://meipuratchi-dev:YourPassword@cluster0.xxxxx.mongodb.net/meipuratchi?retryWrites=true&w=majority` },
      { type: 'subheading', text: 'Using MongoDB Compass with Atlas' },
      { type: 'step', number: 1, title: 'Open Compass', text: 'Launch MongoDB Compass. Click New Connection.' },
      { type: 'step', number: 2, title: 'Paste connection string', text: 'Paste the Atlas connection string (with password filled in). Click Connect.' },
      { type: 'step', number: 3, title: 'Browse data', text: 'You can now browse all collections, run queries, and view documents visually. Essential for debugging data issues.' },
      { type: 'subheading', text: 'Atlas vs Local — When to use which' },
      { type: 'table', headers: ['Scenario', 'Use'], rows: [
        ['Personal feature development', 'Local MongoDB — faster, no internet needed'],
        ['Team testing / staging', 'Atlas M0 free cluster'],
        ['Production', 'Atlas M10+ paid cluster with backups'],
        ['Testing with real data', 'Atlas (shared with team lead)'],
        ['CI/CD pipelines', 'Atlas (accessible from any server)'],
      ]},
    ],
  },
  {
    id: 'mongodb-queries',
    category: 'database',
    icon: '🔍',
    title: 'MongoDB Queries Cheatsheet',
    readTime: '10 min',
    content: [
      { type: 'heading', text: 'MongoDB Queries — Cheatsheet' },
      { type: 'para', text: 'Common MongoDB/Mongoose queries used in this project. Bookmark this page.' },
      { type: 'subheading', text: 'Basic CRUD' },
      { type: 'code', lang: 'javascript', text: `const User = require('./models/User');

// CREATE
const user = new User({ name: 'Priya', email: 'priya@example.com' });
await user.save();
// or shorthand:
await User.create({ name: 'Priya', email: 'priya@example.com' });

// READ — find all
const users = await User.find();

// READ — with filter
const teamMembers = await User.find({ role: 'team' });

// READ — one document
const user = await User.findById(id);
const user = await User.findOne({ email: 'priya@example.com' });

// UPDATE
await User.findByIdAndUpdate(id, { status: 'verified' }, { new: true });

// DELETE
await User.findByIdAndDelete(id);` },
      { type: 'subheading', text: 'Filtering, Sorting, Pagination' },
      { type: 'code', lang: 'javascript', text: `// Sort by newest first
await User.find().sort({ createdAt: -1 });

// Select only specific fields
await User.find().select('name email role');

// Exclude a field
await User.find().select('-password');

// Pagination
const page  = 1;
const limit = 15;
await User.find().skip((page - 1) * limit).limit(limit);

// Count total
const total = await User.countDocuments({ role: 'student' });` },
      { type: 'subheading', text: 'Search (regex)' },
      { type: 'code', lang: 'javascript', text: `// Case-insensitive search on name or email
const query = 'priya';
await User.find({
  $or: [
    { name:  { $regex: query, $options: 'i' } },
    { email: { $regex: query, $options: 'i' } },
  ]
});` },
      { type: 'subheading', text: 'Push to array (messages, logs)' },
      { type: 'code', lang: 'javascript', text: `// Push a message to user.messages array
await User.findByIdAndUpdate(userId, {
  $push: {
    messages: {
      $each: [{ from: 'admin', text: 'Your registration is approved!' }],
      $slice: -100, // keep last 100 messages only
    }
  }
});` },
    ],
  },
  // ─────────────────────────────────────────────────────────────
  //  PROJECT GUIDE
  // ─────────────────────────────────────────────────────────────
  {
    id: 'project-structure',
    category: 'project',
    icon: '📁',
    title: 'Project Structure Deep Dive',
    readTime: '15 min',
    content: [
      { type: 'heading', text: 'Project Structure — Deep Dive' },
      { type: 'para', text: 'Understanding the folder structure is the first step to contributing confidently. Here is every important file and what it does.' },
      { type: 'subheading', text: 'Backend Structure' },
      { type: 'code', lang: 'bash', text: `backend/
├── server.js              ← Express app entry point, all middleware, DB connect
├── loadbalancer.js        ← Cluster-based load balancer (multi-core)
├── .env.example           ← Template for environment variables
│
├── models/                ← Mongoose schemas (database structure)
│   ├── User.js            ← Students, team members, admins
│   ├── Ticket.js          ← Support/task tickets
│   ├── Registration.js    ← Student registrations with status tracking
│   ├── Career.js          ← Career listings
│   ├── Contact.js         ← Contact form submissions
│   ├── Employee.js        ← Employee profiles (separate from User)
│   ├── OTP.js             ← Temporary OTP storage (TTL-indexed)
│   ├── SiteContent.js     ← CMS content blocks
│   ├── SiteTheme.js       ← Dynamic theme settings
│   └── Volunteer.js       ← Volunteer applications
│
├── routes/                ← Express route handlers
│   ├── auth.js            ← Login, register, OTP, forgot-password
│   ├── admin.js           ← Admin-only: user management, broadcast
│   ├── tickets.js         ← Ticket CRUD + org-key verify
│   ├── registrations.js   ← Registration CRUD + status updates
│   ├── employees.js       ← Employee management
│   ├── careers.js         ← Career listings CRUD
│   ├── contacts.js        ← Contact form submissions
│   ├── content.js         ← CMS content management
│   ├── volunteers.js      ← Volunteer applications
│   └── upload.js          ← Google Drive file upload
│
├── middleware/
│   └── auth.js            ← JWT auth guards (userAuth, teamAuth, adminAuth, manageAuth)
│
└── utils/
    ├── emailService.js    ← SendGrid email: OTP, welcome, broadcast
    └── driveUpload.js     ← Google Drive upload helper` },
      { type: 'subheading', text: 'Frontend Structure' },
      { type: 'code', lang: 'bash', text: `frontend/src/
├── App.jsx                ← All routes, layout wrappers
├── api.js                 ← Axios instance + all API call exports
├── config.js              ← VITE_API_URL export
├── index.css              ← Global CSS variables, Poppins font, utilities
├── main.jsx               ← React 18 entry point
│
├── hooks/
│   ├── useCMS.js          ← Fetches CMS content by pageId (cached)
│   └── useMobile.js       ← Detects mobile screen size
│
├── utils/
│   └── mobileScrollFix.js ← iOS momentum scroll fix
│
├── components/            ← Shared UI components
│   ├── Navbar.jsx/css     ← Global navigation bar
│   ├── Footer.jsx/css     ← Global footer
│   ├── AppPreloader.jsx   ← Initial loading screen
│   ├── AnimatedBackground.jsx ← Hero section particles
│   ├── PageTransition.jsx ← Framer-motion page wrapper
│   ├── ScrollProgress.jsx ← Reading progress bar at top
│   └── ScrollToTop.jsx    ← Auto-scroll to top on navigation
│
└── pages/
    ├── Home.jsx           ← Landing page with hero, stats, sections
    ├── Registration.jsx   ← Student registration form
    ├── Engineering.jsx    ← Engineering guidance page
    ├── Paramedical.jsx    ← Paramedical courses page
    ├── Contact.jsx        ← Contact form
    ├── Team.jsx           ← Our team page
    │
    ├── UserLogin.jsx      ← Student login (2-step OTP)
    ├── UserRegister.jsx   ← Student registration
    ├── UserPortal.jsx     ← Protected student dashboard
    │
    ├── TeamLogin.jsx      ← Employee/intern login
    ├── TeamDashboard.jsx  ← Protected team member dashboard
    │
    ├── AdminLogin.jsx     ← Admin login
    ├── AdminDashboard.jsx ← Protected admin panel
    ├── AdminCMS.jsx       ← CMS content editor
    │
    ├── Tickets.jsx        ← Org-key gated ticket viewer
    ├── MeiDocs.jsx        ← This docs portal (you are here!)
    └── TakeYouForward.jsx ← Course & exam discovery page` },
      { type: 'subheading', text: 'Naming Conventions' },
      { type: 'table', headers: ['Item', 'Convention', 'Example'], rows: [
        ['React components', 'PascalCase', 'MyComponent.jsx'],
        ['CSS files', 'Same name as component', 'MyComponent.css'],
        ['API functions', 'camelCase verb + noun', 'getTickets, submitRegistration'],
        ['Backend routes', 'kebab-case plural', '/api/registrations, /api/tickets'],
        ['Mongoose models', 'PascalCase singular', 'User, Ticket, Registration'],
        ['MongoDB collections', 'lowercase plural (auto)', 'users, tickets, registrations'],
        ['CSS classes', 'component prefix + descriptor', '.tkt-card, .td-header, .md-sidebar'],
        ['env variables', 'UPPER_SNAKE_CASE', 'MONGODB_URI, JWT_SECRET'],
      ]},
    ],
  },
  {
    id: 'auth-flow',
    category: 'project',
    icon: '🔐',
    title: 'Authentication Flow',
    readTime: '12 min',
    content: [
      { type: 'heading', text: 'Authentication Flow — Complete Guide' },
      { type: 'para', text: 'Meipuratchi uses a 2-step login: password verification → email OTP → JWT token. Understanding this is essential before working on any protected page.' },
      { type: 'subheading', text: 'Login Flow (Step by Step)' },
      { type: 'step', number: 1, title: 'User enters email + password', text: 'Frontend calls POST /api/auth/login with { identifier, password }.' },
      { type: 'step', number: 2, title: 'Server verifies password', text: 'Backend finds user by email/phone. Compares bcrypt hash. If wrong → 400 error.' },
      { type: 'step', number: 3, title: 'OTP generated & emailed', text: 'Server generates 6-digit OTP, saves it to OTP collection (10-minute TTL), sends to user\'s email.' },
      { type: 'step', number: 4, title: 'Frontend shows OTP input', text: 'Response: { requiresOTP: true, maskedEmail, userId }. React shows 6-box OTP input.' },
      { type: 'step', number: 5, title: 'User enters OTP', text: 'Frontend calls POST /api/auth/login/verify-otp with { userId, code }.' },
      { type: 'step', number: 6, title: 'Server validates OTP', text: 'Checks OTP in DB (max 5 attempts). If correct → marks used → creates JWT (7-day expiry).' },
      { type: 'step', number: 7, title: 'Token stored', text: 'Frontend receives { token, user }. Saves: localStorage.setItem("userToken", token) + localStorage.setItem("userInfo", JSON.stringify(user)). Redirects.' },
      { type: 'subheading', text: 'JWT Token Contents' },
      { type: 'code', lang: 'javascript', text: `// Decoded JWT payload
{
  id: "64abc123...",       // MongoDB _id
  role: "team",            // "student" | "team" | "admin"
  name: "Priya Kumar",     // display name
  teamRole: "manage",      // "view" | "manage" (team only) or null
  iat: 1720000000,         // issued at (Unix timestamp)
  exp: 1720604800,         // expires at (7 days later)
}` },
      { type: 'subheading', text: 'Protecting a New Page (intern pattern)' },
      { type: 'code', lang: 'jsx', text: `// At the top of every team-only page
useEffect(() => {
  const info = JSON.parse(localStorage.getItem('userInfo') || '{}');
  if (!info.role || info.role !== 'team') {
    navigate('/team');  // redirect to team login
  }
}, [navigate]);` },
      { type: 'subheading', text: 'Making Authenticated API Calls' },
      { type: 'code', lang: 'javascript', text: `// Method 1 — use the API axios instance (auto-attaches token)
import { someApiFunction } from '../api';
const res = await someApiFunction();  // Bearer token auto-added

// Method 2 — direct axios with manual header
import axios from 'axios';
const token = localStorage.getItem('userToken');
const res = await axios.get('http://localhost:5000/api/admin/users', {
  headers: { Authorization: \`Bearer \${token}\` }
});` },
      { type: 'warning', text: 'Never expose the JWT_SECRET or ADMIN_KEY. Do not hardcode tokens in the frontend. Always read from localStorage.' },
    ],
  },
  {
    id: 'tickets-guide',
    category: 'project',
    icon: '🎫',
    title: 'Tickets System Guide',
    readTime: '8 min',
    content: [
      { type: 'heading', text: 'Tickets System — How It Works' },
      { type: 'para', text: 'The Tickets system at /tickets is your primary task management tool. This guide explains how to use it and how it is built.' },
      { type: 'subheading', text: 'Accessing Tickets' },
      { type: 'list', items: [
        'Navigate to /tickets on the site',
        'Enter the organisation access key (same key used for meiDocs)',
        'You can now see all tickets assigned to your organisation',
      ]},
      { type: 'subheading', text: 'Ticket Types' },
      { type: 'table', headers: ['Type', 'Icon', 'Use for'], rows: [
        ['support', '🛟', 'Help requests from students or team'],
        ['task', '📋', 'Development tasks for interns'],
        ['bug', '🐛', 'Bug reports needing a fix'],
        ['query', '❓', 'Questions needing an answer'],
        ['other', '📌', 'Anything else'],
      ]},
      { type: 'subheading', text: 'Priority Levels' },
      { type: 'table', headers: ['Priority', 'Color', 'Meaning'], rows: [
        ['low', 'Green', 'Nice to have, no rush'],
        ['medium', 'Amber', 'Should be done this week'],
        ['high', 'Red', 'Needs attention today'],
        ['urgent', 'Dark Red', 'Stop everything, fix this now'],
      ]},
      { type: 'subheading', text: 'Workflow for Interns' },
      { type: 'step', number: 1, title: 'Pick a task', text: 'Filter by Status: Open and look for tasks assigned to you or unassigned. Check with team lead before self-assigning.' },
      { type: 'step', number: 2, title: 'Start working', text: 'Team lead will change status to "in-progress" once you start. If you have manage role you can do this yourself.' },
      { type: 'step', number: 3, title: 'Complete and submit PR', text: 'Push your changes to a feature branch on GitHub. Open a PR and link the ticket number in the PR description.' },
      { type: 'step', number: 4, title: 'Mark resolved', text: 'After PR is merged, the ticket is moved to "resolved". If confirmed working, it is moved to "closed".' },
      { type: 'note', text: 'The same org key used to access this meiDocs portal also unlocks the Tickets page. Keep it safe.' },
    ],
  },
];

export default DOCS;
