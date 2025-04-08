const express = require('express');
const router = express.Router();
const { 
  makeDonation, 
  getAllDonations, 
  confirmDonation 
} = require('../controllers/donationController');
const authMiddleware = require('../middleware/authMiddleware');

// Make a donation - Public
router.post('/', makeDonation);

// Confirm donation payment - Admin only
router.post('/confirm', authMiddleware, confirmDonation);

// Get all donations - Admin only
router.get('/', authMiddleware, getAllDonations);

module.exports = router;