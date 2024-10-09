import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RegisterContainer from './components/Auth/RegisterContainer';
import LoginContainer from './components/Auth/LoginContainer';
import Profile from './components/Profile/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthContextProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import Layout from './components/Layout';
import StaffManagement from './pages/StaffManagementPage';
import StaffListPage from './pages/StaffListPage';
import StaffUpdatePage from './pages/StaffUpdatePage';

const App: React.FC = () => {
  return (
    <AuthContextProvider>
      <Layout>
      <div>
        <Routes>
        <Route path="/" element={<HomePage  />} />
          <Route path="/register" element={<RegisterContainer />} />
          <Route path="/login" element={<LoginContainer />} />
          <Route path="/staff-form" element={<StaffManagement />} />
          <Route path="/staff-list" element={<StaffListPage />} />
          <Route path="/staff-update/:id" element={<StaffUpdatePage />} />
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
