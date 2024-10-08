import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import Register from './Register'; // Presentational component

const RegisterContainer: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate(); // Hook for navigating programmatically

  const handleRegister = async (username: string, email: string, password: string) => {
    try {
      const result = await AuthService.register(username, email, password);
      setMessage('Registration successful! Redirecting to login...');
      
      // Navigate to login page after successful registration
      setTimeout(() => {
        navigate('/login');
      }, 2000); // Adding a slight delay before navigation
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Registration failed');
    }
  };

  return <Register handleRegister={handleRegister} message={message} />;
};

export default RegisterContainer;
