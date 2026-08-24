const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB, sequelize } = require('./src/config/db');

// Load models and associations
require('./src/models');

const app = express();

// =========================
// Middleware
// =========================

app.use(cors());

app.use(express.json());

// =========================
// Routes
// =========================

const authRoutes = require('./src/routes/authRoutes');
const memberRoutes = require('./src/routes/memberRoutes');
const officerRoutes = require('./src/routes/officerRoutes');
const donationRoutes = require('./src/routes/donationRoutes');
const announcementRoutes = require('./src/routes/announcementRoutes');
const expenseRoutes = require('./src/routes/expenseRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/officers', officerRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/dashboard', dashboardRoutes);

// =========================
// Health Check
// =========================

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API is running successfully'
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy'
  });
});

// =========================
// 404 Handler
// =========================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// =========================
// Error Handler
// =========================

app.use((err, req, res, next) => {
  console.error('Server Error:', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// =========================
// Server
// =========================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to PostgreSQL
    await connectDB();

    // Sync Sequelize models
    // For deployment, avoid alter: true
    await sequelize.sync();

    console.log('Database synced successfully.');

    // Start Express server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Port: ${PORT}`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();