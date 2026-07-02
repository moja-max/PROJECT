# Quick Start Guide - HeritageCare

## 🚀 Getting Started in 5 Minutes

### 1. **Prerequisites**
Ensure you have installed:
- Node.js (v16 or higher)
- MongoDB (local or cloud - Atlas)
- npm or yarn

### 2. **Clone/Extract the Project**
```bash
cd HeritageCare-FullStack
```

### 3. **Backend Setup**

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your settings (or use defaults for local dev)
# IMPORTANT: Update MONGODB_URI if using MongoDB Atlas

# Start MongoDB (if running locally)
mongod

# In a new terminal, start the backend
npm run dev
```

The backend will be available at: `http://localhost:5000`

### 4. **Frontend Setup** (in a new terminal)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the React app
npm start
```

The frontend will automatically open at: `http://localhost:3000`

### 5. **Login with Demo Account**
```
Email: admin@example.com
Password: password
```

## 📊 Features to Try

1. **Dashboard** - View overall portfolio statistics
2. **Buildings** - Browse the heritage building registry
3. **Inspections** - Submit a new condition assessment
4. **Tasks** - Manage maintenance work
5. **Alerts** - Check critical condition notifications

## 🗄️ MongoDB Setup

### Option A: Local MongoDB
```bash
# Windows
mongod

# Mac/Linux
brew services start mongodb-community
```

### Option B: MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Copy the connection string
4. Add to `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/heritagecare
   ```

## 🐳 Docker Setup (Optional)

If you have Docker installed:

```bash
# From the project root
docker-compose up

# This starts:
# - MongoDB on port 27017
# - Backend on port 5000
# - Frontend on port 3000
```

## 🔧 API Base URL

The frontend expects the backend at `http://localhost:5000/api`

If you need to change it, update in `frontend/src/utils/api.js`:
```javascript
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';
```

## 📁 Project Structure

```
HeritageCare-FullStack/
├── backend/          # Express + MongoDB API
├── frontend/         # React web application
├── README.md         # Full documentation
├── docker-compose.yml
└── .gitignore
```

## 🧪 Testing the API

### Using Postman or cURL

1. **Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
```

2. **Get Buildings**
```bash
curl -X GET http://localhost:5000/api/buildings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## ❌ Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9

# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9
```

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in `.env`
- Verify network access (if using Atlas)

### CORS Error
- Backend CORS is set to allow localhost:3000
- Update `backend/server.js` if using different frontend port

### Dependencies Not Installing
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## 📚 Documentation

See `README.md` for:
- Complete API documentation
- Data model details
- Production deployment guide
- Environment configuration

## 🎯 Next Steps

1. Explore the dashboard
2. Add sample buildings
3. Submit inspections
4. Create maintenance tasks
5. Review alerts

## 💡 Tips

- **Hot Reload**: Both frontend and backend auto-reload on file changes
- **Inspect Network**: Use browser DevTools to see API calls
- **Database Browser**: Use MongoDB Compass to view data
- **API Testing**: Use Postman for API endpoint testing

## 📞 Support

For issues or questions:
1. Check the error message in terminal/console
2. Review `README.md` for detailed documentation
3. Check MongoDB connection
4. Verify all dependencies are installed

---

**Happy Testing!** 🎉
