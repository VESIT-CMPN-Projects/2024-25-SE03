const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const programController = require('../controllers/programController');

// @route   GET /api/programs
router.get('/', programController.getPrograms);

// @route   POST /api/programs
router.post(
  '/',
  [
    authMiddleware,
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty()
  ],
  programController.addProgram
);

// @route   PUT /api/programs/:id
router.put('/:id', authMiddleware, programController.updateProgram);

// @route   DELETE /api/programs/:id
router.delete('/:id', authMiddleware, programController.deleteProgram);

module.exports = router;
