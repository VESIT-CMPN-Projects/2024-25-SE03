import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';
import heroBg from '../assets/hero-bg.jpg';

const Hero = () => {
  return (
    <div className="hero" style={{ backgroundImage: `url(${heroBg})` }}>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1>Empowering Communities Through Education</h1>
        <p>Join us in our mission to create lasting change through education, healthcare, and sustainable development initiatives.</p>
        <div className="hero-buttons">
          <Link to="/donate" className="btn btn-primary">Donate Now</Link>
          <Link to="/volunteer" className="btn btn-secondary">Volunteer</Link>
        </div>
      </div>
      <div className="hero-stats">
        <div className="stat-item">
          <h3>1000+</h3>
          <p>Students Supported</p>
        </div>
        <div className="stat-item">
          <h3>50+</h3>
          <p>Communities Reached</p>
        </div>
        <div className="stat-item">
          <h3>100+</h3>
          <p>Volunteers</p>
        </div>
      </div>
    </div>
  );
};

export default Hero; 