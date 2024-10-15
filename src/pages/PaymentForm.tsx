import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import for navigation
import { ToastContainer, toast } from 'react-toastify'; // Import for toast notifications
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import '../assets/PaymentForm.css'; // Import custom CSS

interface PaymentData {
  cardNumber: string;
  cardHolder: string;
  expirationDate: string;
  cvv: string;
  amount: number;
}

const PaymentForm: React.FC = () => {
  const [paymentData, setPaymentData] = useState<PaymentData>({
    cardNumber: '',
    cardHolder: '',
    expirationDate: '',
    cvv: '',
    amount: 0,
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string | null>>({
    cardNumber: null,
    expirationDate: null,
    cvv: null,
    amount: null,
  });

  const navigate = useNavigate(); // Hook for navigation

  // Regular expression patterns for validation
  const cardNumberPattern = /^[0-9]{16}$/;
  const expirationDatePattern = /^(0[1-9]|1[0-2])\/([0-9]{2})$/; // MM/YY
  const cvvPattern = /^[0-9]{3,4}$/;
  const amountPattern = /^[1-9]\d*(\.\d{1,2})?$/;

  // Validate form fields in real-time
  const validateField = (name: string, value: string) => {
    let error = null;

    switch (name) {
      case 'cardNumber':
        if (!cardNumberPattern.test(value)) error = 'Card number must be 16 digits';
        break;
      case 'expirationDate':
        if (!expirationDatePattern.test(value)) error = 'Expiration date must be MM/YY';
        break;
      case 'cvv':
        if (!cvvPattern.test(value)) error = 'CVV must be 3 or 4 digits';
        break;
      case 'amount':
        if (!amountPattern.test(value)) error = 'Amount must be greater than 0';
        break;
      default:
        break;
    }
    setFormErrors({ ...formErrors, [name]: error });
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Check if there are validation errors
    const hasErrors = Object.values(formErrors).some(error => error !== null);
    if (hasErrors) {
      setErrorMessage('Please fix validation errors');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/v1/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (response.ok) {
        setSuccessMessage('Payment successful!');
        setErrorMessage(null);

        // Show toast notification
        toast.success('Payment successful! Redirecting to the dashboard...', {
          position: 'top-right',
          autoClose: 3000, // Auto close after 3 seconds
        });

        // Delay navigation until the toast finishes
        setTimeout(() => {
          navigate('/patient-dashboard'); // Navigate to patient-dashboard after success
        }, 3000); // Wait 3 seconds before navigating
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      setSuccessMessage(null);
      setErrorMessage('Payment failed. Please try again.');

      // Show error toast notification
      toast.error('Payment failed! Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  // Handle form input changes
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPaymentData({ ...paymentData, [name]: value });
    validateField(name, value); // Validate input in real-time
  };

  return (
    <div className="container mt-5 payment-form-container">
      <h2 className="text-center mb-4">Payment Form</h2>

      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formCardNumber" className="mb-3">
          <Form.Label>Card Number</Form.Label>
          <Form.Control
            type="text"
            name="cardNumber"
            value={paymentData.cardNumber}
            onChange={handleChange}
            placeholder="Enter card number"
            isInvalid={!!formErrors.cardNumber}
            required
          />
          <Form.Control.Feedback type="invalid">{formErrors.cardNumber}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formCardHolder" className="mb-3">
          <Form.Label>Card Holder Name</Form.Label>
          <Form.Control
            type="text"
            name="cardHolder"
            value={paymentData.cardHolder}
            onChange={handleChange}
            placeholder="Enter card holder name"
            required
          />
        </Form.Group>

        <Form.Group controlId="formExpirationDate" className="mb-3">
          <Form.Label>Expiration Date</Form.Label>
          <Form.Control
            type="text"
            name="expirationDate"
            value={paymentData.expirationDate}
            onChange={handleChange}
            placeholder="MM/YY"
            isInvalid={!!formErrors.expirationDate}
            required
          />
          <Form.Control.Feedback type="invalid">{formErrors.expirationDate}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formCvv" className="mb-3">
          <Form.Label>CVV</Form.Label>
          <Form.Control
            type="text"
            name="cvv"
            value={paymentData.cvv}
            onChange={handleChange}
            placeholder="CVV"
            isInvalid={!!formErrors.cvv}
            required
          />
          <Form.Control.Feedback type="invalid">{formErrors.cvv}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formAmount" className="mb-3">
          <Form.Label>Amount</Form.Label>
          <Form.Control
            type="number"
            name="amount"
            value={paymentData.amount}
            onChange={handleChange}
            placeholder="Enter amount"
            isInvalid={!!formErrors.amount}
            required
          />
          <Form.Control.Feedback type="invalid">{formErrors.amount}</Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Submit Payment
        </Button>
      </Form>

      {/* Toast container for toast notifications */}
      <ToastContainer />
    </div>
  );
};

export default PaymentForm;
