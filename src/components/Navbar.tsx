import React, { useContext } from 'react';
import { AuthContext, useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Navbar as ReactBootstrapNavbar, Container, Nav } from 'react-bootstrap';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth(); // Access context
  const navigate = useNavigate();
  console.log(isAuthenticated);
  const handleLogout = () => {
    logout(); // Call the logout function from context
    navigate('/login'); // Redirect to login page
  };

  return (
    <ReactBootstrapNavbar bg="primary" variant="dark" expand="lg" sticky="top">
      <Container>
        <ReactBootstrapNavbar.Brand as={Link} to="/">Hospital Management</ReactBootstrapNavbar.Brand>
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
                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
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