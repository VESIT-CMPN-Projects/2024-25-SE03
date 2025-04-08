import React, { useState } from 'react';
import axios from 'axios';
import './VolunteerPage.css';

const VolunteerPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interestArea: '',
    message: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/volunteers', formData);
      setSuccess('Thank you for your interest in volunteering! We will contact you soon.');
      setError('');
      setFormData({
        name: '',
        email: '',
        phone: '',
        interestArea: '',
        message: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div className="volunteer-page">
      <div className="volunteer-container">
        <h1>Become a Volunteer</h1>
        <p className="volunteer-intro">
          Join our team of dedicated volunteers and make a difference in your community.
          Your time and skills can help us achieve our mission and create positive change.
        </p>
        
        <div className="volunteer-form-container">
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

          <form className="volunteer-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
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
                required
                placeholder="Enter your email"
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
                required
                placeholder="Enter your phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="interestArea">Area of Interest</label>
              <select
                id="interestArea"
                name="interestArea"
                value={formData.interestArea}
                onChange={handleChange}
                required
              >
                <option value="">Select an area</option>
                <option value="Education">Education</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Environment">Environment</option>
                <option value="Community Development">Community Development</option>
                <option value="Fundraising">Fundraising</option>
                <option value="Event Management">Event Management</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message (Optional)</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us why you want to volunteer with our organization"
                rows="4"
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
            >
              Submit Application
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VolunteerPage; 