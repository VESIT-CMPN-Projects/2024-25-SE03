import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';
import logo from '../assets/logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const userMenuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <Link to="/">
            <div className="logo-container">
              <img src={logo} alt="Parvarish Logo" className="logo-image" />
              <h1 className="logo-text">PARVARISH</h1>
            </div>
            <p className="tagline">Empowering Communities</p>
          </Link>
        </div>

        <div className={`mobile-menu-button ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul>
            <li className={location.pathname === '/' ? 'active' : ''}>
              <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
            </li>
            <li className={location.pathname === '/about' ? 'active' : ''}>
              <Link to="/about" onClick={() => setIsMenuOpen(false)}>About Us</Link>
            </li>
            <li className={location.pathname === '/programs' ? 'active' : ''}>
              <Link to="/programs" onClick={() => setIsMenuOpen(false)}>Programs</Link>
            </li>
            <li className={location.pathname === '/achievements' ? 'active' : ''}>
              <Link to="/achievements" onClick={() => setIsMenuOpen(false)}>Achievements</Link>
            </li>
            <li className={location.pathname === '/volunteer' ? 'active' : ''}>
              <Link to="/volunteer" onClick={() => setIsMenuOpen(false)}>Volunteer</Link>
            </li>
            <li className={location.pathname === '/donate' ? 'active' : ''}>
              <Link to="/donate" onClick={() => setIsMenuOpen(false)}>Donate</Link>
            </li>
            <li className={location.pathname === '/contact' ? 'active' : ''}>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            </li>
            {isAuthenticated && user?.role === 'admin' && (
              <li className={location.pathname === '/admin' ? 'active' : ''}>
                <Link to="/admin" onClick={() => setIsMenuOpen(false)}>Admin</Link>
              </li>
            )}
          </ul>
        </nav>

        <div className="header-buttons">
          {user ? (
            <>
              <div className="user-menu" ref={userMenuRef}>
                <button
                  className="user-menu-button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <div className="user-avatar">
                    <i className="fas fa-user"></i>
                  </div>
                  <span className="user-name">{user?.name?.split(' ')[0]}</span>
                  <span className="user-role">{user?.role || 'Member'}</span>
                  <div className={`user-dropdown ${isUserMenuOpen ? 'active' : ''}`}>
                    <div className="dropdown-header">
                      <div className="dropdown-avatar">
                        <i className="fas fa-user"></i>
                      </div>
                      <div className="dropdown-user-info">
                        <span className="dropdown-name">{user?.name}</span>
                        <span className="dropdown-email">{user?.email}</span>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link to="/profile" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                      <i className="fas fa-user-circle"></i>
                      My Profile
                    </Link>
                    <Link to="/profile?tab=donations" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                      <i className="fas fa-hand-holding-heart"></i>
                      My Donations
                    </Link>
                    <Link to="/profile?tab=volunteer" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                      <i className="fas fa-hands-helping"></i>
                      Volunteer History
                    </Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                        <i className="fas fa-tachometer-alt"></i>
                        Admin Dashboard
                      </Link>
                    )}
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout} className="dropdown-item logout-btn">
                      <i className="fas fa-sign-out-alt"></i>
                      Logout
                    </button>
                  </div>
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/signin" className="btn-text">Sign In</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 