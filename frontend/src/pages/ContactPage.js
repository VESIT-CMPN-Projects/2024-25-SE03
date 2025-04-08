import React, { useState } from 'react';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState({
    submitting: false,
    submitted: false,
    error: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus({ submitting: true, submitted: false, error: null });
    
    // Simulate form submission
    setTimeout(() => {
      setFormStatus({ submitting: false, submitted: true, error: null });
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="contact-page">
      <section className="page-header">
        <div className="container">
          <h1>Contact Us</h1>
          <p>Get in touch with us for inquiries about our programs, support, or collaboration opportunities</p>
        </div>
      </section>

      <section className="contact-content">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>Get In Touch</h2>
              <p>
                Whether you're a parent seeking support for your child, an educator looking to collaborate, 
                or someone passionate about inclusive education, we're here to help. Reach out to us for 
                guidance, resources, or to learn more about our programs.
              </p>
              
              <div className="contact-details">
                <div className="contact-item">
                  <div className="icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="text">
                    <h3>Our Location</h3>
                    <p>Navi Mumbai, Maharashtra, India</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <div className="icon">
                    <i className="fas fa-phone-alt"></i>
                  </div>
                  <div className="text">
                    <h3>Phone Number</h3>
                    <p>Contact us through email for phone consultation</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <div className="icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="text">
                    <h3>Email Address</h3>
                    <p>parvarish.shh.0823@gmail.com</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <div className="icon">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div className="text">
                    <h3>Consultation Hours</h3>
                    <p>By appointment only</p>
                  </div>
                </div>
              </div>
              
              <div className="social-links">
                <h3>Connect With Us</h3>
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
            </div>
            
            <div className="contact-form-container">
              <h2>Send Us a Message</h2>
              
              {formStatus.submitted ? (
                <div className="success-message">
                  <i className="fas fa-check-circle"></i>
                  <h3>Message Sent Successfully!</h3>
                  <p>Thank you for contacting us. We'll get back to you as soon as possible.</p>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => setFormStatus({ submitting: false, submitted: false, error: null })}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Your Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Your Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message">Your Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="6"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={formStatus.submitting}
                  >
                    {formStatus.submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage; 