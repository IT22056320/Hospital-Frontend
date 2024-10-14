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
  schedule: string;
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
      const response = await fetch('http://localhost:3000/api/v1/staff?role=Doctor');
      if (!response.ok) throw new Error('Failed to fetch doctors');

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
      <Row>
        {/* Left Sidebar for Filter Buttons */}
        <Col md={3} className="d-flex flex-column align-items-start">
          {departmentOptions.map((dept) => (
            <Button
              key={dept}
              onClick={() => setSelectedDepartment(dept)}
              className={`mb-3 ${selectedDepartment === dept ? 'active' : ''}`}
              style={{
                width: '100%',
                borderRadius: '20px',
                backgroundColor: selectedDepartment === dept ? 'blue' : 'white',
                color: selectedDepartment === dept ? 'white' : 'blue',
                border: '2px solid blue',
                padding: '10px 20px',
                textAlign: 'left',
              }}
            >
              {dept}
            </Button>
          ))}
        </Col>

        {/* Doctor Cards */}
        <Col md={9}>
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <Card
                key={doctor._id}
                className="mb-4"
                style={{
                  borderColor: 'blue',
                  borderWidth: '2px',
                  borderRadius: '10px',
                  boxShadow: '0 4px 8px rgba(0, 0, 255, 0.2)', // subtle shadow with blue tint
                }}
              >
              <Card.Body>
                <Card.Title style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {doctor.name}
                </Card.Title>

                {/* Email Section with Icon */}
                <Card.Text className="d-flex align-items-center">
                  <i className="bi bi-envelope-fill" style={{ marginRight: '8px', color: 'blue' }}></i>
                  <span style={{ fontWeight: 'bold' }}>Email: </span> {doctor.email}
                </Card.Text>

                {/* Contact Section */}
                <Card.Text className="d-flex align-items-center">
                  <i className="bi bi-telephone-fill" style={{ marginRight: '8px', color: 'blue' }}></i>
                  <span style={{ fontWeight: 'bold' }}>Contact: </span> {doctor.contactInformation}
                </Card.Text>

                {/* Schedule Section */}
                <Card.Text className="d-flex align-items-center">
                  <i className="bi bi-calendar3" style={{ marginRight: '8px', color: 'blue' }}></i>
                  <span style={{ fontWeight: 'bold' }}>Schedule: </span> {doctor.schedule}
                </Card.Text>

                {/* Work Experience Section */}
                <Card.Text className="d-flex align-items-center">
                  <i className="bi bi-briefcase-fill" style={{ marginRight: '8px', color: 'blue' }}></i>
                  <span style={{ fontWeight: 'bold' }}>Experience: </span> {doctor.workExperience} years
                </Card.Text>

                {/* Degree Section */}
                <Card.Text className="d-flex align-items-center">
                  <i className="bi bi-mortarboard-fill" style={{ marginRight: '8px', color: 'blue' }}></i>
                  <span style={{ fontWeight: 'bold' }}>Degree: </span> {doctor.degree}
                </Card.Text>

                {/* Specialization Section */}
                <Card.Text className="d-flex align-items-center">
                  <i className="bi bi-award-fill" style={{ marginRight: '8px', color: 'blue' }}></i>
                  <span style={{ fontWeight: 'bold' }}>Specialization: </span> {doctor.specialization}
                </Card.Text>

                {/* Book Appointment Button */}
                <Button
                  variant="primary"
                  style={{
                    borderRadius: '20px',
                    backgroundColor: 'blue',
                    borderColor: 'blue',
                  }}
                  onClick={() => handleBookAppointment(doctor._id)}
                >
                  Book Appointment
                </Button>
              </Card.Body>
              </Card>
            ))
          ) : (
            <p>No doctors found.</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default DoctorListPage;