# ⚡ Quick Commands Reference

## 🚀 Start Application

### **Backend:**
```bash
cd c:\Users\acer\Downloads\meiApp\meipuratchi-mern\backend
node server.js
```

### **Frontend (Desktop):**
```bash
cd c:\Users\acer\Downloads\meiApp\meipuratchi-mern\frontend
npm run dev
```

### **Frontend (Mobile - Network Access):**
```bash
cd c:\Users\acer\Downloads\meiApp\meipuratchi-mern\frontend
npm run dev -- --host
```

---

## 📱 Test on Android Phone

### **1. Find Your IP:**
```bash
ipconfig
```
Look for IPv4 Address (e.g., `192.168.1.100`)

### **2. Start with Network Access:**
```bash
cd frontend
npm run dev -- --host
```

### **3. Open on Phone:**
- Connect to same WiFi
- Open Chrome
- Go to: `http://YOUR_IP:5173`

---

## 🔧 Build & Deploy

### **Build Frontend:**
```bash
cd frontend
npm run build
```

### **Preview Production:**
```bash
cd frontend
npm run preview
```

### **Install Dependencies:**
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

---

## 🧪 Testing

### **Check Build:**
```bash
cd frontend
npm run build
```

### **Run Linter:**
```bash
cd frontend
npm run lint
```

### **Type Check:**
```bash
cd frontend
npm run type-check
```

---

## 📊 Useful Commands

### **Clear Cache:**
```bash
cd frontend
rm -rf node_modules
rm package-lock.json
npm install
```

### **Update Dependencies:**
```bash
cd frontend
npm update
```

### **Check Port Usage:**
```bash
netstat -ano | findstr :5173
netstat -ano | findstr :5000
```

---

## 🎯 Access URLs

- **Frontend (Local):** http://localhost:5173
- **Frontend (Network):** http://YOUR_IP:5173
- **Backend API:** http://localhost:5000
- **MongoDB:** mongodb://localhost:27017

---

## 📱 Mobile Testing

### **Chrome DevTools:**
1. Press `F12`
2. Press `Ctrl+Shift+M`
3. Select device (Pixel 5, Galaxy S20)

### **Remote Debugging:**
1. Connect phone via USB
2. Enable USB debugging
3. Go to `chrome://inspect`
4. Click "Inspect"

---

## 🔥 Quick Fixes

### **Port Already in Use:**
```bash
# Kill process on port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### **Clear Vite Cache:**
```bash
cd frontend
rm -rf node_modules/.vite
npm run dev
```

### **Reset Everything:**
```bash
cd frontend
rm -rf node_modules dist .vite
npm install
npm run dev
```

---

## 📚 Documentation

- **ANDROID_SETUP_GUIDE.md** - Complete Android setup
- **MOBILE_TESTING_GUIDE.md** - Testing guide
- **ANIMATIONS_GUIDE.md** - Animation docs
- **README_MOBILE.md** - Mobile overview

---

## ⚡ One-Line Starters

### **Full Stack (Two Terminals):**

**Terminal 1:**
```bash
cd c:\Users\acer\Downloads\meiApp\meipuratchi-mern\backend & node server.js
```

**Terminal 2:**
```bash
cd c:\Users\acer\Downloads\meiApp\meipuratchi-mern\frontend & npm run dev -- --host
```

---

## 🎉 That's It!

**Most Common Command:**
```bash
cd frontend
npm run dev -- --host
```

**Then open on phone:** `http://YOUR_IP:5173`

**Happy Coding! 🚀**
