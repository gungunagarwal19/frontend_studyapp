import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../../../../store/User/UserAction';
import { clearSections } from '../../../../store/Section/SectionReducer';
import Loading from '../../../components/Loading';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading, isAuthenticated, authChecked } = useSelector(state => state.user);

  useEffect(() => {
    if (authChecked && !isAuthenticated) {
      navigate('/login');
    }
  }, [authChecked, isAuthenticated, navigate]);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      dispatch(clearSections());
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!authChecked || loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return null; 
  }

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : "U");

  return (
    <div className="profile-page-wrapper">
      <div className="profile-card">
        {/* Profile Header & Avatar */}
        <div className="profile-header-banner">
          <div className="profile-avatar-bubble">
            <span>{userInitial}</span>
          </div>
          <div className="profile-title-group">
            <h1 className="profile-user-name">{user?.name || "Learnmate User"}</h1>
            <span className="profile-status-badge">Active Student</span>
          </div>
        </div>

        {/* Account Details List */}
        <div className="profile-details-section">
          <h2 className="section-small-title">Account Information</h2>
          
          <div className="detail-item-row">
            <div className="detail-item-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Full Name</span>
            </div>
            <span className="detail-item-value">{user?.name || "Not provided"}</span>
          </div>

          <div className="detail-item-row">
            <div className="detail-item-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span>Email Address</span>
            </div>
            <span className="detail-item-value">{user?.email || "Not provided"}</span>
          </div>

          <div className="detail-item-row">
            <div className="detail-item-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span>Authentication</span>
            </div>
            <span className="detail-item-value badge" style={{ color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.12)' }}>
              Verified
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="profile-actions-footer">
          <Link to="/" className="btn btn-secondary">
            Go to Dashboard
          </Link>
          <button onClick={handleLogout} className="btn btn-danger">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
