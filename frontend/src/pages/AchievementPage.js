import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { achievementsAPI } from '../services/api';
import './AchievementPage.css';

const AchievementPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    image: null
  });
  const [formStatus, setFormStatus] = useState({
    loading: false,
    error: null,
    success: null
  });

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const response = await achievementsAPI.getAll();
      setAchievements(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch achievements. Please try again later.');
      console.error('Error fetching achievements:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ loading: true, error: null, success: null });

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('date', formData.date);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      await achievementsAPI.create(formDataToSend);
      
      setFormStatus({
        loading: false,
        error: null,
        success: 'Achievement added successfully!'
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        date: '',
        image: null
      });
      
      // Refresh achievements list
      fetchAchievements();
    } catch (err) {
      setFormStatus({
        loading: false,
        error: 'Failed to add achievement. Please try again.',
        success: null
      });
      console.error('Error adding achievement:', err);
    }
  };

  return (
    <div className="achievement-page">
      <div className="achievement-container">
        <h1>Our Achievements</h1>
        
        {isAuthenticated && user?.role === 'admin' && (
          <div className="achievement-form-container">
            <h2>Add New Achievement</h2>
            
            {formStatus.error && (
              <div className="error-message">
                <i className="fas fa-exclamation-circle"></i>
                <p>{formStatus.error}</p>
              </div>
            )}
            
            {formStatus.success && (
              <div className="success-message">
                <i className="fas fa-check-circle"></i>
                <p>{formStatus.success}</p>
              </div>
            )}
            
            <form className="achievement-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Achievement Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="image">Image</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleChange}
                  accept="image/*"
                />
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={formStatus.loading}
              >
                {formStatus.loading ? 'Adding...' : 'Add Achievement'}
              </button>
            </form>
          </div>
        )}
        
        {loading ? (
          <div className="loading">Loading achievements...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : achievements.length === 0 ? (
          <div className="no-achievements">No achievements found.</div>
        ) : (
          <div className="achievements-grid">
            {achievements.map((achievement) => (
              <div key={achievement._id} className="achievement-card">
                {achievement.image && (
                  <div className="achievement-image">
                    <img src={achievement.image} alt={achievement.title} />
                  </div>
                )}
                <div className="achievement-content">
                  <h3>{achievement.title}</h3>
                  <p className="achievement-date">
                    {new Date(achievement.date).toLocaleDateString()}
                  </p>
                  <p className="achievement-description">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementPage; 