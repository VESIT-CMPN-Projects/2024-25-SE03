const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  donorName: {
    type: String,
    default: 'Anonymous Donor'
  },
  email: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  amount: {
    type: Number,
    required: [true, 'Please provide donation amount']
  },
  programId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program',
    default: null
  },
  programName: {
    type: String,
    default: 'General Donation'
  },
  message: {
    type: String,
    default: ''
  },
  transactionId: {
    type: String,
    default: () => `TXN${Date.now()}`
  },
  paymentMethod: {
    type: String,
    enum: ['creditCard', 'debitCard', 'netBanking', 'qrCode', 'other'],
    default: 'qrCode'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  anonymous: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Donation', DonationSchema);