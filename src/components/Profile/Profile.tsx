import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext'; // Import your AuthContext
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext); // Assuming your AuthContext has `user` and `logout`
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Call the logout function from the context
    navigate('/login'); // Redirect to login after logout
  };

  if (!isAuthenticated) {
    return <div>You must be logged in to view this page.</div>;
  }

  return (
    <div>
      <h2>Profile Page</h2>
      <p>Username: {user?.username}</p>
      <p>Email: {user?.email}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;
