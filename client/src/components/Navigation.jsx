import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navigation.css';

const Navigation = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          SkillSwap
        </Link>
        
        <div className="nav-menu">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className={`nav-link ${isActive('/profile')}`}>
                Profile
              </Link>
              <Link to="/skills" className={`nav-link ${isActive('/skills')}`}>
                Skills
              </Link>
              <Link to="/swap-requests" className={`nav-link ${isActive('/swap-requests')}`}>
                Swap Requests
              </Link>
              <Link to="/ratings" className={`nav-link ${isActive('/ratings')}`}>
                Ratings
              </Link>
              <div className="nav-user">
                <span className="user-name">Hello, {user?.name}</span>
                <button onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className={`nav-link ${isActive('/login')}`}>
                Login
              </Link>
              <Link to="/register" className={`nav-link ${isActive('/register')}`}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;