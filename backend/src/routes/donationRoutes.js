const express = require('express');
const router = express.Router();
const { getDonations, createDonation, updateDonation, deleteDonation } = require('../controllers/donationController');
const { authMiddleware, adminMiddleware, passcodeMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', getDonations); // All roles
router.post('/', adminMiddleware, createDonation); // Admin only
router.put('/:id', adminMiddleware, passcodeMiddleware, updateDonation); // Admin + Passcode
router.delete('/:id', adminMiddleware, passcodeMiddleware, deleteDonation); // Admin + Passcode

module.exports = router;
