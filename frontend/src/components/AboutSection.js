import React from 'react';
import { Link } from 'react-router-dom';
import './AboutSection.css';

const AboutSection = () => {
  return (
    <section className="about-section">
      <div className="container">
        <div className="about-content">
          <div className="about-image">
            <img src="https://source.unsplash.com/random/600x800/?education,ngo" alt="Parvarish NGO" />
          </div>
          <div className="about-text">
            <div className="section-heading">
              <h2>About PARVARISH</h2>
            </div>
            <h3>Our Mission</h3>
            <p>
              PARVARISH is dedicated to empowering underprivileged communities through education, 
              healthcare, and sustainable development programs. We believe in creating lasting change 
              by focusing on holistic community development and equipping people with the skills and 
              resources they need to build better futures.
            </p>
            <h3>Our Vision</h3>
            <p>
              We envision a world where every child has access to quality education, healthcare, 
              and equal opportunities to achieve their full potential. Through collaborative efforts, 
              we work towards creating self-sustaining communities that thrive on principles of 
              equality, dignity, and social justice.
            </p>
            <div className="about-stats">
              <div className="stat-box">
                <span className="stat-number">10+</span>
                <span className="stat-text">Years of Service</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">20+</span>
                <span className="stat-text">Active Programs</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">5000+</span>
                <span className="stat-text">Lives Impacted</span>
              </div>
            </div>
            <Link to="/about" className="btn btn-outline">
              Learn More About Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection; 