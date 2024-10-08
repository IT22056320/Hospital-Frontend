import React, { useState } from 'react';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';

interface RegisterProps {
  handleRegister: (username: string, email: string, password: string) => void;
  message: string;
}

const Register: React.FC<RegisterProps> = ({ handleRegister, message }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleRegister(username, email, password);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="text-center">Register</h2>
          <Form onSubmit={onSubmit}>
            <Form.Group controlId="formBasicUsername" className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail" className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Register
            </Button>
          </Form>
          {message && <p className="text-center mt-3">{message}</p>}
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
