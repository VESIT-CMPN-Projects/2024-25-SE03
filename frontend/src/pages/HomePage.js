import React from 'react';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import ProgramsSection from '../components/ProgramsSection';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <Hero />
      
      <AboutSection />
      
      <section className="home-programs-section">
        <div className="container">
          <div className="section-heading">
            <h2>Our Programs</h2>
            <p>Explore our initiatives that are making a difference in communities across India.</p>
          </div>
          <ProgramsSection limit={4} />
        </div>
      </section>
      
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Make a Difference Today</h2>
            <p>Join us in our mission to transform lives and build sustainable communities.</p>
            <div className="cta-buttons">
              <a href="/donate" className="btn btn-primary">Donate Now</a>
              <a href="/volunteer" className="btn btn-secondary">Become a Volunteer</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 