import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';

interface IPatientDiagnosis {
  _id: string;
  diagnosis: string;
  symptoms: string;
  prescribedTreatment: string;
  date: string;
}

const DiagnosisListPage: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>(); // Get patientId from URL params
  const navigate = useNavigate();
  const [diagnoses, setDiagnoses] = useState<IPatientDiagnosis[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [showQRCode, setShowQRCode] = useState(false); // State to toggle QR code visibility

  useEffect(() => {
    fetchDiagnoses();
  }, []);

  // Fetch diagnoses by patient ID
  const fetchDiagnoses = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/patient-diagnosis/patient/${patientId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch diagnoses');
      }
      const data = await response.json();
      console.log('Diagnoses fetched:', data); // Check the response data
      setDiagnoses(data);
    } catch (error) {
      console.error('Error fetching diagnoses:', error);
      setMessage('Error fetching diagnoses');
    }
  };

  // Handle view diagnosis details
  const handleViewDetails = (id: string) => {
    navigate(`/diagnosis-details/${id}`); // Navigate to the diagnosis details page
  };

  // Handle delete diagnosis
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this diagnosis?');
    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:3000/api/v1/patient-diagnosis/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete diagnosis');
      }

      // Remove deleted diagnosis from the list
      setDiagnoses((prevList) => prevList.filter((diagnosis) => diagnosis._id !== id));
      setMessage('Diagnosis deleted successfully');
    } catch (error) {
      console.error('Error deleting diagnosis:', error);
      setMessage('Error deleting diagnosis');
    }
  };

  // Handle update diagnosis
  const handleUpdate = async (id: string) => {
    try {
      await navigate(`/update-diagnosis/${id}`); // Navigate to the update diagnosis form
      // After navigating back, refetch diagnoses to refresh the list
      fetchDiagnoses();
    } catch (error) {
      console.error('Error updating diagnosis:', error);
      setMessage('Error updating diagnosis');
    }
  };

  // Toggle QR code visibility
  const handleGenerateQRCode = () => {
    setShowQRCode(!showQRCode); // Toggle the QR code display
  };

  // Get the current URL
  const currentUrl = window.location.href;

  return (
    <div>
      <h1>Diagnoses for Patient</h1>
      {message && <Alert variant={message.includes('success') ? 'success' : 'danger'}>{message}</Alert>}

      {/* Button to generate the QR code */}
      <Button
        variant="primary"
        onClick={handleGenerateQRCode}
        className="mb-3"
      >
        {showQRCode ? 'Hide QR Code' : 'Generate QR Code'}
      </Button>

      {/* Display the QR code if the state is toggled on */}
      {showQRCode && (
        <div className="mb-3">
          <QRCode value={currentUrl} size={256} />
        </div>
      )}

      {diagnoses.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Diagnosis</th>
              <th>Symptoms</th>
              <th>Prescribed Treatment</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {diagnoses.map((diagnosis) => (
              <tr key={diagnosis._id}>
                <td>{diagnosis.diagnosis}</td>
                <td>{diagnosis.symptoms}</td>
                <td>{diagnosis.prescribedTreatment}</td>
                <td>{new Date(diagnosis.date).toLocaleDateString()}</td>
                <td>
                  <Button
                    variant="info"
                    className="me-2"
                    onClick={() => handleViewDetails(diagnosis._id)}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="warning"
                    className="me-2"
                    onClick={() => handleUpdate(diagnosis._id)}
                  >
                    Update
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(diagnosis._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No diagnoses found for this patient.</p>
      )}
    </div>
  );
};

export default DiagnosisListPage;
