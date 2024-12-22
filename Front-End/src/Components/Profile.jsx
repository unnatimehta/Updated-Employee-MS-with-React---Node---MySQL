// Profile.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css'; // Import the CSS file

const Profile = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch profiles from the API
    axios.get('http://localhost:3000/auth/employee')
      .then(response => {
        if (response.data.Status) {
          setProfiles(response.data.Result);
        }
      })
      .catch(error => {
        console.error("Error fetching profiles:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>All Profiles</h1>
      <div className="profiles">
        {profiles.map(profile => (
          <div key={profile.id} className="profile-card">
            <img src={`http://localhost:3000/Images/${profile.image}`} alt={profile.name} className="profile-image" />
            <h2>{profile.name}</h2>
            <p>Email: {profile.email}</p>
            <p>Salary: ${profile.salary}</p>
            <p>Address: {profile.address}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
