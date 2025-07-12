import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to SkillSwap</h1>
        <p className="hero-subtitle">
          Exchange skills with others and learn something new while teaching what you know best.
        </p>
        
        {isAuthenticated ? (
          <div className="welcome-back">
            <h2>Welcome back, {user?.name}!</h2>
            <div className="quick-actions">
              <Link to="/profile" className="action-button primary">
                View Profile
              </Link>
              <Link to="/skills" className="action-button">
                Manage Skills
              </Link>
              <Link to="/swap-requests" className="action-button">
                Browse Swaps
              </Link>
            </div>
          </div>
        ) : (
          <div className="auth-actions">
            <Link to="/register" className="action-button primary">
              Get Started
            </Link>
            <Link to="/login" className="action-button">
              Login
            </Link>
          </div>
        )}
      </div>

      <div className="features-section">
        <h2>How SkillSwap Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Share Your Skills</h3>
            <p>List the skills you can teach and what you want to learn in return.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>Find Matches</h3>
            <p>Browse requests and find people who offer what you want to learn.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3>Learn & Rate</h3>
            <p>Exchange knowledge and rate your experience to build trust in the community.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;