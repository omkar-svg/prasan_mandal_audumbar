const express = require('express');
const router = express.Router();
const { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } = require('../controllers/announcementController');
const { authMiddleware, adminMiddleware, passcodeMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', getAnnouncements); // All roles
router.post('/', adminMiddleware, createAnnouncement); // Admin only
router.put('/:id', adminMiddleware, passcodeMiddleware, updateAnnouncement); // Admin + Passcode
router.delete('/:id', adminMiddleware, passcodeMiddleware, deleteAnnouncement); // Admin + Passcode

module.exports = router;
