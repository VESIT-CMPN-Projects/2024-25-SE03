import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import logo from '../assets/logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section about">
            <div className="footer-logo">
              <img src={logo} alt="Parvarish Logo" className="footer-logo-image" />
              <span className="footer-logo-text">PARVARISH</span>
            </div>
            <p>
              Empowering communities through education, health, and sustainable development. 
              Join us in making a difference in the lives of those in need.
            </p>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          <div className="footer-section quick-links">
            <h3 className="footer-title">Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/programs">Programs</Link></li>
              <li><Link to="/achievements">Achievements</Link></li>
              <li><Link to="/volunteer">Volunteer</Link></li>
              <li><Link to="/donate">Donate</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-section contact">
            <h3 className="footer-title">Contact Us</h3>
            <p><i className="fas fa-map-marker-alt"></i> 123 NGO Street, Mumbai, India</p>
            <p><i className="fas fa-phone"></i> +91 1234567890</p>
            <p><i className="fas fa-envelope"></i> parvarish.shh.0823@gmail.com</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} PARVARISH. All rights reserved.</p>
          <div className="footer-legal">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-of-service">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 