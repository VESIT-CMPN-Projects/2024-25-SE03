import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI, donationsAPI, volunteersAPI } from '../services/api';
import './UserProfilePage.css';

const UserProfilePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState(null);
  const [donations, setDonations] = useState([]);
  const [volunteerHistory, setVolunteerHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [showVolunteerForm, setShowVolunteerForm] = useState(false);
  const [donationForm, setDonationForm] = useState({
    amount: '',
    programId: '',
    programName: 'General Donation',
    message: '',
    anonymous: false,
    date: new Date().toISOString().split('T')[0]
  });
  const [volunteerForm, setVolunteerForm] = useState({
    name: '',
    email: '',
    phone: '',
    interestArea: '',
    message: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user profile data from the backend
        const response = await authAPI.getUser();
        
        if (response.success) {
          // Set profile data
          setProfileData({
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
            role: response.data.role
          });
          
          // Set donations and volunteer history
          setDonations(response.data.donations || []);
          setVolunteerHistory(response.data.volunteering || []);
          
          // Pre-fill volunteer form with user data
          setVolunteerForm(prev => ({
            ...prev,
            name: response.data.name || '',
            email: response.data.email || ''
          }));
        } else {
          setError('Failed to load user data. Please try again later.');
        }
      } catch (err) {
        setError('Failed to load user data. Please try again later.');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchUserData();
    }
  }, [user]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const handleDonationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDonationForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleVolunteerChange = (e) => {
    const { name, value } = e.target;
    setVolunteerForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      // Add user ID to the donation data
      const donationData = {
        ...donationForm,
        userId: user.id,
        donorName: user.name,
        email: user.email,
        date: donationForm.date || new Date().toISOString().split('T')[0]
      };
      
      // Submit donation to the backend
      const response = await donationsAPI.donate(donationData);
      
      if (response.success) {
        setSuccessMessage('Donation submitted successfully!');
        setShowDonationForm(false);
        
        // Refresh user data to show the new donation
        const userResponse = await authAPI.getUser();
        if (userResponse.success) {
          setDonations(userResponse.data.donations || []);
        }
        
        // Clear form
        setDonationForm({
          amount: '',
          programId: '',
          programName: 'General Donation',
          message: '',
          anonymous: false,
          date: new Date().toISOString().split('T')[0]
        });
        
        // Navigate to donations tab
        setActiveTab('donations');
      } else {
        setError('Failed to submit donation. Please try again.');
      }
    } catch (err) {
      setError('Failed to submit donation. Please try again.');
      console.error('Error submitting donation:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVolunteerSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      // Add user ID to the volunteer data
      const volunteerData = {
        ...volunteerForm,
        userId: user.id
      };
      
      // Submit volunteer application to the backend
      const response = await volunteersAPI.register(volunteerData);
      
      if (response.success) {
        setSuccessMessage('Volunteer application submitted successfully!');
        setShowVolunteerForm(false);
        
        // Refresh user data to show the new volunteer application
        const userResponse = await authAPI.getUser();
        if (userResponse.success) {
          setVolunteerHistory(userResponse.data.volunteering || []);
        }
        
        // Clear form
        setVolunteerForm({
          name: user.name || '',
          email: user.email || '',
          phone: '',
          interestArea: '',
          message: ''
        });
        
        // Navigate to volunteer tab
        setActiveTab('volunteer');
      } else {
        setError('Failed to submit volunteer application. Please try again.');
      }
    } catch (err) {
      setError('Failed to submit volunteer application. Please try again.');
      console.error('Error submitting volunteer application:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !showDonationForm && !showVolunteerForm) {
    return (
      <div className="loading">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (error && !showDonationForm && !showVolunteerForm) {
    return (
      <div className="error">
        <i className="fas fa-exclamation-circle"></i>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>My Profile</h1>
        <div className="profile-tabs">
          <button
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <i className="fas fa-user"></i>
            Profile
          </button>
          <button
            className={`tab-btn ${activeTab === 'donations' ? 'active' : ''}`}
            onClick={() => setActiveTab('donations')}
          >
            <i className="fas fa-hand-holding-heart"></i>
            Donations
          </button>
          <button
            className={`tab-btn ${activeTab === 'volunteer' ? 'active' : ''}`}
            onClick={() => setActiveTab('volunteer')}
          >
            <i className="fas fa-history"></i>
            Volunteer History
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="success-message">
          <i className="fas fa-check-circle"></i>
          <p>{successMessage}</p>
          <button onClick={() => setSuccessMessage('')}>
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      <div className="profile-content">
        {activeTab === 'profile' && profileData && (
          <div className="profile-section">
            <div className="profile-info">
              <div className="profile-avatar">
                {profileData.name?.charAt(0).toUpperCase()}
              </div>
              <div className="profile-details">
                <h2>{profileData.name}</h2>
                <p>{profileData.email}</p>
                <p className="profile-role">{profileData.role}</p>
              </div>
            </div>
            <div className="profile-stats">
              <div className="stat-card">
                <i className="fas fa-hand-holding-heart"></i>
                <h3>{donations.length}</h3>
                <p>Total Donations</p>
              </div>
              <div className="stat-card">
                <i className="fas fa-clock"></i>
                <h3>{volunteerHistory.length}</h3>
                <p>Volunteer Hours</p>
              </div>
            </div>
            <div className="profile-actions">
              <button 
                className="action-btn donate-btn"
                onClick={() => setShowDonationForm(true)}
              >
                <i className="fas fa-hand-holding-heart"></i>
                Make a Donation
              </button>
              <button 
                className="action-btn volunteer-btn"
                onClick={() => setShowVolunteerForm(true)}
              >
                <i className="fas fa-users"></i>
                Apply to Volunteer
              </button>
            </div>
          </div>
        )}

        {activeTab === 'donations' && (
          <div className="donations-section">
            <div className="section-header">
              <h2>Donation History</h2>
              <button 
                className="action-btn donate-btn"
                onClick={() => setShowDonationForm(true)}
              >
                <i className="fas fa-plus"></i>
                Make a Donation
              </button>
            </div>
            {donations.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-hand-holding-heart"></i>
                <p>No donations found.</p>
                <button 
                  className="action-btn donate-btn"
                  onClick={() => setShowDonationForm(true)}
                >
                  Make Your First Donation
                </button>
              </div>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Program</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Transaction ID</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map((donation) => (
                      <tr key={donation._id || donation.id}>
                        <td>{donation.programName || 'General Donation'}</td>
                        <td>{formatCurrency(donation.amount)}</td>
                        <td>{formatDate(donation.createdAt)}</td>
                        <td>{donation.transactionId || '-'}</td>
                        <td>
                          <span className={`status-badge ${donation.status.toLowerCase()}`}>
                            {donation.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'volunteer' && (
          <div className="volunteer-section">
            <div className="section-header">
              <h2>Volunteer History</h2>
              <button 
                className="action-btn volunteer-btn"
                onClick={() => setShowVolunteerForm(true)}
              >
                <i className="fas fa-plus"></i>
                Apply to Volunteer
              </button>
            </div>
            {volunteerHistory.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-users"></i>
                <p>No volunteer history found.</p>
                <button 
                  className="action-btn volunteer-btn"
                  onClick={() => setShowVolunteerForm(true)}
                >
                  Apply to Volunteer
                </button>
              </div>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Interest Area</th>
                      <th>Application Date</th>
                      <th>Phone</th>
                      <th>Message</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {volunteerHistory.map((application) => (
                      <tr key={application._id || application.id}>
                        <td>{application.interestArea}</td>
                        <td>{formatDate(application.createdAt)}</td>
                        <td>{application.phone}</td>
                        <td>{application.message || '-'}</td>
                        <td>
                          <span className={`status-badge ${application.status.toLowerCase()}`}>
                            {application.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Donation Form Modal */}
      {showDonationForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Make a Donation</h2>
              <button 
                className="close-btn"
                onClick={() => setShowDonationForm(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleDonationSubmit}>
              <div className="form-group">
                <label htmlFor="amount">Amount (INR)</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={donationForm.amount}
                  onChange={handleDonationChange}
                  required
                  min="1"
                />
              </div>
              <div className="form-group">
                <label htmlFor="programName">Campaign</label>
                <select
                  id="programName"
                  name="programName"
                  value={donationForm.programName}
                  onChange={handleDonationChange}
                >
                  <option value="General Donation">General Donation</option>
                  <option value="Education Fund">Education Fund</option>
                  <option value="Healthcare Initiative">Healthcare Initiative</option>
                  <option value="Emergency Relief">Emergency Relief</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="date">Donation Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={donationForm.date}
                  onChange={handleDonationChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message (Optional)</label>
                <textarea
                  id="message"
                  name="message"
                  value={donationForm.message}
                  onChange={handleDonationChange}
                  rows="3"
                ></textarea>
              </div>
              <div className="form-group checkbox">
                <input
                  type="checkbox"
                  id="anonymous"
                  name="anonymous"
                  checked={donationForm.anonymous}
                  onChange={handleDonationChange}
                />
                <label htmlFor="anonymous">Make this donation anonymous</label>
              </div>
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={() => setShowDonationForm(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Processing...
                    </>
                  ) : (
                    'Submit Donation'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Volunteer Form Modal */}
      {showVolunteerForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Apply to Volunteer</h2>
              <button 
                className="close-btn"
                onClick={() => setShowVolunteerForm(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleVolunteerSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={volunteerForm.name}
                  onChange={handleVolunteerChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={volunteerForm.email}
                  onChange={handleVolunteerChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={volunteerForm.phone}
                  onChange={handleVolunteerChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="interestArea">Area of Interest</label>
                <select
                  id="interestArea"
                  name="interestArea"
                  value={volunteerForm.interestArea}
                  onChange={handleVolunteerChange}
                  required
                >
                  <option value="">Select an area</option>
                  <option value="Education">Education</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Environment">Environment</option>
                  <option value="Community Development">Community Development</option>
                  <option value="Emergency Response">Emergency Response</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="volunteerMessage">Message (Optional)</label>
                <textarea
                  id="volunteerMessage"
                  name="message"
                  value={volunteerForm.message}
                  onChange={handleVolunteerChange}
                  rows="3"
                ></textarea>
              </div>
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={() => setShowVolunteerForm(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Processing...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage; 