const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const skillRoutes = require('./routes/skillRoutes');
const progressRoutes = require('./routes/progressRoutes');
const goalRoutes = require('./routes/goalRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Middleware imports
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

dotenv.config();

// Connect Database
connectDB();

const app = express();

// Middleware
// Relaxed CORS for production to ensure Vercel can connect easily
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:4200',
  'https://skill-tarcker.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // Check if origin is allowed or is a subdomain of vercel.app
    if (allowedOrigins.includes(origin) || (origin.endsWith('.vercel.app') && origin.includes('skill-tarcker'))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

const path = require('path');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist/frontend/browser')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'frontend', 'browser', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
