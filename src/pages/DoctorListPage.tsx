import React, { useState, useEffect } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface IDoctor {
  _id: string;
  name: string;
  workExperience: string;
  degree: string;
  specialization: string;
  about: string;
}

const DoctorListPage: React.FC = () => {
  const [doctorList, setDoctorList] = useState<IDoctor[]>([]);
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Fetch doctors from the backend
  const fetchDoctors = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/staff?role=Doctor');
      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }
      const data = await response.json();
      setDoctorList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  // Handle book appointment
  const handleBookAppointment = (doctorId: string) => {
    navigate(`/book-appointment/${doctorId}`); // Navigate to book appointment page with doctor ID
  };

  return (
    <div>
      <h1>Doctors</h1>
      {doctorList.length > 0 ? (
        doctorList.map((doctor) => (
          <Card key={doctor._id} className="mb-3">
            <Card.Body>
              <Card.Title>{doctor.name}</Card.Title>
              <Card.Text><strong>Experience:</strong> {doctor.workExperience}</Card.Text>
              <Card.Text><strong>Degree:</strong> {doctor.degree}</Card.Text>
              <Card.Text><strong>Specialization:</strong> {doctor.specialization}</Card.Text>
              <Card.Text><strong>About:</strong> {doctor.about}</Card.Text>
              <Button variant="primary" onClick={() => handleBookAppointment(doctor._id)}>
                Book Appointment
              </Button>
            </Card.Body>
          </Card>
        ))
      ) : (
        <p>No doctors found.</p>
      )}
    </div>
  );
};

export default DoctorListPage;
