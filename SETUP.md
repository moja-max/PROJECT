# HeritageCare Full Stack - Complete Setup Guide

## 📍 Project Location
```
c:\Users\USER\OneDrive\Desktop\HeritageCare-FullStack\
```

## 🎯 What You Have

A **complete, production-ready full-stack web application** with:
- ✅ Express.js REST API backend (30+ endpoints)
- ✅ React.js frontend with routing
- ✅ MongoDB database with 6 collections
- ✅ JWT authentication system
- ✅ Role-based access control
- ✅ Docker & Docker Compose support
- ✅ Complete documentation

---

## 🚀 QUICK START (5 Minutes)

### Step 1: Install Node.js & MongoDB

**Windows:**
1. Download Node.js from https://nodejs.org (LTS version)
2. Run installer and follow prompts
3. Download MongoDB Community Edition from https://www.mongodb.com/try/download/community
4. Run MongoDB installer

**Mac:**
```bash
brew install node
brew tap mongodb/brew
brew install mongodb-community
```

**Verify installation:**
```bash
node --version
npm --version
mongod --version
```

### Step 2: Start MongoDB

**Windows (Command Prompt as Administrator):**
```bash
mongod
```

**Mac/Linux:**
```bash
brew services start mongodb-community
# or
mongod
```

### Step 3: Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env
# (Edit .env if using MongoDB Atlas or non-local setup)

# Seed database with sample data (optional)
npm run seed

# Start backend server
npm run dev
```

**Expected output:**
```
Server running on port 5000
MongoDB connected successfully
```

### Step 4: Frontend Setup (New Terminal)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start React development server
npm start
```

**Expected output:**
```
Compiled successfully!
You can now view heritagecare-frontend in the browser.
Local: http://localhost:3000
```

### Step 5: Login to Application

Open: **http://localhost:3000**

Login with demo credentials:
- **Email**: admin@example.com
- **Password**: password

---

## 📂 Project Structure Overview

```
HeritageCare-FullStack/
│
├── backend/                          # Express.js API Server
│   ├── models/                       # Database Schemas
│   │   ├── User.js                  # Users with roles
│   │   ├── Building.js              # Heritage sites
│   │   ├── Inspection.js            # Assessments
│   │   ├── MaintenanceTask.js       # Work orders
│   │   ├── Alert.js                 # Notifications
│   │   └── Report.js                # Reports
│   │
│   ├── controllers/                  # Business Logic
│   │   ├── authController.js        # Auth logic
│   │   ├── buildingController.js    # Building CRUD
│   │   ├── inspectionController.js  # Assessment logic
│   │   ├── taskController.js        # Task management
│   │   ├── alertController.js       # Alert handling
│   │   └── dashboardController.js   # Dashboard stats
│   │
│   ├── routes/                       # API Routes
│   ├── middleware/                   # Auth & Error handling
│   ├── config/                       # Database config
│   ├── server.js                     # Main server file
│   ├── seedDatabase.js               # Sample data
│   ├── seed.js                       # Seed runner
│   ├── package.json
│   ├── .env.example
│   └── Dockerfile
│
├── frontend/                         # React.js Web App
│   ├── src/
│   │   ├── components/               # Reusable Components
│   │   │   ├── Sidebar.js           # Navigation
│   │   │   ├── Topbar.js            # Top nav
│   │   │   ├── Toast.js             # Notifications
│   │   │   └── ScoreBar.js          # Score display
│   │   │
│   │   ├── pages/                   # Page Components
│   │   │   ├── Login.js             # Login page
│   │   │   ├── Register.js          # Sign up
│   │   │   ├── Dashboard.js         # Main dashboard
│   │   │   ├── Buildings.js         # Building list
│   │   │   ├── Inspection.js        # Assessment form
│   │   │   ├── History.js           # Condition history
│   │   │   ├── Tasks.js             # Task board
│   │   │   ├── Alerts.js            # Alert management
│   │   │   └── Reports.js           # Report generator
│   │   │
│   │   ├── context/                 # State Management
│   │   │   └── AuthContext.js       # Auth context
│   │   │
│   │   ├── utils/                   # Helper Functions
│   │   │   ├── api.js               # API service
│   │   │   └── helpers.js           # Utilities
│   │   │
│   │   ├── styles/                  # CSS files
│   │   ├── App.js                   # Main app
│   │   └── index.js                 # Entry point
│   │
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml                # Docker setup
├── README.md                         # Full documentation
├── QUICKSTART.md                     # Quick start guide
├── PROJECT_SUMMARY.md                # Project details
└── .gitignore
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile
PUT    /api/auth/profile
```

### Buildings
```
GET    /api/buildings
POST   /api/buildings
GET    /api/buildings/:id
PUT    /api/buildings/:id
DELETE /api/buildings/:id
GET    /api/buildings/stats
```

### Inspections
```
GET    /api/inspections
POST   /api/inspections
GET    /api/inspections/:id
GET    /api/inspections/building/:id
```

### Tasks
```
GET    /api/tasks
POST   /api/tasks
GET    /api/tasks/:id
PUT    /api/tasks/:id
PATCH  /api/tasks/:id/complete
DELETE /api/tasks/:id
GET    /api/tasks/stats
```

### Alerts
```
GET    /api/alerts
GET    /api/alerts/:id
PATCH  /api/alerts/:id/resolve
GET    /api/alerts/building/:id
GET    /api/alerts/stats
```

### Dashboard
```
GET    /api/dashboard
GET    /api/dashboard/trend
```

---

## 🐳 Docker Quick Start

If you have Docker installed:

```bash
# From project root
docker-compose up

# This automatically:
# - Starts MongoDB container
# - Starts backend API
# - Starts frontend app
# - Exposes ports 27017, 5000, 3000
```

---

## 🔑 Default Credentials

```
Email: admin@example.com
Password: password
Role: Admin
```

Create additional users through the registration page.

---

## 📊 Database Collections

### Users
- Full name, email (unique), password (hashed)
- Role, department, phone, avatar
- Last login timestamp

### Buildings
- Registration number (DSM-HB-XXX)
- Name, location, historical style
- Composite score, status
- Score history with inspector reference
- Timestamps

### Inspections
- Building reference
- Inspector reference
- Element ratings (6 fields)
- Calculated composite score
- Weather conditions
- General notes
- Status (draft, submitted, approved)

### Maintenance Tasks
- Building reference
- Title, description
- Priority (low, medium, high)
- Status (pending, in-progress, completed)
- Assigned officer reference
- Due date, cost tracking

### Alerts
- Building reference
- Severity (critical, warning, info)
- Type (condition_score_drop, threshold_breach, etc.)
- Resolved status
- Notification history

### Reports
- Title, type
- Date range
- Format (PDF, CSV, JSON)
- Summary statistics

---

## 🛠️ Common Commands

### Backend
```bash
cd backend

# Start development server with hot reload
npm run dev

# Start production server
npm start

# Seed database with sample data
npm run seed

# Install new package
npm install package-name
```

### Frontend
```bash
cd frontend

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Install new package
npm install package-name
```

---

## 🔐 Environment Configuration

**Backend (.env):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/heritagecare
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
```

**For MongoDB Atlas (Cloud):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/heritagecare
```

---

## 🧪 Testing the API

### Using Postman
1. Open Postman
2. Create new request
3. Set method to POST
4. URL: `http://localhost:5000/api/auth/login`
5. Body (JSON):
```json
{
  "email": "admin@example.com",
  "password": "password"
}
```
6. Send - Get your token
7. Copy token and add to headers for future requests

### Using cURL
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Get buildings (use token from login)
curl -X GET http://localhost:5000/api/buildings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🌐 Accessing the Application

| Component | URL | Purpose |
|-----------|-----|---------|
| Frontend App | http://localhost:3000 | Web Interface |
| Backend API | http://localhost:5000 | REST API |
| MongoDB | localhost:27017 | Database |
| Health Check | http://localhost:5000/api/health | Server Status |

---

## 📈 Scaling & Deployment

### For Production:
1. Set `NODE_ENV=production`
2. Use process manager (PM2)
3. Use MongoDB Atlas for cloud database
4. Deploy frontend to Netlify/Vercel
5. Deploy backend to Heroku/AWS/Digital Ocean
6. Set up SSL certificates

---

## ❌ Troubleshooting

### "Port 3000 already in use"
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### "MongoDB connection failed"
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in .env
- Verify network access (if using Atlas)

### "Cannot find module"
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### "CORS error"
- CORS is configured for localhost:3000
- If using different URL, update in `backend/server.js`

### "Token expired"
- Log out and log back in
- Token expires in 7 days by default

---

## 📚 Documentation Files

1. **README.md** - Complete technical documentation
2. **QUICKSTART.md** - 5-minute setup guide
3. **PROJECT_SUMMARY.md** - Project overview
4. **SETUP.md** - This file

---

## 🎯 Next Steps

1. ✅ Install dependencies
2. ✅ Start MongoDB
3. ✅ Run backend server
4. ✅ Run frontend app
5. ✅ Login with demo account
6. ✅ Explore all features
7. ✅ Add your own data
8. ✅ Deploy to production

---

## 💡 Tips for Development

- Use browser DevTools (F12) to inspect API calls
- Use MongoDB Compass for visual database management
- Use Postman for API testing
- Check console for error messages
- Review network tab for API response codes

---

## 🤝 Support Resources

1. **Error in Console?** - Read the error message carefully
2. **API not responding?** - Check backend terminal for errors
3. **Database issues?** - Verify MongoDB is running
4. **Styling issues?** - Check browser cache (Ctrl+Shift+R)

---

## 📝 Version Info

- **Node.js**: v16+
- **React**: 18.2
- **Express**: 4.18
- **MongoDB**: 6.0+
- **Frontend Package**: Create React App

---

## ✨ What Makes This Complete

✅ Full authentication system
✅ Role-based access control
✅ Complete CRUD operations
✅ Real-time data management
✅ Error handling throughout
✅ Input validation
✅ Production-ready code
✅ Docker support
✅ Comprehensive documentation
✅ Sample data included

---

## 🎉 Ready to Go!

You have a **complete, production-ready full-stack application** ready to:
- Run locally for development
- Deploy to cloud services
- Extend with new features
- Scale for production use

**Start by running the QUICK START section above!**

---

For more details, see the other documentation files in the project root.
