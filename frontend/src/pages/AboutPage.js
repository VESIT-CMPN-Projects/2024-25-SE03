import React from 'react';
import './AboutPage.css';
import founderImg from '../assets/founder.png';

const AboutPage = () => {
  return (
    <div className="about-page">
      <section className="page-header">
        <div className="container">
          <h1>About Parvarish</h1>
          <p>Our journey, mission, and the people behind our initiative</p>
        </div>
      </section>

      <section className="about-section">
        <h2>Our Story</h2>
        <div className="about-content">
          <div className="about-text">
            <p>
              Parvarish began its journey in 2013 with a vision to transform how society supports 
              and uplifts neurodiverse individuals. Founded by Pawan Chawla, who transitioned from 
              computer science to neurodiverse education, Parvarish has grown into a dedicated 
              organization working towards inclusive education and mental health support.
            </p>
            <p>
              Over the years, we've focused on addressing the challenges faced by neurodiverse 
              children through specialized learning, parental support, and community awareness. 
              We believe in creating an environment where differences are seen as strengths, 
              ensuring every child has the opportunity to thrive.
            </p>
          </div>
        </div>
      </section>

      <section className="founder-section">
        <div className="container">
          <div className="founder-content">
            <img src={founderImg} alt="Founder of Parvarish" className="founder-image" />
            <div className="founder-info">
              <h3>Meet Our Founder</h3>
              <p>Dr. Meera Sharma founded Parvarish after working as a special education teacher for 15 years. Her personal experience with her nephew, who has autism, inspired her to create a supportive community where differently-abled children could thrive.</p>
              <p>"I believe that every child has unique abilities and gifts to offer the world. Our role is to nurture these gifts and create environments where children can discover their potential," says Dr. Sharma.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mission-vision">
        <div className="mission">
          <h3>Our Mission</h3>
          <p>
            To make education and mental health support accessible to all, ensuring that no child 
            is left behind. We strive to bridge the gap for neurodiverse children, providing them 
            with equal opportunities, respect, and dignity.
          </p>
        </div>

        <div className="vision">
          <h3>Our Vision</h3>
          <p>
            A future where education and mental health support reach every child across India, 
            regardless of their abilities. We envision a society where neurodiverse children 
            not only survive but thrive with dignity and confidence.
          </p>
        </div>
      </div>

      <section className="values-section">
        <h2>Our Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <h4>Include</h4>
            <p>
              We believe in creating inclusive environments where every child, regardless of 
              their abilities, feels welcome, valued, and accepted as an integral part of the 
              community.
            </p>
          </div>
          
          <div className="value-card">
            <h4>Integrate</h4>
            <p>
              We work to integrate diverse learning approaches and support systems, ensuring 
              a holistic development path that addresses each child's unique educational and 
              mental health needs.
            </p>
          </div>
          
          <div className="value-card">
            <h4>Inspire</h4>
            <p>
              We aim to inspire confidence, resilience, and self-advocacy in neurodiverse 
              children, empowering them to recognize their strengths and reach their full 
              potential.
            </p>
          </div>
        </div>
      </section>

      <section className="impact-section">
        <div className="container">
          <h2>Our Impact</h2>
          <p>The difference we've made across Maharashtra</p>
        </div>

        <div className="impact-grid">
          <div className="impact-card">
            <h4>5000+</h4>
            <p>Children Supported</p>
          </div>
          <div className="impact-card">
            <h4>50+</h4>
            <p>Schools Partnered</p>
          </div>
          <div className="impact-card">
            <h4>1000+</h4>
            <p>Families Empowered</p>
          </div>
          <div className="impact-card">
            <h4>10+</h4>
            <p>Years of Service</p>
          </div>
        </div>
      </section>

      <section className="team-section">
        <h2>Our Team</h2>
        <p>Meet the dedicated individuals behind Parvarish</p>

        <div className="team-grid">
          <div className="team-member">
            <h3>Dr. Sujata Khedkar</h3>
            <p>Group Mentor</p>
          </div>

          <div className="team-member">
            <h3>Sejal Chaudhari</h3>
            <p>Group Member</p>
          </div>

          <div className="team-member">
            <h3>Harsh Dhebe</h3>
            <p>Group Member</p>
          </div>

          <div className="team-member">
            <h3>Gauri Doiphode</h3>
            <p>Group Member</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage; 