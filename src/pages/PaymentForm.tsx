import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, Form, Container } from 'react-bootstrap';

// Load Stripe
const stripePromise = loadStripe('your-publishable-key-here');

const PaymentForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const cardElement = elements?.getElement(CardElement);
    if (!cardElement || !stripe) {
      setMessage('Stripe has not loaded properly');
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment('your-client-secret-here', {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: 'John Doe',
        },
      },
    });

    if (error) {
      setMessage(`Payment failed: ${error.message}`);
    } else if (paymentIntent?.status === 'succeeded') {
      setMessage('Payment successful!');
    } else {
      setMessage('Payment processing...');
    }

    setIsLoading(false);
  };

  return (
    <Container>
      <h2>Pay with Credit Card</h2>
      <Form onSubmit={handleSubmit}>
        <CardElement />
        <Button variant="primary" type="submit" disabled={!stripe || isLoading}>
          Pay Now
        </Button>
      </Form>
      {message && <p>{message}</p>}
    </Container>
  );
};

const StripePayment: React.FC = () => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
};

export default StripePayment;
