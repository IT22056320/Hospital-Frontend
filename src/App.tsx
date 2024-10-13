import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RegisterContainer from './components/Auth/RegisterContainer';
import LoginContainer, { USER_ROLES } from './components/Auth/LoginContainer';
import Profile from './components/Profile/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute'; // Role-based protection
import { AuthContextProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import Layout from './components/Layout';
import StaffManagement from './pages/StaffManagementPage';
import StaffListPage from './pages/StaffListPage';
import StaffUpdatePage from './pages/StaffUpdatePage';
import BookAppointmentPage from './pages/BookAppointmentPage';
import StaffDetailsPage from './pages/StaffDetailsPage';
import DoctorListPage from './pages/DoctorListPage';
import AppointmentListPage from './pages/AppointmentListPage ';
import StripePayment from './pages/PaymentForm';
import BankDepositForm from './pages/BankDepositForm';
import ChoosePaymentMethod from './pages/ChoosePaymentMethod';
import StaffSchedulePage from './pages/StaffSchedulePage';
import Unauthorized from './pages/Unauthorized'; // Unauthorized page
import DoctorDashboard from './pages/DoctorDashboard'; // Doctor Dashboard
import AdminDashboard from './pages/AdminDashboard'; // Admin Dashboard
import NurseDashboard from './pages/NurseDashboard'; // Nurse Dashboard
import PatientDashboard from './pages/PatientDashboard';

const App: React.FC = () => {
  return (
    <AuthContextProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterContainer />} />
          <Route path="/login" element={<LoginContainer />} />
          <Route path="/staff-form" element={<StaffManagement />} />
          <Route path="/staff-list" element={<StaffListPage />} />
          <Route path="/staff-update/:id" element={<StaffUpdatePage />} />
          <Route path="/staff-details/:staffId" element={<StaffDetailsPage />} />
          <Route path="/doctor-list" element={<DoctorListPage />} />
          <Route path="/book-appointment/:staffId" element={<BookAppointmentPage />} />
          <Route path="/appointments" element={<AppointmentListPage />} />
          <Route path="/payment/credit-card" element={<StripePayment />} />
          <Route path="/payment/bank-deposit" element={<BankDepositForm />} />
          <Route path="/choose-payment" element={<ChoosePaymentMethod />} />
          <Route path="/staff/:staffId/schedule" element={<StaffSchedulePage />} />

          {/* Profile route with basic protection */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Unauthorized page */}
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Role-protected routes */}
          <Route element={<RoleProtectedRoute allowedRole={USER_ROLES.DOCTOR} />}>
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          </Route>
          <Route element={<RoleProtectedRoute allowedRole={USER_ROLES.ADMIN} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Route>
          <Route element={<RoleProtectedRoute allowedRole={USER_ROLES.PATIENT} />}>
            <Route path="/patient-dashboard" element={<PatientDashboard />} />
          </Route>
          <Route element={<RoleProtectedRoute allowedRole={USER_ROLES.NURSE} />}>
            <Route path="/nurse-dashboard" element={<NurseDashboard />} />
          </Route>
        </Routes>
      </Layout>
    </AuthContextProvider>
  );
};

export default App;
