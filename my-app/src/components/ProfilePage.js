import React from 'react';
import { Link } from 'react-router-dom';
import ProfilePictureUpload from './ProfilePictureUpload';
import '../App.css';

function ProfilePage({ user, profilePic, updateProfilePic }) {
  // Get personal details from localStorage using the user's UID
  const personalDetails = user ? 
    JSON.parse(localStorage.getItem(`personalDetails_${user.uid}`)) || {
      age: '',
      height: '',
      weight: '',
      gender: '',
      activityLevel: '',
      dietaryPreferences: []
    } : null;

  if (!user) {
    return <div className="not-logged-in">Please sign in to view your profile</div>;
  }

  return (
    <div className="profile-page">
      <h1>My Profile</h1>
      
      <div className="profile-section">
        <h2>Profile Picture</h2>
        <ProfilePictureUpload 
          currentPic={profilePic} 
          onUpdate={updateProfilePic}
        />
      </div>

      <div className="personal-details-summary">
        <div className="summary-header">
          <h2>Personal Details</h2>
          <Link to="/personal-details" className="update-details-btn">
            Update Details
          </Link>
        </div>
        
        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">Age</span>
            <span className="detail-value">{personalDetails.age || 'Not set'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Height</span>
            <span className="detail-value">{personalDetails.height ? `${personalDetails.height} cm` : 'Not set'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Weight</span>
            <span className="detail-value">{personalDetails.weight ? `${personalDetails.weight} kg` : 'Not set'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Gender</span>
            <span className="detail-value">{personalDetails.gender || 'Not set'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Activity Level</span>
            <span className="detail-value">{personalDetails.activityLevel || 'Not set'}</span>
          </div>
          {personalDetails.dietaryPreferences?.length > 0 && (
            <div className="detail-item full-width">
              <span className="detail-label">Dietary Preferences</span>
              <div className="preferences-container">
                {personalDetails.dietaryPreferences.map((pref, index) => (
                  <span key={index} className="preference-tag">{pref}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="account-info">
        <h2>Account Information</h2>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Name:</strong> {user?.displayName || 'Not set'}</p>
      </div>
    </div>
  );
}

export default ProfilePage;