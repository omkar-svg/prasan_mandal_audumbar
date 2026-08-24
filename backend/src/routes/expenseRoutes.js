const express = require('express');
const router = express.Router();
const { getExpenses, createExpense, updateExpense, deleteExpense } = require('../controllers/expenseController');
const { authMiddleware, adminMiddleware, passcodeMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', getExpenses); // All authenticated roles can read
router.post('/', adminMiddleware, createExpense); // Admin only
router.put('/:id', adminMiddleware, passcodeMiddleware, updateExpense); // Admin + Passcode
router.delete('/:id', adminMiddleware, passcodeMiddleware, deleteExpense); // Admin + Passcode

module.exports = router;
