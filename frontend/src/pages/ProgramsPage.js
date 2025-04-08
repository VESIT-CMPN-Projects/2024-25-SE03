import React, { useState } from 'react';
import './ProgramsPage.css';

const ProgramsPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Programs' },
    { id: 'education', name: 'Educational Support' },
    { id: 'mental-health', name: 'Mental Health' },
    { id: 'training', name: 'Training & Workshops' },
    { id: 'community', name: 'Community Support' }
  ];

  const programs = [
    {
      id: 1,
      title: 'Educational Consulting',
      category: 'education',
      description: 'Helping families and students navigate the NIOS Board, ensuring children with special needs receive an education tailored to their pace and abilities.',
      icon: 'fas fa-graduation-cap'
    },
    {
      id: 2,
      title: 'Leadership Development',
      category: 'education',
      description: 'Empowering children to build confidence, self-belief, and the skills needed to take charge of their future.',
      icon: 'fas fa-star'
    },
    {
      id: 3,
      title: 'Training & Workshops',
      category: 'training',
      description: 'Equipping parents, teachers, and caregivers with the knowledge and tools to support children\'s academic and emotional growth.',
      icon: 'fas fa-chalkboard-teacher'
    },
    {
      id: 4,
      title: 'Diversity & Inclusion',
      category: 'community',
      description: 'Partnering with schools and organizations to turn inclusivity from a concept into everyday practice.',
      icon: 'fas fa-users'
    },
    {
      id: 5,
      title: 'Content Strategy & Writing',
      category: 'education',
      description: 'Creating accessible and engaging educational content tailored to the unique learning styles of neurodiverse children.',
      icon: 'fas fa-book'
    },
    {
      id: 6,
      title: 'Research & Data Reporting',
      category: 'mental-health',
      description: 'Continuously gathering insights to refine inclusive education and mental health practices, ensuring better support for children nationwide.',
      icon: 'fas fa-chart-bar'
    },
    {
      id: 7,
      title: 'Peer Learning Support',
      category: 'education',
      description: 'Encouraging children to learn from and support each other, fostering social skills, collaboration, and mutual growth.',
      icon: 'fas fa-hands-helping'
    },
    {
      id: 8,
      title: 'Sibling Support & Awareness',
      category: 'community',
      description: 'Recognizing the role of siblings in a neurodiverse family and equipping them with the tools to foster understanding and empathy.',
      icon: 'fas fa-heart'
    },
    {
      id: 9,
      title: 'Parent Empowerment',
      category: 'mental-health',
      description: 'Providing guidance, training, and resources to help parents become strong advocates for their children\'s education and well-being.',
      icon: 'fas fa-user-friends'
    }
  ];

  const filteredPrograms = activeCategory === 'all' 
    ? programs 
    : programs.filter(program => program.category === activeCategory);

  return (
    <div className="programs-page">
      <section className="page-header">
        <div className="container">
          <h1>Our Programs</h1>
          <p>Discover our comprehensive range of services designed to support neurodiverse children and their families.</p>
        </div>
      </section>

      <section className="programs-content">
        <div className="container">
          <div className="programs-filter">
            {categories.map(category => (
              <button 
                key={category.id}
                className={`filter-btn ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="programs-grid">
            {filteredPrograms.map(program => (
              <div className="program-card" key={program.id}>
                <div className="program-icon">
                  <i className={program.icon}></i>
                </div>
                <h3>{program.title}</h3>
                <p>{program.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="programs-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Join Our Mission</h2>
            <p>Together, we can create a future where every child thrives with dignity and confidence.</p>
            <div className="cta-buttons">
              <a href="/donate" className="btn btn-primary">Support Our Programs</a>
              <a href="/volunteer" className="btn btn-secondary">Join Our Community</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProgramsPage; 