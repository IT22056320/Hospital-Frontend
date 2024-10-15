import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/PaymentForm.css'; // Ensure this CSS file is included for custom styles

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  amount: Yup.number()
    .typeError('Amount must be a number')
    .positive('Amount must be a positive number')
    .required('Amount is required'),
  reference: Yup.string()
    .required('Reference number is required'),
  depositProof: Yup.mixed()
    .required('Upload proof of deposit (PDF) is required')
    .test('fileFormat', 'Uploaded file must be a PDF', (value) => {
      return value && value.type === 'application/pdf';
    }),
});

const BankDepositForm: React.FC = () => {
  const [depositInfo, setDepositInfo] = useState({
    accountNumber: '123456789',
    bankName: 'XYZ Bank',
    amount: '',
    reference: '',
    depositProof: null as File | null,
  });
  const navigate = useNavigate(); // To handle navigation after successful submission

  const handleSubmit = async (values: any) => {
    const formData = new FormData();
    formData.append('amount', values.amount);
    formData.append('reference', values.reference);
    formData.append('depositProof', values.depositProof);

    try {
      const response = await fetch('http://localhost:3000/api/v1/submit-bank-deposit/submit-bank-deposit', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error uploading deposit');
      }

      // Show success toast notification
      toast.success('Bank deposit submitted successfully!', {
        position: 'top-right',
        autoClose: 3000, // Auto close after 3 seconds
      });

      // Redirect to patient-dashboard after successful submission
      setTimeout(() => {
        navigate('/patient-dashboard');
      }, 3000); // Wait for the toast to disappear before navigating
    } catch (error) {
      toast.error('Error uploading deposit, please try again.', {
        position: 'top-right',
        autoClose: 5000,
      });
    }
  };

  return (
    <Container className="payment-form-container">
      <ToastContainer /> {/* Include Toast Container for displaying toasts */}
      <h2>Bank Deposit Payment</h2>
      <p>Bank Name: {depositInfo.bankName}</p>
      <p>Account Number: {depositInfo.accountNumber}</p>

      <Formik
        initialValues={depositInfo}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values, errors, touched }) => (
          <FormikForm>
            <Row className="mb-3">
              <Col xs={12}>
                <Form.Group>
                  <Form.Label>Amount</Form.Label>
                  <Field
                    type="number"
                    name="amount"
                    className={`form-control ${touched.amount && errors.amount ? 'is-invalid' : ''}`}
                    placeholder="Enter amount (e.g., 1000)"
                  />
                  {touched.amount && errors.amount && (
                    <div className="invalid-feedback">{errors.amount}</div>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col xs={12}>
                <Form.Group>
                  <Form.Label>Reference Number</Form.Label>
                  <Field
                    type="text"
                    name="reference"
                    className={`form-control ${touched.reference && errors.reference ? 'is-invalid' : ''}`}
                    placeholder="Enter reference number"
                  />
                  {touched.reference && errors.reference && (
                    <div className="invalid-feedback">{errors.reference}</div>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col xs={12}>
                <Form.Group>
                  <Form.Label>Upload Deposit Proof (PDF)</Form.Label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      if (e.target.files) {
                        setFieldValue('depositProof', e.target.files[0]);
                      }
                    }}
                    className={`form-control ${touched.depositProof && errors.depositProof ? 'is-invalid' : ''}`}
                  />
                  {touched.depositProof && errors.depositProof && (
                    <div className="invalid-feedback">{errors.depositProof}</div>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <Button variant="primary" type="submit" className="w-100">
                  Submit Deposit
                </Button>
              </Col>
            </Row>
          </FormikForm>
        )}
      </Formik>
    </Container>
  );
};

export default BankDepositForm;
