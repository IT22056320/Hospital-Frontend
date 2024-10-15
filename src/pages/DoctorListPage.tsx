import React, { useState, useEffect } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface IDoctor {
  _id: string;
  name: string;
  role: string;
  email: string;
  contactInformation: string;
  department: string;
  workExperience: string;
  about: string;
  degree: string;
  specialization: string;
}

const DoctorListPage: React.FC = () => {
  const [doctorList, setDoctorList] = useState<IDoctor[]>([]);
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    fetchDoctorsWithDetails(); // Fetch doctors and their additional details on component mount
  }, []);

  // Fetch basic doctor information from the staff API and their additional details
  const fetchDoctorsWithDetails = async () => {
    try {
      // Fetch the list of doctors from the staff API
      const response = await fetch('http://localhost:3000/api/v1/staff?role=DOCTOR');
      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }
      const doctors = await response.json();

      // Fetch additional details for each doctor from the staff-details API
      const doctorsWithDetails = await Promise.all(
        doctors.map(async (doctor: IDoctor) => {
          const details = await fetchDoctorDetails(doctor._id);
          return { ...doctor, ...details }; // Merge doctor data with additional details
        })
      );

      setDoctorList(doctorsWithDetails);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  // Fetch additional doctor details from the staff-details API
  const fetchDoctorDetails = async (doctorId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/staff-details/${doctorId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch doctor details');
      }
      const details = await response.json();
      return {
        workExperience: details.workExperience || '',
        about: details.about || '',
        degree: details.degree || '',
        specialization: details.specialization || '',
      };
    } catch (error) {
      console.error('Error fetching doctor details:', error);
      return null; // Return null if fetching details fails
    }
  };

  // Handle book appointment
  const handleBookAppointment = (doctorId: string) => {
    // Navigate to the BookAppointmentPage with the doctorId as the staffId
    navigate(`/book-appointment/${doctorId}`);
  };

  return (
    <div>
      <h1>Doctors</h1>
      {doctorList.length > 0 ? (
        doctorList.map((doctor) => (
          <Card key={doctor._id} className="mb-3">
            <Card.Body>
              <Card.Title>{doctor.name}</Card.Title>
              <Card.Text><strong>Email:</strong> {doctor.email}</Card.Text>
              <Card.Text><strong>Contact Information:</strong> {doctor.contactInformation}</Card.Text>
              <Card.Text><strong>Department:</strong> {doctor.department}</Card.Text>
              <Card.Text><strong>Work Experience:</strong> {doctor.workExperience}</Card.Text>
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
