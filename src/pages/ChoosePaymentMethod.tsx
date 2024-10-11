import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';

const ChoosePaymentMethod: React.FC = () => {
  return (
    <Container>
      <h2>Select Payment Method</h2>
      <Link to="/payment/credit-card">
        <Button variant="primary" className="me-3">
          Pay with Credit Card
        </Button>
      </Link>
      <Link to="/payment/bank-deposit">
        <Button variant="secondary">Pay with Bank Deposit</Button>
      </Link>
    </Container>
  );
};

export default ChoosePaymentMethod;
