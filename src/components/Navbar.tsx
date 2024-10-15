import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Navbar as ReactBootstrapNavbar, Container, Nav } from 'react-bootstrap';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth(); // Access context
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout(); // Call the logout function from context
    navigate('/login'); // Redirect to login page
  };

  // Determine the appropriate dashboard link based on user role
  const getDashboardLink = () => {
    if (user?.role === 'DOCTOR') {
      return '/doctor-dashboard';
    } else if (user?.role === 'ADMIN') {
      return '/admin-dashboard';
    } else if (user?.role === 'NURSE') {
      return '/nurse-dashboard';
    } else if (user?.role === 'PATIENT') {
      return '/patient-dashboard';
    } else {
      return '/'; // Default to home page if role is undefined or unrecognized
    }
  };

  // Links based on user roles
  const renderLinksByRole = () => {
    if (user?.role === 'DOCTOR') {
      return (
        <>
          <Nav.Link as={Link} to="/doctor-dashboard">Doctor Dashboard</Nav.Link>
          <Nav.Link as={Link} to="/docotr-appointments">My Appointments</Nav.Link>
          <Nav.Link as={Link} to="/patient-list">Patient Management</Nav.Link>
        </>
      );
    } else if (user?.role === 'ADMIN') {
      return (
        <>
          <Nav.Link as={Link} to="/admin-dashboard">Admin Dashboard</Nav.Link>
          <Nav.Link as={Link} to="/staff-list">Staff Management</Nav.Link>
          <Nav.Link as={Link} to="/admin-patients">Patient List</Nav.Link>
        </>
      );
    } else if (user?.role === 'NURSE') {
      return (
        <>
          <Nav.Link as={Link} to="/nurse-dashboard">Nurse Dashboard</Nav.Link>
          <Nav.Link as={Link} to="/patient-list">Patient Management</Nav.Link>
        </>
      );
    } else if (user?.role === 'PATIENT') {
      return (
        <>
          <Nav.Link as={Link} to="/patient-dashboard">Patient Dashboard</Nav.Link>
          <Nav.Link as={Link} to="/doctor-list">Doctor Details</Nav.Link>
          <Nav.Link as={Link} to="/appointments">Appointment Details</Nav.Link>
          <Nav.Link as={Link} to="/insurance">Insurance Management</Nav.Link>
          <Nav.Link as={Link} to="/payment-list">Payment History</Nav.Link>
        </>
      );
    } else {
      return null; // If role is undefined or not recognized
    }
  };

  return (
    <ReactBootstrapNavbar style={{ backgroundColor: '#003366' }} variant="dark" expand="lg" sticky="top">
      <Container>
        {/* Logo click directs to the appropriate dashboard based on user role */}
        <ReactBootstrapNavbar.Brand as={Link} to={getDashboardLink()}>
          <img 
            src={'../../src/assets/Logo.png'} 
            alt="Logo" 
            style={{ height: '60px', marginRight: '10px' }} // Adjust size as needed
          />
        </ReactBootstrapNavbar.Brand>
        <ReactBootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <ReactBootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {!isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            ) : (
              <>
                
                {renderLinksByRole()} {/* Render role-based links */}
                <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                <Button variant="danger" onClick={handleLogout} className="ms-2">Logout</Button>
              </>
            )}
          </Nav>
        </ReactBootstrapNavbar.Collapse>
      </Container>
    </ReactBootstrapNavbar>
  );
};

export default Navbar;
