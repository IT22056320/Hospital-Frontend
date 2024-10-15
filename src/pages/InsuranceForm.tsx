import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import InsuranceService, { IInsurance } from '../services/InsuranceService';
import { formatDate } from '../utils/formatDate';  // Import the formatDate function
import '../assets/InsuranceForm.css'; // Ensure to import your custom CSS if needed

interface InsuranceFormProps {
  insurance?: IInsurance;  // Optional for editing
  onSuccess: () => void;   // Callback after success
}

const InsuranceForm: React.FC<InsuranceFormProps> = ({ insurance, onSuccess }) => {
  const [formData, setFormData] = useState<IInsurance>({
    insuranceId: '',
    policyNumber: '',
    provider: '',
    coverageAmount: 0,
    premium: 0,
    startDate: '',
    endDate: ''
  });

  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (insurance) {
      setFormData({
        ...insurance,
        startDate: formatDate(insurance.startDate), // Ensure date is in YYYY-MM-DD format
        endDate: formatDate(insurance.endDate),     // Ensure date is in YYYY-MM-DD format
      });
    }
  }, [insurance]);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    const { insuranceId, policyNumber, provider, coverageAmount, premium, startDate, endDate } = formData;

    if (!insuranceId) errors.insuranceId = 'Insurance ID is required.';
    if (!policyNumber) errors.policyNumber = 'Policy Number is required.';
    if (!provider) errors.provider = 'Provider is required.';
    if (coverageAmount <= 0) errors.coverageAmount = 'Coverage Amount must be greater than 0.';
    if (premium <= 0) errors.premium = 'Premium must be greater than 0.';
    if (!startDate) errors.startDate = 'Start Date is required.';
    if (!endDate) errors.endDate = 'End Date is required.';
    if (new Date(startDate) >= new Date(endDate)) {
      errors.endDate = 'End Date must be after Start Date.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0; // Returns true if no errors
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear validation message for the changed field
    setValidationErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        if (insurance?._id) {
          await InsuranceService.update(insurance._id, formData);
        } else {
          await InsuranceService.create(formData);
        }
        onSuccess(); // Call the success callback after form submission
      } catch (error) {
        console.error('Failed to submit form:', error);
      }
    }
  };

  return (
    <Container className="insurance-form-container">
      <h2 className="text-center">{insurance ? 'Update Insurance' : 'Create Insurance'}</h2>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col xs={12}>
            <Form.Group>
              <Form.Label>Insurance ID</Form.Label>
              <Form.Control
                type="text"
                name="insuranceId"
                value={formData.insuranceId}
                onChange={handleChange}
                required
                isInvalid={!!validationErrors.insuranceId}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.insuranceId}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col xs={12}>
            <Form.Group>
              <Form.Label>Policy Number</Form.Label>
              <Form.Control
                type="text"
                name="policyNumber"
                value={formData.policyNumber}
                onChange={handleChange}
                required
                isInvalid={!!validationErrors.policyNumber}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.policyNumber}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col xs={12}>
            <Form.Group>
              <Form.Label>Provider</Form.Label>
              <Form.Control
                type="text"
                name="provider"
                value={formData.provider}
                onChange={handleChange}
                required
                isInvalid={!!validationErrors.provider}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.provider}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col xs={12}>
            <Form.Group>
              <Form.Label>Coverage Amount</Form.Label>
              <Form.Control
                type="number"
                name="coverageAmount"
                value={formData.coverageAmount}
                onChange={handleChange}
                required
                isInvalid={!!validationErrors.coverageAmount}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.coverageAmount}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col xs={12}>
            <Form.Group>
              <Form.Label>Premium</Form.Label>
              <Form.Control
                type="number"
                name="premium"
                value={formData.premium}
                onChange={handleChange}
                required
                isInvalid={!!validationErrors.premium}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.premium}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col xs={12}>
            <Form.Group>
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                isInvalid={!!validationErrors.startDate}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.startDate}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col xs={12}>
            <Form.Group>
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                isInvalid={!!validationErrors.endDate}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.endDate}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <Button variant="primary" type="submit" className="w-100">
              {insurance ? 'Update Insurance' : 'Create Insurance'}
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default InsuranceForm;
