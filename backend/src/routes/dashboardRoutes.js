const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', getDashboardStats);

module.exports = router;
