const express = require('express');
const router = express.Router();
const { getMembers, createMember, updateMember, deleteMember } = require('../controllers/memberController');
const { authMiddleware, adminMiddleware, passcodeMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', getMembers); // All roles
router.post('/', adminMiddleware, createMember); // Admin only
router.put('/:id', adminMiddleware, updateMember); // Admin only
router.delete('/:id', adminMiddleware, deleteMember); // Admin only

module.exports = router;
