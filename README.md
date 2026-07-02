# HeritageCare - Full Stack Application

A comprehensive web application for architectural heritage condition monitoring and maintenance scheduling.

## Project Structure

```
HeritageCare-FullStack/
├── backend/                    # Node.js Express backend
│   ├── models/                # MongoDB schemas
│   ├── controllers/           # Business logic
│   ├── routes/                # API endpoints
│   ├── middleware/            # Auth & error handling
│   ├── config/                # Database configuration
│   ├── server.js              # Main server file
│   ├── package.json
│   └── .env.example           # Environment template
│
└── frontend/                   # React frontend
    ├── src/
    │   ├── components/        # Reusable React components
    │   ├── pages/            # Page components
    │   ├── context/          # Auth context
    │   ├── utils/            # API calls & helpers
    │   ├── styles/           # CSS files
    │   ├── App.js            # Main app component
    │   └── index.js          # Entry point
    ├── public/
    ├── package.json
    └── .gitignore
```

## Features

- 📊 **Dashboard** - Real-time condition monitoring statistics
- 🏛️ **Building Registry** - Comprehensive heritage site database
- 📋 **Inspections** - Structured condition assessment with scoring
- 🔧 **Maintenance Tasks** - Kanban-style task management
- 🔔 **Alerts** - Automatic critical condition notifications
- 📈 **History** - Condition trends over time
- 📄 **Reports** - Generate compliance and status reports
- 🔐 **Authentication** - Role-based access control

## Tech Stack

### Backend
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator
- **Password Hashing**: bcryptjs

### Frontend
- **Library**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Styling**: CSS3

## Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from template:
```bash
cp .env.example .env
```

4. Update `.env` with your values:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/heritagecare
NODE_ENV=development
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
```

5. Start MongoDB (if running locally):
```bash
mongod
```

6. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will open on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Buildings
- `GET /api/buildings` - Get all buildings
- `POST /api/buildings` - Create building (admin only)
- `GET /api/buildings/:id` - Get building details
- `PUT /api/buildings/:id` - Update building
- `DELETE /api/buildings/:id` - Delete building
- `GET /api/buildings/stats` - Get statistics

### Inspections
- `GET /api/inspections` - Get all inspections
- `POST /api/inspections` - Submit inspection
- `GET /api/inspections/:id` - Get inspection details
- `GET /api/inspections/building/:buildingId` - Get building history

### Maintenance Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task
- `PATCH /api/tasks/:id/complete` - Mark task complete
- `DELETE /api/tasks/:id` - Delete task

### Alerts
- `GET /api/alerts` - Get all alerts
- `GET /api/alerts/:id` - Get alert details
- `PATCH /api/alerts/:id/resolve` - Resolve alert
- `GET /api/alerts/building/:buildingId` - Get building alerts

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics
- `GET /api/dashboard/trend` - Get portfolio trend

## Default Credentials

For demo purposes, you can use:
- Email: `admin@example.com`
- Password: `password`

Create additional users through the registration endpoint.

## Data Models

### User
- Full name, email, password (hashed)
- Role: admin, inspector, officer, viewer
- Department, phone, avatar
- Timestamps, last login

### Building
- Registration number (DSM-HB-XXX)
- Name, location, historical style
- Composite score, status
- Score history with inspector
- Alerts and tasks counts

### Inspection
- Building reference, inspector
- Element ratings (roof, walls, windows, foundation, interior, services)
- Calculated composite score
- Weather conditions, notes
- Status: draft, submitted, approved

### MaintenanceTask
- Building reference, title, description
- Priority level (low, medium, high)
- Status: pending, in-progress, completed
- Assigned officer, due date
- Estimated/actual cost

### Alert
- Building reference, severity (critical, warning, info)
- Type: condition_score_drop, threshold_breach, etc.
- Resolved status and notes
- Notification history

## Environment Configuration

Create a `.env` file in the backend directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/heritagecare

# JWT
JWT_SECRET=your_very_secure_secret_key_change_this_in_production
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:3000
```

## Development Tips

1. **Hot Reload**: Both frontend and backend support hot reload with nodemon and react-scripts
2. **API Testing**: Use Postman or curl to test API endpoints
3. **MongoDB Query**: Use MongoDB Compass for visual database management
4. **Debugging**: Check browser console and network tab for frontend issues

## Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use a process manager like PM2
3. Set up MongoDB Atlas for cloud database
4. Use environment variables for sensitive data
5. Deploy to services like Heroku, AWS, or DigitalOcean

### Frontend
1. Build production bundle: `npm run build`
2. Deploy to Netlify, Vercel, or AWS S3
3. Configure API base URL for production

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

ISC

## Support

For issues or questions, contact the development team.
