import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import AuthHeader from './components/AuthHeader';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProgramsPage from './pages/ProgramsPage';
import AchievementsPage from './pages/AchievementsPage';
import VolunteerPage from './pages/VolunteerPage';
import DonationPage from './pages/DonationPage';
import ContactPage from './pages/ContactPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import UserProfilePage from './pages/UserProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

// Import Font Awesome for icons
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';

// Add Font Awesome icons to library
library.add(fab, fas);

// Protected Route Component
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/signin" />;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  return isAuthenticated && user?.role === 'admin' ? children : <Navigate to="/" />;
};

function App() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Check if current path is signin or signup
  const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup';

  return (
    <div className="app">
      {!isAuthenticated && <Header />}
      {isAuthenticated && !isAuthPage && <AuthHeader />}
      
      <main className={`main-content ${isAuthenticated && !isAuthPage ? 'with-auth-header' : ''}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/volunteer" element={<VolunteerPage />} />
          <Route path="/donate" element={<DonationPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Protected Routes */}
          <Route path="/profile" element={
            <PrivateRoute>
              <UserProfilePage />
            </PrivateRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
        </Routes>
      </main>
      
      {!isAuthenticated && <Footer />}
    </div>
  );
}

// Wrap the entire app with AuthProvider
function AppWrapper() {
  return (
    <AuthProvider>
      <Router>
        <App />
      </Router>
    </AuthProvider>
  );
}

export default AppWrapper;
