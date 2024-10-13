import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

interface IPatientDiagnosis {
  diagnosis: string;
  symptoms: string;
  prescribedTreatment: string;
  patientId: string; // Include patientId in the interface for redirection
}

const UpdateDiagnosisPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get diagnosis ID from URL params
  const navigate = useNavigate();
  const [diagnosis, setDiagnosis] = useState<IPatientDiagnosis>({
    diagnosis: '',
    symptoms: '',
    prescribedTreatment: '',
    patientId: '', // Initialize patientId
  });
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchDiagnosis();
  }, []);

  // Fetch the diagnosis details
  const fetchDiagnosis = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/patient-diagnosis/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch diagnosis');
      }
      const data = await response.json();
      setDiagnosis(data); // Set the diagnosis, including the patientId
    } catch (error) {
      console.error('Error fetching diagnosis:', error);
      setMessage('Error fetching diagnosis');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/v1/patient-diagnosis/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(diagnosis),
      });

      if (!response.ok) {
        throw new Error('Failed to update diagnosis');
      }

      setMessage('Diagnosis updated successfully');
      setTimeout(() => navigate(`/patient-diagnoses/${diagnosis.patientId}`), 2000); // Use patientId for redirection
    } catch (error) {
      console.error('Error updating diagnosis:', error);
      setMessage('Error updating diagnosis');
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
      <h1>Update Diagnosis</h1>
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
          Update Diagnosis
        </Button>
      </Form>
    </div>
  );
};

export default UpdateDiagnosisPage;
