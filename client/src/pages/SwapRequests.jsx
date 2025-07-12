import React, { useState, useEffect } from 'react';
import { swapService } from '../services/authService';
import './SwapRequests.css';

const SwapRequests = () => {
  const [swapRequests, setSwapRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRequest, setNewRequest] = useState({
    skillOffered: '',
    skillWanted: '',
    description: '',
    duration: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSwapRequests();
  }, []);

  const loadSwapRequests = async () => {
    try {
      const data = await swapService.getSwapRequests();
      setSwapRequests(data);
    } catch (error) {
      console.error('Failed to load swap requests:', error);
      // Mock data for demo purposes
      setSwapRequests([
        {
          id: 1,
          requesterName: 'John Doe',
          skillOffered: 'JavaScript',
          skillWanted: 'Python',
          description: 'Looking to learn Python fundamentals in exchange for JavaScript tutoring',
          status: 'pending',
          duration: '2 weeks',
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          requesterName: 'Jane Smith',
          skillOffered: 'Design',
          skillWanted: 'React',
          description: 'UI/UX designer wanting to learn React development',
          status: 'accepted',
          duration: '1 month',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    try {
      await swapService.createSwapRequest(newRequest);
      setMessage('Swap request created successfully!');
      setShowCreateForm(false);
      setNewRequest({ skillOffered: '', skillWanted: '', description: '', duration: '' });
      loadSwapRequests();
    } catch (error) {
      setMessage('Failed to create swap request. Please try again.');
    }
  };

  const updateRequestStatus = async (id, status) => {
    try {
      await swapService.updateSwapRequest(id, status);
      setSwapRequests(prev =>
        prev.map(req => req.id === id ? { ...req, status } : req)
      );
      setMessage(`Request ${status} successfully!`);
    } catch (error) {
      setMessage('Failed to update request status.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'accepted': return '#28a745';
      case 'declined': return '#dc3545';
      case 'completed': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return <div className="loading">Loading swap requests...</div>;
  }

  return (
    <div className="swap-container">
      <div className="swap-header">
        <h2>Skill Swap Requests</h2>
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="create-button"
        >
          {showCreateForm ? 'Cancel' : 'Create Request'}
        </button>
      </div>

      {message && (
        <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {showCreateForm && (
        <div className="create-form-card">
          <h3>Create New Swap Request</h3>
          <form onSubmit={handleCreateRequest}>
            <div className="form-group">
              <label>Skill I Offer</label>
              <input
                type="text"
                value={newRequest.skillOffered}
                onChange={(e) => setNewRequest({...newRequest, skillOffered: e.target.value})}
                required
                placeholder="e.g., JavaScript, Design, Photography"
              />
            </div>
            <div className="form-group">
              <label>Skill I Want</label>
              <input
                type="text"
                value={newRequest.skillWanted}
                onChange={(e) => setNewRequest({...newRequest, skillWanted: e.target.value})}
                required
                placeholder="e.g., Python, Marketing, Guitar"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={newRequest.description}
                onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                required
                placeholder="Describe what you're offering and what you want to learn"
                rows="3"
              ></textarea>
            </div>
            <div className="form-group">
              <label>Duration</label>
              <select
                value={newRequest.duration}
                onChange={(e) => setNewRequest({...newRequest, duration: e.target.value})}
                required
              >
                <option value="">Select duration</option>
                <option value="1 week">1 week</option>
                <option value="2 weeks">2 weeks</option>
                <option value="1 month">1 month</option>
                <option value="2 months">2 months</option>
                <option value="3 months">3 months</option>
              </select>
            </div>
            <button type="submit" className="submit-button">Create Request</button>
          </form>
        </div>
      )}

      <div className="requests-list">
        {swapRequests.length === 0 ? (
          <div className="empty-state">
            <p>No swap requests found. Create your first request!</p>
          </div>
        ) : (
          swapRequests.map(request => (
            <div key={request.id} className="request-card">
              <div className="request-header">
                <h4>{request.requesterName}</h4>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(request.status) }}
                >
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </div>
              <div className="skill-exchange">
                <div className="skill-item">
                  <strong>Offers:</strong> {request.skillOffered}
                </div>
                <div className="exchange-arrow">⇄</div>
                <div className="skill-item">
                  <strong>Wants:</strong> {request.skillWanted}
                </div>
              </div>
              <p className="description">{request.description}</p>
              <div className="request-details">
                <span>Duration: {request.duration}</span>
                <span>Created: {new Date(request.createdAt).toLocaleDateString()}</span>
              </div>
              {request.status === 'pending' && (
                <div className="request-actions">
                  <button 
                    onClick={() => updateRequestStatus(request.id, 'accepted')}
                    className="accept-button"
                  >
                    Accept
                  </button>
                  <button 
                    onClick={() => updateRequestStatus(request.id, 'declined')}
                    className="decline-button"
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SwapRequests;