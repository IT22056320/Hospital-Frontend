import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, Row, Col } from 'react-bootstrap';
import '../assets/ChoosePaymentMethod.css'; // Create a CSS file for custom styles

const ChoosePaymentMethod: React.FC = () => {
  return (
    <Container className="text-center py-5 choose-payment-container">
      <h2 className="mb-4">Select Payment Method</h2>
      <Row className="justify-content-center">
        <Col xs={12} sm={6} md={4} className="mb-3">
          <Link to="/payment-form">
            <Button variant="primary" className="w-100 py-2 custom-btn">
              Pay with Credit Card
            </Button>
          </Link>
        </Col>
        <Col xs={12} sm={6} md={4} className="mb-3">
          <Link to="/payment/bank-deposit">
            <Button variant="secondary" className="w-100 py-2 custom-btn">
              Pay with Bank Deposit
            </Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default ChoosePaymentMethod;
