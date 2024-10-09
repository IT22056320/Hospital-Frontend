import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  

  const handleLogout = () => {
   
    AuthService.logout();
    navigate('/login'); // Redirect to login page after logout
  };
 
  const handleProfile = ()=>{
  navigate('/profile');
  }
  
 
  return (
    
    <div>
      <h1>Welcome to the HomePage</h1>
      <p>This is the homepage of the application.</p>
      {AuthService.isAuthenticated() ? (
        <>
          <p>You are logged in!</p>
          <button onClick={handleLogout}>Logout</button>
          
          <button onClick={handleProfile}>Profile</button>
        </>
      ) : (
        <>
          <p>Please log in to access your profile and other features.</p>
          <button onClick={() => navigate('/login')}>Login</button>
        </>
      )}
    </div>
  );
};

export default HomePage;
