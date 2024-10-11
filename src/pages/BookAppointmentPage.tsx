import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface AppointmentFormState {
  date: string;
  time: string;
  reason: string;
  patientName: string;
  doctorId: string;
}

const BookAppointmentPage: React.FC = () => {
  const [appointmentData, setAppointmentData] = useState<AppointmentFormState>({
    date: '',
    time: '',
    reason: '',
    patientName: '',
    doctorId: '',
  });
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAppointmentData({
      ...appointmentData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/v1/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });
  
      if (response.ok) {
        setMessage('Appointment created successfully!');
        setAppointmentData({
          date: '',
          time: '',
          reason: '',
          patientName: '',
          doctorId: '',
        });
        navigate('/choose-payment');  // Navigate to the payment method page
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message}`);
      }
    } catch (error) {
      setMessage('Error booking appointment. Please try again later.');
    }
  };
  

  return (
    <Container>
      <h2>Book an Appointment</h2>
      {message && <Alert variant={message.startsWith('Error') ? 'danger' : 'success'}>{message}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group as={Row} className="mb-3" controlId="formDate">
          <Form.Label column sm={2}>Date:</Form.Label>
          <Col sm={10}>
            <Form.Control
              type="date"
              name="date"
              value={appointmentData.date}
              onChange={handleInputChange}
              required
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formTime">
          <Form.Label column sm={2}>Time:</Form.Label>
          <Col sm={10}>
            <Form.Control
              type="time"
              name="time"
              value={appointmentData.time}
              onChange={handleInputChange}
              required
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formReason">
          <Form.Label column sm={2}>Reason:</Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              name="reason"
              value={appointmentData.reason}
              onChange={handleInputChange}
              placeholder="Enter reason for appointment"
              required
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formPatientName">
          <Form.Label column sm={2}>Patient Name:</Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              name="patientName"
              value={appointmentData.patientName}
              onChange={handleInputChange}
              placeholder="Enter your name"
              required
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formDoctorId">
          <Form.Label column sm={2}>Doctor ID:</Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              name="doctorId"
              value={appointmentData.doctorId}
              onChange={handleInputChange}
              placeholder="Enter doctor ID"
              required
            />
          </Col>
        </Form.Group>

        <Button variant="primary" type="submit">
          Book Appointment
        </Button>
      </Form>
    </Container>
  );
};

export default BookAppointmentPage;