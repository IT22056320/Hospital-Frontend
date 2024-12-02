import React, { useState, useEffect } from 'react';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';
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
  const [filteredDoctors, setFilteredDoctors] = useState<IDoctor[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctorsWithDetails();
  }, []);

  useEffect(() => {
    // Filter the doctor list based on the selected department
    if (selectedDepartment === 'All') {
      setFilteredDoctors(doctorList);
    } else {
      setFilteredDoctors(
        doctorList.filter((doctor) => doctor.department === selectedDepartment)
      );
    }
  }, [selectedDepartment, doctorList]);

  const fetchDoctorsWithDetails = async () => {
    try {
      // Fetch the list of doctors from the staff API
      const response = await fetch('http://localhost:3000/api/v1/staff?role=DOCTOR');
      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }


      const doctors = await response.json();
      const doctorsWithDetails = await Promise.all(
        doctors.map(async (doctor: IDoctor) => {
          const details = await fetchDoctorDetails(doctor._id);
          return { ...doctor, ...details };
        })
      );
      setDoctorList(doctorsWithDetails);
      setFilteredDoctors(doctorsWithDetails); // Initially show all doctors
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchDoctorDetails = async (doctorId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/staff-details/${doctorId}`);
      if (!response.ok) throw new Error('Failed to fetch doctor details');

      const details = await response.json();
      return {
        workExperience: details.workExperience || '',
        about: details.about || '',
        degree: details.degree || '',
        specialization: details.specialization || '',
      };
    } catch (error) {
      console.error('Error fetching doctor details:', error);
      return null;
    }
  };

  const handleBookAppointment = (doctorId: string) => {
    navigate(`/book-appointment/${doctorId}`);
  };

  const departmentOptions = [
    'All',
    'General Physician',
    'Gynecologist',
    'Dermatologist',
    'Pediatricians',
    'Neurologist',
    'Gastroenterologist',
  ];

  return (
    <Container fluid>
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
    </Container>
  );
};

export default DoctorListPage;