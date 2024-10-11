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
import BookAppointmentPage from './pages/BookAppointmentPage';
import StaffDetailsPage from './pages/StaffDetailsPage';
import DoctorListPage from './pages/DoctorListPage';
import AppointmentListPage from './pages/AppointmentListPage ';
import StripePayment from './pages/PaymentForm';
import BankDepositForm from './pages/BankDepositForm';
import ChoosePaymentMethod from './pages/ChoosePaymentMethod';

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
          <Route path="/staff-details/:staffId" element={<StaffDetailsPage />} />
          <Route path="/doctor-list" element={<DoctorListPage />} />
         <Route path="/book-appointment/:doctorId" element={<BookAppointmentPage />} />
           <Route path="/appointments" element={<AppointmentListPage />} />
           <Route path="/payment/credit-card" element={<StripePayment />} />
        <Route path="/payment/bank-deposit" element={<BankDepositForm />} />
        <Route path="/choose-payment" element={<ChoosePaymentMethod />} />
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
