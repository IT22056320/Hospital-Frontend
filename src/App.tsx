import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RegisterContainer from './components/Auth/RegisterContainer';
import LoginContainer from './components/Auth/LoginContainer';
import Profile from './components/Profile/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthContextProvider } from './context/AuthContext';
import HomePage from './components/HomePage';
import Layout from './components/Layout';

const App: React.FC = () => {
  return (
    <AuthContextProvider>
      <Layout>
      <div>
        <Routes>
        <Route path="/" element={<HomePage  />} />
          <Route path="/register" element={<RegisterContainer />} />
          <Route path="/login" element={<LoginContainer />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      </Layout>
    </AuthContextProvider>
  );
};

export default App;
