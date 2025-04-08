const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Register a new user (donor/admin)
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      message: 'Validation failed',
      errors: errors.array() 
    });
  }

  const { name, email, password, role } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    user = new User({ 
      name, 
      email, 
      password,
      role: role || 'user' 
    });
    
    await user.save();
    
    console.log(`User registered: ${user.email} (${user._id})`);

    // Generate JWT
    const payload = { 
      user: { 
        id: user.id, 
        name: user.name,
        email: user.email,
        role: user.role 
      }
    };
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ 
          success: true,
          message: 'Registration successful',
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      }
    );
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    // Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    console.log(`User logged in: ${user.email} (${user._id})`);

    // Generate JWT
    const payload = { 
      user: { 
        id: user.id, 
        name: user.name,
        email: user.email,
        role: user.role 
      }
    };
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          success: true,
          message: 'Login successful',
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      }
    );
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Get logged-in user (protected route)
exports.getUser = async (req, res) => {
  try {
    // req.user is set by the auth middleware
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }
    
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Get user's donation and volunteer history
    // This could be optimized with population or separate endpoints
    const Donation = require('../models/Donation');
    const Volunteer = require('../models/Volunteer');
    
    const donations = await Donation.find({ userId: user._id }).sort({ createdAt: -1 });
    const volunteering = await Volunteer.find({ userId: user._id }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        donations,
        volunteering
      }
    });
  } catch (err) {
    console.error('Get user error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Error retrieving user profile',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Update user profile (protected route)
exports.updateUser = async (req, res) => {
  try {
    // req.user is set by the auth middleware
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }
    
    const userId = req.user.id;
    console.log(`Updating user profile for: ${userId}`);
    console.log('Update data:', req.body);

    // Fields to update
    const { name, email, password } = req.body;
    
    // Get current user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Prepare update data
    const updateData = {};
    
    // Only update fields that were provided
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    
    // If password is being updated, hash it
    if (password) {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }
    
    // Update user in database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).select('-password');
    
    console.log(`User profile updated successfully: ${updatedUser.email}`);
    
    // Get updated user's donation and volunteer history for the response
    const Donation = require('../models/Donation');
    const Volunteer = require('../models/Volunteer');
    
    const donations = await Donation.find({ userId: updatedUser._id }).sort({ createdAt: -1 });
    const volunteering = await Volunteer.find({ userId: updatedUser._id }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        donations,
        volunteering
      }
    });
    
  } catch (err) {
    console.error('Update user error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Error updating user profile',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};