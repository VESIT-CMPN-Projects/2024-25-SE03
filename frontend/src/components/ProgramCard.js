import React from 'react';
import './ProgramCard.css';

const ProgramCard = ({ title, description, icon }) => {
  return (
    <div className="program-card">
      <div className="program-icon">
        <i className={icon || 'fas fa-star'}></i>
      </div>
      <div className="program-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default ProgramCard; 