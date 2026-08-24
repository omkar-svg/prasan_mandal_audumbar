const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB, sequelize } = require('./src/config/db');
require('./src/models'); // Load models and associations

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
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

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  
  // Sync database (in production you would use migrations)
  await sequelize.sync({ alter: true });
  console.log('Database synced.');

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
