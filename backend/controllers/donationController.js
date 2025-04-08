const Donation = require('../models/Donation');

// @desc    Submit a manual donation (without payment gateway)
exports.createDonation = async (req, res) => {
  const { donorName, email, amount, programId } = req.body;

  try {
    const donation = new Donation({
      donorName,
      email,
      amount,
      transactionId: `manual_${Date.now()}`, // Mock transaction ID
      status: 'completed', // Mark as "completed" since we're skipping payment
      programId: programId || null,
    });

    await donation.save();
    res.status(201).json({ 
      success: true, 
      data: donation,
      message: "Donation recorded successfully!" 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// @desc    Get all donations (Admin-only)
exports.getDonations = async (req, res) => {
  try {
    let query = {};
    
    // If the request is coming from a non-admin user, only show their donations
    if (req.user && req.user.role !== 'admin') {
      console.log(`Filtering donations for user ${req.user.id}`);
      query.userId = req.user.id;
    }
    
    const donations = await Donation.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: donations });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Make a donation
exports.makeDonation = async (req, res) => {
  try {
    console.log('Received donation request:', req.body);
    
    // Extract data from request body with fallbacks
    const { 
      amount, 
      programId, 
      programName,
      message, 
      paymentMethod,
      status,
      donorName, 
      email, 
      phone,
      userId,
      anonymous
    } = req.body;
    
    // Basic validation
    if (!amount || isNaN(Number(amount))) {
      return res.status(400).json({
        success: false,
        message: 'Valid donation amount is required'
      });
    }
    
    // Generate a transaction ID if not provided
    const transactionId = req.body.transactionId || `TXN${Date.now()}`;
    
    // Prepare donation data
    const donationData = {
      amount: Number(amount),
      programId: programId || null,
      programName: programName || 'General Donation',
      message: message || '',
      paymentMethod: paymentMethod || 'qrCode',
      transactionId,
      status: status || 'completed',
      // Handle anonymous flag
      anonymous: anonymous === true
    };
    
    // If user info is provided in the request directly, use it
    if (userId) {
      donationData.userId = userId;
    } else if (req.userId) {
      // If user is authenticated via middleware, use that
      donationData.userId = req.userId;
    }
    
    // Add donor details if provided 
    if (donorName) {
      donationData.donorName = donorName;
    } else if (donationData.userId && !donationData.anonymous) {
      // Try to get the user name if we have userId and not anonymous
      try {
        const User = require('../models/User');
        const user = await User.findById(donationData.userId);
        if (user) {
          donationData.donorName = user.name;
          // If we have the user, also set the email if not provided
          if (!email && user.email) {
            donationData.email = user.email;
          }
        }
      } catch (userError) {
        console.warn('Could not fetch user data for donation:', userError);
      }
    }
    
    // Set email if provided
    if (email) {
      donationData.email = email;
    }
    
    // Set phone if provided
    if (phone) {
      donationData.phone = phone;
    }
    
    // Default to anonymous donor name if none provided
    if (!donationData.donorName) {
      donationData.donorName = 'Anonymous Donor';
      donationData.anonymous = true;
    }
    
    console.log('Creating donation with data:', donationData);
    
    // Create donation record
    const donation = new Donation(donationData);

    // Save the donation to the database
    await donation.save();
    
    console.log('Donation saved successfully:', donation._id);

    return res.status(201).json({
      success: true,
      message: 'Donation recorded successfully',
      data: donation
    });
  } catch (error) {
    console.error('Error making donation:', error);
    
    // Check for specific MongoDB errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to process donation',
      error: error.message
    });
  }
};

// Get all donations
exports.getAllDonations = async (req, res) => {
  try {
    let query = {};
    
    // If the request is coming from a non-admin user, only show their donations
    if (req.user && req.user.role !== 'admin') {
      console.log(`Filtering donations for user ${req.user.id}`);
      query.userId = req.user.id;
    }
    
    const donations = await Donation.find(query)
      .sort({ createdAt: -1 });
    
    console.log(`Fetched ${donations.length} donations${req.user ? ' for user ' + req.user.id : ''}`);
    
    res.status(200).json({
      success: true,
      count: donations.length,
      data: donations
    });
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch donations',
      error: error.message
    });
  }
};

// Confirm donation payment (manually verify and update donation status)
exports.confirmDonation = async (req, res) => {
  try {
    const { donationId, status } = req.body;

    // Find the donation by ID
    const donation = await Donation.findById(donationId);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    // Update donation status
    donation.status = status;
    await donation.save();

    return res.status(200).json({
      success: true,
      message: 'Donation status updated successfully',
      data: donation
    });
  } catch (error) {
    console.error('Error confirming donation:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to confirm donation',
      error: error.message
    });
  }
};