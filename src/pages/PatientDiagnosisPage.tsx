import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

interface IPatientDiagnosis {
  diagnosis: string;
  symptoms: string;
  prescribedTreatment: string;
}

const PatientDiagnosisPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get patient ID from URL params
  const navigate = useNavigate();
  const [diagnosis, setDiagnosis] = useState<IPatientDiagnosis>({
    diagnosis: '',
    symptoms: '',
    prescribedTreatment: '',
  });
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/v1/patient-diagnosis/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(diagnosis),
      });

      if (!response.ok) {
        throw new Error('Failed to add diagnosis');
      }

      setMessage('Diagnosis added successfully');
      setTimeout(() => navigate(`/patient-diagnoses/${id}`), 2000); // Redirect to the diagnosis list page after success
    } catch (error) {
      console.error('Error adding diagnosis:', error);
      setMessage('Error adding diagnosis');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDiagnosis({
      ...diagnosis,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <h1>Add Diagnosis for Patient</h1>
      {message && <Alert variant={message.includes('success') ? 'success' : 'danger'}>{message}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="diagnosis">
          <Form.Label>Diagnosis</Form.Label>
          <Form.Control
            type="text"
            name="diagnosis"
            value={diagnosis.diagnosis}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="symptoms">
          <Form.Label>Symptoms</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="symptoms"
            value={diagnosis.symptoms}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="prescribedTreatment">
          <Form.Label>Prescribed Treatment</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="prescribedTreatment"
            value={diagnosis.prescribedTreatment}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Submit Diagnosis
        </Button>
      </Form>
    </div>
  );
};

export default PatientDiagnosisPage;
