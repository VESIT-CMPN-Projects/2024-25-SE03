const Achievement = require('../models/Achievement');
const { validationResult } = require('express-validator');

// @desc    Create a new achievement (Admin-only)
exports.createAchievement = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, image, count, category } = req.body;
    const achievement = new Achievement({ title, description, image, count, category });
    await achievement.save();
    res.status(201).json({ 
      success: true, 
      data: achievement 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: 'Server Error: Failed to create achievement' 
    });
  }
};

// @desc    Get all achievements (Public)
exports.getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ createdAt: -1 });
    res.status(200).json({ 
      success: true, 
      count: achievements.length,
      data: achievements 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: 'Server Error: Failed to fetch achievements' 
    });
  }
};

// @desc    Update an achievement (Admin-only)
exports.updateAchievement = async (req, res) => {
  try {
    const { title, description, image, count, category } = req.body;
    const achievement = await Achievement.findByIdAndUpdate(
      req.params.id,
      { title, description, image, count, category },
      { new: true, runValidators: true }  // Return updated document and validate data
    );

    if (!achievement) {
      return res.status(404).json({ 
        success: false, 
        error: 'Achievement not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      data: achievement 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: 'Server Error: Failed to update achievement' 
    });
  }
};

// @desc    Delete an achievement (Admin-only)
exports.deleteAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndDelete(req.params.id);
    if (!achievement) {
      return res.status(404).json({ 
        success: false, 
        error: 'Achievement not found' 
      });
    }
    res.status(200).json({ 
      success: true, 
      data: {} 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: 'Server Error: Failed to delete achievement' 
    });
  }
};