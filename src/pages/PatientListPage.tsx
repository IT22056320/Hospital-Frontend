import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface IPatient {
  _id: string;
  name: string;
  email: string;
  contactInformation: string;
  department: string;
  schedule: string;
}

const PatientListPage: React.FC = () => {
  const [patientList, setPatientList] = useState<IPatient[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  // Fetch patients (users with role PATIENT) from the backend
  const fetchPatients = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/staff?role=PATIENT');
      if (!response.ok) {
        throw new Error('Failed to fetch patients');
      }
      const data = await response.json();
      setPatientList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  // Handle view details
  const handleViewDetails = (id: string) => {
    navigate(`/patient-details/${id}`); // Navigate to the patient details page with the patient ID
  };

  // Handle adding diagnosis for a patient
  const handleAddDiagnosis = (id: string) => {
    navigate(`/patient-diagnosis/${id}`); // Navigate to diagnosis form with patient ID
  };

  // Handle viewing diagnosis details for a patient
  const handleViewDiagnoses = (id: string) => {
    navigate(`/patient-diagnoses/${id}`); // Navigate to the diagnosis list page for the patient
  };

  return (
    <div>
      <h1>Patient List</h1>
      <Button
        variant="primary"
        onClick={() => navigate('/patient-form')} // Navigate to add a new patient
        className="mb-3"
      >
        Add New Patient
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Contact Information</th>
            <th>Department</th>
            <th>Schedule</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patientList.length > 0 ? (
            patientList.map((patient) => (
              <tr key={patient._id}>
                <td>{patient.name}</td>
                <td>{patient.email}</td>
                <td>{patient.contactInformation}</td>
                <td>{patient.department}</td>
                <td>{patient.schedule}</td>
                <td>
                  <Button
                    variant="info"
                    className="me-2"
                    onClick={() => handleViewDetails(patient._id)}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="success"
                    className="me-2"
                    onClick={() => handleAddDiagnosis(patient._id)}
                  >
                    Add Diagnosis
                  </Button>
                  <Button
                    variant="warning"
                    className="me-2"
                    onClick={() => handleViewDiagnoses(patient._id)}
                  >
                    View Diagnoses
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => console.log('Delete functionality')}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>No patients found.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default PatientListPage;
