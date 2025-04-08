import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { programsAPI } from '../services/api';
import ProgramCard from './ProgramCard';
import './ProgramsSection.css';

const ProgramsSection = ({ limit }) => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await programsAPI.getAll();
        setPrograms(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch programs. Please try again later.');
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [limit]);

  if (loading) {
    return <div className="programs-loading">Loading programs...</div>;
  }

  if (error) {
    return <div className="programs-error">{error}</div>;
  }

  if (!programs.length) {
    return <div className="programs-empty">No programs available at the moment.</div>;
  }

  const displayedPrograms = limit ? programs.slice(0, limit) : programs;

  return (
    <section className="programs-section">
      <h2>Our Programs</h2>
      <div className="programs-grid">
        {displayedPrograms.map((program) => (
          <ProgramCard
            key={program.id || program._id}
            title={program.title}
            description={program.description}
            icon={program.icon}
          />
        ))}
      </div>
      {limit && programs.length > limit && (
        <div className="programs-view-all">
          <Link to="/programs" className="btn btn-primary">
            View All Programs
          </Link>
        </div>
      )}
    </section>
  );
};

export default ProgramsSection; 