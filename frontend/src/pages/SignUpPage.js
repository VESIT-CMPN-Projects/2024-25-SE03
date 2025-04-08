import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './SignUpPage.css';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [formStatus, setFormStatus] = useState({
    loading: false,
    error: null
  });
  
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific field error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setFormStatus({ loading: true, error: null });

    try {
      // Register the user through AuthContext
      const registerData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'user'
      };
      
      const result = await register(registerData);
      
      if (result.success) {
        setFormStatus({ loading: false, error: null });
        navigate('/signin?registered=true'); // Redirect to sign in page with success param
      } else {
        setFormStatus({ 
          loading: false, 
          error: result.message || 'Registration failed. Please try again.' 
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setFormStatus({ 
        loading: false, 
        error: 'Failed to create account. Please try again.' 
      });
    }
  };

  return (
    <div className="signup-page">
      <section className="signup-container">
        <div className="signup-image">
          <div className="image-overlay"></div>
        </div>
        
        <div className="signup-content">
          <div className="signup-header">
            <h1>Create Account</h1>
            <p>Join our community and make a difference!</p>
          </div>

          {formStatus.error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              <p>{formStatus.error}</p>
            </div>
          )}

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-group">
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className={formErrors.name ? 'error' : ''}
                />
              </div>
              {formErrors.name && <div className="field-error">{formErrors.name}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-group">
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className={formErrors.email ? 'error' : ''}
                />
              </div>
              {formErrors.email && <div className="field-error">{formErrors.email}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-group">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  className={formErrors.password ? 'error' : ''}
                />
              </div>
              {formErrors.password && <div className="field-error">{formErrors.password}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-group">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={formErrors.confirmPassword ? 'error' : ''}
                />
              </div>
              {formErrors.confirmPassword && <div className="field-error">{formErrors.confirmPassword}</div>}
            </div>

            <div className="terms-checkbox">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
              </label>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary signup-btn"
              disabled={formStatus.loading}
            >
              {formStatus.loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="signup-separator">
            <span>Or sign up with</span>
          </div>

          <div className="social-signup">
            <button className="social-btn google-btn">
              <i className="fab fa-google"></i>
              Google
            </button>
            <button className="social-btn facebook-btn">
              <i className="fab fa-facebook-f"></i>
              Facebook
            </button>
          </div>

          <div className="signin-link">
            <p>
              Already have an account? <Link to="/signin">Sign In</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SignUpPage; 