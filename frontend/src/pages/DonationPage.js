import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DonationPage.css';
// Import the QR code image from assets folder
import qrCodeImage from '../assets/donation-qr.jpg';

const DonationPage = () => {
  const [programs, setPrograms] = useState([]);
  const [formData, setFormData] = useState({
    donorName: '',
    email: '',
    phone: '',
    amount: '',
    programId: '',
    programName: 'General Donation',
    message: '',
    paymentMethod: 'qrCode',
    anonymous: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [showQRCode, setShowQRCode] = useState(false);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.get('/api/programs');
        setPrograms(response.data);
      } catch (err) {
        console.error('Error fetching programs:', err);
      }
    };
    fetchPrograms();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'programId') {
      const selectedProgram = programs.find(p => p._id === value);
      setFormData(prev => ({
        ...prev,
        programName: selectedProgram ? selectedProgram.name : 'General Donation'
      }));
    }
  };

  const markPaymentComplete = async () => {
    setPaymentStatus('completed');
    setSuccess('Thank you for your donation! Your payment has been confirmed.');
    
    try {
      // Save donation details to database
      await axios.post('/api/donations', {
        ...formData,
        status: 'completed',
        donationDate: new Date()
      });
    } catch (err) {
      console.error('Error saving donation:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setPaymentStatus('processing');

    try {
      if (formData.paymentMethod === 'qrCode') {
        // Show static QR code
        setShowQRCode(true);
      } else {
        // Handle other payment methods
        await axios.post('/api/donations', formData);
        setSuccess('Thank you for your donation! We will process it shortly.');
        setPaymentStatus('completed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      setPaymentStatus('failed');
    }
  };

  return (
    <div className="donation-page">
      <div className="donation-container">
        <h1>Make a Donation</h1>
        <p className="donation-intro">
          Your contribution will help us continue our mission to make a positive impact in our community.
          Every donation, no matter how small, makes a difference.
        </p>
        
        <div className="donation-form-container">
          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              <p>{error}</p>
            </div>
          )}
          
          {success && (
            <div className="success-message">
              <i className="fas fa-check-circle"></i>
              <p>{success}</p>
            </div>
          )}

          {!showQRCode ? (
            <form className="donation-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="donorName">Full Name</label>
                <input
                  type="text"
                  id="donorName"
                  name="donorName"
                  value={formData.donorName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="form-group amount-input">
                <label htmlFor="amount">Donation Amount (₹)</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="Enter amount"
                />
              </div>

              <div className="form-group">
                <label htmlFor="programId">Select Program (Optional)</label>
                <select
                  id="programId"
                  name="programId"
                  value={formData.programId}
                  onChange={handleChange}
                >
                  <option value="">General Donation</option>
                  {programs.map(program => (
                    <option key={program._id} value={program._id}>
                      {program.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message (Optional)</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Add a message with your donation"
                  rows="4"
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="paymentMethod">Payment Method</label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                >
                  <option value="qrCode">QR Code</option>
                  <option value="creditCard">Credit Card</option>
                  <option value="debitCard">Debit Card</option>
                  <option value="netBanking">Net Banking</option>
                </select>
              </div>

              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="anonymous"
                  name="anonymous"
                  checked={formData.anonymous}
                  onChange={handleChange}
                />
                <label htmlFor="anonymous">Make this donation anonymous</label>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={paymentStatus === 'processing'}
              >
                {paymentStatus === 'processing' ? 'Processing...' : 'Proceed to Payment'}
              </button>
            </form>
          ) : (
            <div className="qr-code-container">
              <h3>Scan QR Code to Pay</h3>
              <div className="qr-code">
                <img src={qrCodeImage} alt="Payment QR Code" />
              </div>
              <p className="qr-instructions">
                Please scan this QR code with your payment app to complete the donation of ₹{formData.amount}
                {formData.programName !== 'General Donation' && ` for ${formData.programName}`}.
              </p>
              <div className="payment-status">
                <p>Payment Status: {paymentStatus}</p>
                {paymentStatus === 'processing' && (
                  <p className="processing-message">
                    After scanning, please click the button below to confirm your payment
                  </p>
                )}
              </div>
              <div className="payment-actions">
                <button 
                  className="btn btn-primary" 
                  onClick={markPaymentComplete}
                  disabled={paymentStatus === 'completed'}
                >
                  I've Completed the Payment
                </button>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => {
                    setShowQRCode(false);
                    setPaymentStatus('pending');
                  }}
                >
                  Back to Form
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationPage; 