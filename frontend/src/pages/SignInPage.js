import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './SignInPage.css';

const SignInPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formStatus, setFormStatus] = useState({
    loading: false,
    error: null,
    success: null
  });

  // Check for registration success via URL params
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('registered') === 'true') {
      setFormStatus(prev => ({
        ...prev,
        success: 'Registration successful! Please sign in with your credentials.'
      }));
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ loading: true, error: null, success: null });

    try {
      // Call the login function from AuthContext
      const result = await login(formData);
      
      if (result.success) {
        setFormStatus({ 
          loading: false, 
          error: null, 
          success: 'Sign in successful! Redirecting to your profile...' 
        });
        
        // Redirect to profile page after successful login
        setTimeout(() => {
          navigate('/profile');
        }, 1000);
      } else {
        setFormStatus({ 
          loading: false, 
          error: result.message || 'Login failed. Please try again.', 
          success: null 
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setFormStatus({ 
        loading: false, 
        error: 'Failed to sign in. Please check your credentials.', 
        success: null 
      });
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-container">
        <div className="signin-content">
          <div className="signin-header">
            <h1>Sign In</h1>
            <p>Welcome back! Sign in to your account to access the dashboard.</p>
          </div>

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

          <form className="signin-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-group">
                <i className="fas fa-envelope"></i>
                <div className="input-wrapper">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-group">
                <i className="fas fa-lock"></i>
                <div className="input-wrapper">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-options">
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <Link to="/forgot-password" className="forgot-password">
                Forgot Password?
              </Link>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary signin-btn"
              disabled={formStatus.loading}
            >
              {formStatus.loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="signup-link">
            <p>
              Don't have an account? <Link to="/signup">Create Account</Link>
            </p>
          </div>
        </div>
        
        <div className="signin-image">
          <div className="image-overlay"></div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage; 