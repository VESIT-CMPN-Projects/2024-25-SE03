const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const volunteerController = require('../controllers/volunteerController');
const authMiddleware = require('../middleware/authMiddleware');
const optionalAuth = require('../middleware/optionalAuthMiddleware');

// Public: Submit application (with optional auth to capture user ID if logged in)
router.post(
  '/',
  optionalAuth,
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Invalid email').isEmail(),
    check('phone', 'Phone is required').not().isEmpty(),
    check('interestArea', 'Interest area is required').not().isEmpty()
  ],
  volunteerController.submitApplication
);

// Admin-only: Get/delete applications
router.get('/', authMiddleware, volunteerController.getApplications);
router.delete('/:id', authMiddleware, volunteerController.deleteApplication);

// Update application status (requires auth)
router.put('/:id', authMiddleware, volunteerController.updateApplication);

module.exports = router;