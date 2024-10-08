import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import Login from './Login';

const LoginContainer: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate(); // Hook for navigation

  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await AuthService.login(email, password);

      // Store the token or user data after successful login
      if (result.token) {
        localStorage.setItem('token', result.token); // Store token in localStorage
        setMessage('Login successful! Redirecting to Homepage...');
        
        // Redirect to profile or another protected route
        setTimeout(() => {
          navigate('/'); // Navigate to profile page after login
        }, 2000);
      } else {
        setMessage('Login failed: No token received.');
      }
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Login failed');
    }
  };

  return <Login handleLogin={handleLogin} message={message} />;
};

export default LoginContainer;
