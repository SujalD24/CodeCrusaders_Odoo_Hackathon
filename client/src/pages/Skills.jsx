import React, { useState, useEffect } from 'react';
import { userService } from '../services/authService';
import './Skills.css';

const Skills = () => {
  const [skillsData, setSkillsData] = useState({
    skillsOffered: [],
    skillsWanted: []
  });
  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newSkillWanted, setNewSkillWanted] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const data = await userService.getSkills();
      setSkillsData({
        skillsOffered: data.skillsOffered || [],
        skillsWanted: data.skillsWanted || []
      });
    } catch (error) {
      console.error('Failed to load skills:', error);
    }
  };

  const addSkill = (type, skill) => {
    if (!skill.trim()) return;
    
    setSkillsData(prev => ({
      ...prev,
      [type]: [...prev[type], skill.trim()]
    }));
    
    if (type === 'skillsOffered') {
      setNewSkillOffered('');
    } else {
      setNewSkillWanted('');
    }
  };

  const removeSkill = (type, index) => {
    setSkillsData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');

    try {
      await userService.updateSkills(skillsData);
      setMessage('Skills updated successfully!');
    } catch (error) {
      setMessage('Failed to update skills. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="skills-container">
      <div className="skills-card">
        <h2>Manage Skills</h2>
        {message && (
          <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <div className="skills-section">
          <h3>Skills I Offer</h3>
          <div className="add-skill">
            <input
              type="text"
              value={newSkillOffered}
              onChange={(e) => setNewSkillOffered(e.target.value)}
              placeholder="Add a skill you can teach"
              onKeyPress={(e) => e.key === 'Enter' && addSkill('skillsOffered', newSkillOffered)}
            />
            <button 
              onClick={() => addSkill('skillsOffered', newSkillOffered)}
              className="add-button"
            >
              Add
            </button>
          </div>
          <div className="skills-list">
            {skillsData.skillsOffered.map((skill, index) => (
              <div key={index} className="skill-tag">
                <span>{skill}</span>
                <button 
                  onClick={() => removeSkill('skillsOffered', index)}
                  className="remove-button"
                >
                  ×
                </button>
              </div>
            ))}
            {skillsData.skillsOffered.length === 0 && (
              <p className="empty-state">No skills added yet</p>
            )}
          </div>
        </div>

        <div className="skills-section">
          <h3>Skills I Want to Learn</h3>
          <div className="add-skill">
            <input
              type="text"
              value={newSkillWanted}
              onChange={(e) => setNewSkillWanted(e.target.value)}
              placeholder="Add a skill you want to learn"
              onKeyPress={(e) => e.key === 'Enter' && addSkill('skillsWanted', newSkillWanted)}
            />
            <button 
              onClick={() => addSkill('skillsWanted', newSkillWanted)}
              className="add-button"
            >
              Add
            </button>
          </div>
          <div className="skills-list">
            {skillsData.skillsWanted.map((skill, index) => (
              <div key={index} className="skill-tag wanted">
                <span>{skill}</span>
                <button 
                  onClick={() => removeSkill('skillsWanted', index)}
                  className="remove-button"
                >
                  ×
                </button>
              </div>
            ))}
            {skillsData.skillsWanted.length === 0 && (
              <p className="empty-state">No skills added yet</p>
            )}
          </div>
        </div>

        <button 
          onClick={handleSave} 
          disabled={loading} 
          className="save-button"
        >
          {loading ? 'Saving...' : 'Save Skills'}
        </button>
      </div>
    </div>
  );
};

export default Skills;