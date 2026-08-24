const express = require('express');
const router = express.Router();
const { getMembers, createMember, updateMember, deleteMember } = require('../controllers/memberController');
const { authMiddleware, adminMiddleware, passcodeMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', getMembers); // All roles
router.post('/', adminMiddleware, createMember); // Admin only
router.put('/:id', adminMiddleware, passcodeMiddleware, updateMember); // Admin + Passcode
router.delete('/:id', adminMiddleware, passcodeMiddleware, deleteMember); // Admin + Passcode

module.exports = router;
