// src/components/PaymentList.tsx
import React, { useState, useEffect } from 'react';
import { Table, Alert, Button } from 'react-bootstrap';
import '../assets/PaymentList.css'; // Custom styles for better responsiveness

export interface IPayment {
  _id: string;
  cardNumber: string;
  cardHolder: string;
  expirationDate: string;
  amount: number;
}

const PaymentList: React.FC = () => {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch payments on component mount
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/payment');
        if (!response.ok) {
          throw new Error('Failed to fetch payments');
        }
        const data: IPayment[] = await response.json();
        setPayments(data);
      } catch (error) {
        setErrorMessage('Failed to fetch payments');
      }
    };

    fetchPayments();
  }, []);

  // Handle deleting a payment
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/payment/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete payment');
      }
      // Filter out the deleted payment from the state
      setPayments(payments.filter(payment => payment._id !== id));
    } catch (error) {
      setErrorMessage('Failed to delete payment');
    }
  };

  return (
    <div className="container mt-5 payment-list-container">
      <h2 className="text-center">Payment History</h2>

      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      {payments.length === 0 ? (
        <Alert variant="info">No payments found.</Alert>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover className="text-center">
            <thead>
              <tr>
                <th>Card Number</th>
                <th>Card Holder</th>
                <th>Expiration Date</th>
                <th>Amount (Rs.)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id}>
                  <td>{payment.cardNumber}</td>
                  <td>{payment.cardHolder}</td>
                  <td>{payment.expirationDate}</td>
                  <td>Rs. {payment.amount.toFixed(2)}</td>
                  <td>
                    <Button
                      variant="danger"
                      className="delete-btn"
                      onClick={() => handleDelete(payment._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default PaymentList;
