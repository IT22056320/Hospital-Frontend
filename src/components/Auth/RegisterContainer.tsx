import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import Register from './Register'; // Presentational component
import { useAuth } from '../../context/AuthContext';

const RegisterContainer: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate(); // Hook for navigating programmatically
  const { login } = useAuth();

  const handleRegister = async (username: string, email: string, password: string) => {
    try {
      const response = await AuthService.register(username, email, password);
      login(
        { 
          username: email, 
          email, 
          role: response.staff.role
        }, 
        response.token // Also pass the token here
      );
      setMessage('Registration successful! Redirecting to login...');
      navigate('/login');
    } catch (error: any) {
      console.log(error);
      setMessage(error.response?.data?.message || 'Registration failed');
    }
  };

  return <Register handleRegister={handleRegister} message={message} />;
};

export default RegisterContainer;
