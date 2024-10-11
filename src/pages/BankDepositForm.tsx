import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';

const BankDepositForm: React.FC = () => {
  const [depositInfo, setDepositInfo] = useState({
    accountNumber: '123456789',
    bankName: 'XYZ Bank',
    amount: '',
    reference: '',
    depositProof: null as File | null,
  });
  const [message, setMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDepositInfo({
      ...depositInfo,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDepositInfo({ ...depositInfo, depositProof: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Create a FormData object to hold the form data and file
    const formData = new FormData();
    formData.append('amount', depositInfo.amount);
    formData.append('reference', depositInfo.reference);
    if (depositInfo.depositProof) {
      formData.append('depositProof', depositInfo.depositProof);
    }

    try {
      // Send the form data to your server
      const response = await fetch('http://localhost:3000/api/v1/submit-bank-deposit', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error uploading deposit');
      }

      // Handle successful response
      setMessage('Bank deposit submitted successfully!');
    } catch (error) {
      // Ensure the error is an instance of Error
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage('An unknown error occurred');
      }
    }
  };

  return (
    <Container>
      <h2>Bank Deposit Payment</h2>
      <p>Bank Name: XYZ Bank</p>
      <p>Account Number: 123456789</p>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Amount</Form.Label>
          <Form.Control
            type="number"
            name="amount"
            value={depositInfo.amount}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Reference Number</Form.Label>
          <Form.Control
            type="text"
            name="reference"
            value={depositInfo.reference}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Upload Deposit Proof</Form.Label>
          <Form.Control type="file" onChange={handleFileChange} required />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit Deposit
        </Button>
      </Form>
      {message && <p>{message}</p>}
    </Container>
  );
};

export default BankDepositForm;
