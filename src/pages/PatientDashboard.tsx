import React from 'react';
import { Container, Row, Col, Button, Image } from 'react-bootstrap';

const PatientDashboard: React.FC = () => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>

<div style={{
          backgroundColor: '#4A90E2',
          color: '#FFF',
          padding: '3rem 0',
        }}>
          <Container>
            <Row className="align-items-center">
              <Col md={6}>
                <h1>Book Appointment With Trusted Doctors</h1>
                <p>Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.</p>
                <Button variant="light" href="/doctor-list" style={{ marginTop: '20px' }}>
                  Book appointment
                </Button>
              </Col>
              <Col md={6}>
                <Image
                  src="../../src/assets/header_img.png" // Replace with the actual image URL
                  alt="Doctors"
                  style={{ width: '100%', borderRadius: '10px' }}
                />
              </Col>
            </Row>
          </Container>
        </div>

      {/* Find by Speciality Section */}
      <section style={{ padding: '3rem 0', textAlign: 'center' }}>
        <Container>
          <h2 style={{ marginBottom: '2rem' }}>Find by Speciality</h2>
          <Row>
            {['General_Physician', 'Gynecologist', 'Dermatologist', 'Pediatrician', 'Neurologist', 'Gastroenterologist'].map((speciality, index) => (
              <Col key={index} md={2} sm={4} xs={6} style={{ marginBottom: '2rem' }}>
                <div style={{ marginBottom: '10px' }}>
                  <Image 
                    src={`../../src/assets/${speciality.toLowerCase().replace(/ /g, '-')}.svg`} 
                    alt={speciality} 
                    fluid 
                    style={{ width: '80px', height: '80px' }} // Increase size here
                  />
                </div>
                <p>{speciality}</p>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default PatientDashboard;