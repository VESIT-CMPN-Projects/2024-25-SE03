const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const achievementController = require('../controllers/achievementController');
const authMiddleware = require('../middleware/authMiddleware');

// Public: Get all achievements
router.get('/', achievementController.getAchievements);

// Admin-only: Create/Update/Delete
router.post(
  '/',
  [
    authMiddleware,
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('count', 'Count must be a number').isNumeric(),
    check('category', 'Category is required').not().isEmpty()
  ],
  achievementController.createAchievement
);

router.put('/:id', authMiddleware, achievementController.updateAchievement);
router.delete('/:id', authMiddleware, achievementController.deleteAchievement);

module.exports = router;