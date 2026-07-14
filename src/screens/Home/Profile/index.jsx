import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, loading, isAuthenticated, authChecked } = useSelector(state => state.user);

  React.useEffect(() => {
    if (authChecked && !isAuthenticated) {
      navigate('/login');
    }
  }, [authChecked, isAuthenticated, navigate]);

  if (!authChecked || loading) {
    return <div className="profile-loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; 
  }

  if (!user || Object.keys(user).length === 0) {
    return <div className="profile-empty">No user information available.</div>;
  }

  return (
    <div className="profile-container">
      <h2 className="profile-title">Profile</h2>
      <div className="profile-info">
        {user.name && (
          <div className="profile-row">
            <span className="profile-label">Name:</span>
            <span className="profile-value">{user.name}</span>
          </div>
        )}
        {user.email && (
          <div className="profile-row">
            <span className="profile-label">Email:</span>
            <span className="profile-value">{user.email}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
