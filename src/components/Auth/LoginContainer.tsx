// src/pages/LoginContainer.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import Login from './Login';
import { useAuth } from '../../context/AuthContext';

export const USER_ROLES = {
  DOCTOR: "DOCTOR",
  ADMIN: "ADMIN",
  NURSE: "NURSE",
  PATIENT: "PATIENT"
};

const LoginContainer: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await AuthService.login(email, password);

      // Ensure token and role are defined before proceeding
      if (result.token && result.staffDetails.role) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('role', result.staffDetails.role); // Save role to localStorage

        // Pass the user information and token to the login function
        login(
          { 
            username: email, 
            email, 
            role: result.staffDetails.role
          }, 
          result.token // Also pass the token here
        );

        setMessage('Login successful! Redirecting to your dashboard...');
        
        // Redirect based on role
        if (result.staffDetails.role === USER_ROLES.DOCTOR) {
          setTimeout(() => {
            navigate('/doctor-dashboard');
          }, 2000);
        } else if (result.staffDetails.role === USER_ROLES.ADMIN) {
          setTimeout(() => {
            navigate('/admin-dashboard');
          }, 2000);
        } else if (result.staffDetails.role === USER_ROLES.NURSE) {
          setTimeout(() => {
            navigate('/nurse-dashboard');
          }, 2000);
        } else if (result.staffDetails.role === USER_ROLES.PATIENT) {  // Add this check for patients
          setTimeout(() => {
            navigate('/patient-dashboard');
          }, 2000);
        }else {
          setTimeout(() => {
            navigate('/'); // Default redirect
          }, 2000);
        }
      } else {
        setMessage('Login failed: No token or role received.');
      }
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Login failed.');
    }
  };

  return <Login handleLogin={handleLogin} message={message} />;
};

export default LoginContainer;
