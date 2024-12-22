// Profile.jsx
import React from 'react';

const Profile = ({ profile }) => {
  return (
    <div className="profile-card">
      <h2>{profile.name}</h2>
      <p>Email: {profile.email}</p>
      <p>Position: {profile.position}</p>
      {/* Add other fields as needed */}
    </div>
  );
};

export default Profile;
