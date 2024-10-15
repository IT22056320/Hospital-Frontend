import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

interface AppointmentFormState {
  date: string;
  time: string;
  reason: string;
  patientName: string;
  doctorId: string; 
}

const UpdateAppointmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [appointmentData, setAppointmentData] = useState<AppointmentFormState>({
    date: '',
    time: '',
    reason: '',
    patientName: '',
    doctorId: '',
  });
  const [validated, setValidated] = useState(false); 
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchAppointment();
    }
  }, [id]);

  const fetchAppointment = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/appointments/${id}`);
      if (response.ok) {
        const data = await response.json();
        setAppointmentData({
          date: data.date.split('T')[0], 
          time: data.time,
          reason: data.reason,
          patientName: data.patientName,
          doctorId: data.staffId, 
        });
      } else {
        setMessage('Failed to fetch appointment');
      }
    } catch (error) {
      setMessage('Error fetching appointment');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAppointmentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    if (!appointmentData.date || !appointmentData.time || !appointmentData.reason || !appointmentData.patientName) {
      setMessage('Please fill in all fields.');
      return;
    }

    const namePattern = /^[A-Za-z\s]+$/; 
    if (!namePattern.test(appointmentData.patientName)) {
      setMessage('Patient name can only contain letters and spaces.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/v1/appointments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      if (response.ok) {
        setMessage('Appointment updated successfully!');
        navigate('/appointments');
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message || 'An error occurred'}`);
      }
    } catch (error) {
      setMessage('Error updating appointment. Please try again later.');
    }
    setValidated(true); 
  };

  return (
    <Container 
      style={{
        marginTop: '30px',
        backgroundColor: '#f0f4ff', 
        padding: '25px', 
        borderRadius: '10px', 
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
        backgroundImage: 'linear-gradient(135deg, #e6e9ff 0%, #fefefe 100%)',
      }}
    >
      <h2 style={{ color: '#0056b3', marginBottom: '20px', fontWeight: 'bold', textAlign: 'center' }}>
        Update Appointment
      </h2>
      {message && <Alert variant={message.startsWith('Error') ? 'danger' : 'success'}>{message}</Alert>}
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group as={Row} className="mb-3" controlId="formDate">
          <Form.Label column sm={2} style={{ fontWeight: 'bold' }}>Date:</Form.Label>
          <Col sm={10}>
            <Form.Control
              type="date"
              name="date"
              value={appointmentData.date}
              onChange={handleInputChange}
              required
              style={{ borderRadius: '6px', padding: '10px', borderColor: '#ccc' }}
            />
            <Form.Control.Feedback type="invalid">Please provide a valid date.</Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formTime">
          <Form.Label column sm={2} style={{ fontWeight: 'bold' }}>Time:</Form.Label>
          <Col sm={10}>
            <Form.Control
              type="time"
              name="time"
              value={appointmentData.time}
              onChange={handleInputChange}
              required
              style={{ borderRadius: '6px', padding: '10px', borderColor: '#ccc' }}
            />
            <Form.Control.Feedback type="invalid">Please select a valid time.</Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formReason">
          <Form.Label column sm={2} style={{ fontWeight: 'bold' }}>Reason:</Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              name="reason"
              value={appointmentData.reason}
              onChange={handleInputChange}
              required
              style={{ borderRadius: '6px', padding: '10px', borderColor: '#ccc' }}
            />
            <Form.Control.Feedback type="invalid">Please provide a reason for the appointment.</Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formPatientName">
          <Form.Label column sm={2} style={{ fontWeight: 'bold' }}>Patient Name:</Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              name="patientName"
              value={appointmentData.patientName}
              onChange={handleInputChange}
              required
              pattern="[A-Za-z\s]+"
              style={{ borderRadius: '6px', padding: '10px', borderColor: '#ccc' }}
            />
            <Form.Control.Feedback type="invalid">Patient name can only contain letters and spaces.</Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Button 
          variant="primary" 
          type="submit" 
          style={{ 
            width: '100%', 
            padding: '10px', 
            borderRadius: '8px', 
            backgroundColor: '#0056b3',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
            fontSize: '18px',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#004494'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
        >
          Update Appointment
        </Button>
      </Form>
    </Container>
  );
};

export default UpdateAppointmentPage;