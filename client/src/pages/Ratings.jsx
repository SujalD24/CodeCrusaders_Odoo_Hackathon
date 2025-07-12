import React, { useState, useEffect } from 'react';
import { ratingService } from '../services/authService';
import './Ratings.css';

const Ratings = () => {
  const [ratings, setRatings] = useState([]);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [newRating, setNewRating] = useState({
    targetUser: '',
    skillCategory: '',
    rating: 5,
    comment: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadRatings();
  }, []);

  const loadRatings = async () => {
    try {
      const data = await ratingService.getRatings();
      setRatings(data);
    } catch (error) {
      console.error('Failed to load ratings:', error);
      // Mock data for demo purposes
      setRatings([
        {
          id: 1,
          fromUser: 'John Doe',
          toUser: 'Jane Smith',
          skillCategory: 'React Development',
          rating: 5,
          comment: 'Excellent teacher! Very patient and knowledgeable.',
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          fromUser: 'Alice Johnson',
          toUser: 'Bob Wilson',
          skillCategory: 'JavaScript',
          rating: 4,
          comment: 'Good explanation of concepts, helpful examples.',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 3,
          fromUser: 'Mike Brown',
          toUser: 'Sarah Davis',
          skillCategory: 'UI/UX Design',
          rating: 5,
          comment: 'Amazing design skills and great feedback on my work.',
          createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    try {
      await ratingService.submitRating(newRating);
      setMessage('Rating submitted successfully!');
      setShowSubmitForm(false);
      setNewRating({ targetUser: '', skillCategory: '', rating: 5, comment: '' });
      loadRatings();
    } catch (error) {
      setMessage('Failed to submit rating. Please try again.');
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`star ${index < rating ? 'filled' : 'empty'}`}
      >
        ★
      </span>
    ));
  };

  const handleStarClick = (rating) => {
    setNewRating({ ...newRating, rating });
  };

  if (loading) {
    return <div className="loading">Loading ratings...</div>;
  }

  return (
    <div className="ratings-container">
      <div className="ratings-header">
        <h2>Ratings & Reviews</h2>
        <button
          onClick={() => setShowSubmitForm(!showSubmitForm)}
          className="submit-rating-button"
        >
          {showSubmitForm ? 'Cancel' : 'Submit Rating'}
        </button>
      </div>

      {message && (
        <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {showSubmitForm && (
        <div className="submit-form-card">
          <h3>Submit New Rating</h3>
          <form onSubmit={handleSubmitRating}>
            <div className="form-group">
              <label>User to Rate</label>
              <input
                type="text"
                value={newRating.targetUser}
                onChange={(e) => setNewRating({ ...newRating, targetUser: e.target.value })}
                required
                placeholder="Enter username or email"
              />
            </div>
            <div className="form-group">
              <label>Skill Category</label>
              <input
                type="text"
                value={newRating.skillCategory}
                onChange={(e) => setNewRating({ ...newRating, skillCategory: e.target.value })}
                required
                placeholder="e.g., JavaScript, Design, Photography"
              />
            </div>
            <div className="form-group">
              <label>Rating</label>
              <div className="star-rating">
                {Array.from({ length: 5 }, (_, index) => (
                  <span
                    key={index}
                    className={`star clickable ${index < newRating.rating ? 'filled' : 'empty'}`}
                    onClick={() => handleStarClick(index + 1)}
                  >
                    ★
                  </span>
                ))}
                <span className="rating-text">({newRating.rating}/5)</span>
              </div>
            </div>
            <div className="form-group">
              <label>Comment (Optional)</label>
              <textarea
                value={newRating.comment}
                onChange={(e) => setNewRating({ ...newRating, comment: e.target.value })}
                placeholder="Share your experience..."
                rows="3"
              ></textarea>
            </div>
            <button type="submit" className="submit-button">Submit Rating</button>
          </form>
        </div>
      )}

      <div className="ratings-list">
        {ratings.length === 0 ? (
          <div className="empty-state">
            <p>No ratings found. Be the first to submit a rating!</p>
          </div>
        ) : (
          <>
            <h3>Recent Ratings</h3>
            {ratings.map(rating => (
              <div key={rating.id} className="rating-card">
                <div className="rating-header">
                  <div className="user-info">
                    <strong>{rating.fromUser}</strong> rated <strong>{rating.toUser}</strong>
                  </div>
                  <div className="rating-date">
                    {new Date(rating.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="rating-content">
                  <div className="skill-category">
                    <span className="category-tag">{rating.skillCategory}</span>
                  </div>
                  <div className="star-display">
                    {renderStars(rating.rating)}
                    <span className="rating-value">({rating.rating}/5)</span>
                  </div>
                  {rating.comment && (
                    <p className="rating-comment">"{rating.comment}"</p>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Ratings;