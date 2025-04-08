const Volunteer = require('../models/Volunteer');
const { validationResult } = require('express-validator');

// Public: Submit volunteer application
exports.submitApplication = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, phone, interestArea, message } = req.body;
    
    // Create volunteer application object
    const volunteerData = { 
      name, 
      email, 
      phone, 
      interestArea,
      message: message || '',
      status: 'pending'
    };
    
    // Add userId if the user is authenticated
    if (req.user && req.user.id) {
      volunteerData.userId = req.user.id;
    }
    
    console.log('Creating volunteer application:', volunteerData);
    
    const volunteer = new Volunteer(volunteerData);
    await volunteer.save();
    
    res.status(201).json({ 
      success: true, 
      data: volunteer,
      message: "Thank you for applying!" 
    });
  } catch (err) {
    console.error('Error saving volunteer application:', err);
    res.status(500).json({ 
      success: false, 
      error: "Server error",
      message: err.message 
    });
  }
};

// Admin: Get all applications
exports.getApplications = async (req, res) => {
  try {
    let query = {};
    
    // If not admin, only show user's own applications
    if (req.user && req.user.role !== 'admin') {
      console.log(`Filtering volunteer applications for user ${req.user.id}`);
      query.userId = req.user.id;
    }
    
    const volunteers = await Volunteer.find(query).sort({ createdAt: -1 });
    
    console.log(`Fetched ${volunteers.length} volunteer applications${req.user ? ' for user ' + req.user.id : ''}`);
    
    res.status(200).json({ 
      success: true, 
      count: volunteers.length,
      data: volunteers 
    });
  } catch (err) {
    console.error('Error fetching volunteer applications:', err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Admin: Update application status
exports.updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: pending, approved, rejected'
      });
    }
    
    console.log(`Updating volunteer application ${id} to status: ${status}`);
    
    // Find application and ensure it exists
    const application = await Volunteer.findById(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer application not found'
      });
    }
    
    // Check permission: admin or user's own application
    if (req.user.role !== 'admin' && application.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application'
      });
    }
    
    // Update application
    application.status = status;
    await application.save();
    
    res.status(200).json({
      success: true,
      data: application,
      message: 'Volunteer application status updated successfully'
    });
  } catch (err) {
    console.error('Error updating volunteer application:', err);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: err.message
    });
  }
};

// Admin: Delete application
exports.deleteApplication = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndDelete(req.params.id);
    if (!volunteer) {
      return res.status(404).json({ success: false, error: "Application not found" });
    }
    res.status(200).json({ success: true, data: null });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};