import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './SidePanel.css';

const SidePanel = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/signin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems = [
    { path: '/profile', label: 'Profile', icon: 'fas fa-user' },
    { path: '/donations', label: 'Donations', icon: 'fas fa-hand-holding-heart' },
    { path: '/volunteer-history', label: 'Volunteer History', icon: 'fas fa-history' },
  ];

  if (user?.role === 'admin') {
    menuItems.push({ path: '/admin', label: 'Admin Dashboard', icon: 'fas fa-cog' });
  }

  return (
    <div className={`side-panel ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="side-panel-header">
        <div className="user-info">
          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          {!isCollapsed && (
            <div className="user-details">
              <h3>{user?.name}</h3>
              <p>{user?.email}</p>
            </div>
          )}
        </div>
        <button 
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <i className={`fas fa-chevron-${isCollapsed ? 'right' : 'left'}`}></i>
        </button>
      </div>

      <nav className="side-panel-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <i className={item.icon}></i>
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="side-panel-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default SidePanel; 