const express = require('express');
const router = express.Router();
const { getOfficers, createOfficer, updateOfficer, deleteOfficer } = require('../controllers/officerController');
const { authMiddleware, adminMiddleware, passcodeMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', getOfficers); // All roles
router.post('/', adminMiddleware, createOfficer); // Admin only
router.put('/:id', adminMiddleware, passcodeMiddleware, updateOfficer); // Admin + Passcode
router.delete('/:id', adminMiddleware, passcodeMiddleware, deleteOfficer); // Admin + Passcode

module.exports = router;
