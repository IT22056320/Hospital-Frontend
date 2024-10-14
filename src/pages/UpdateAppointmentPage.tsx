import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

interface AppointmentFormState {
  date: string;
  time: string;
  reason: string;
  patientName: string;
  doctorId: string; // Assuming you will still need this
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
        // Assuming the API returns the necessary fields
        setAppointmentData({
          date: data.date.split('T')[0], // Format date to YYYY-MM-DD for input
          time: data.time,
          reason: data.reason,
          patientName: data.patientName,
          doctorId: data.staffId, // Assuming staffId is used for doctorId
        });
      } else {
        setMessage('Failed to fetch appointment');
      }
    } catch (error) {
      setMessage('Error fetching appointment');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAppointmentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Submitting appointment data:', appointmentData);

    // Check for required fields before sending
    if (!appointmentData.date || !appointmentData.time || !appointmentData.reason || !appointmentData.patientName) {
        setMessage('Please fill in all fields.');
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
            console.error('Update failed:', errorData); // Log the error for debugging
            setMessage(`Error: ${errorData.message || 'An error occurred'}`);
        }
    } catch (error) {
        console.error('Error updating appointment:', error); // Log the error for debugging
        setMessage('Error updating appointment. Please try again later.');
    }
};


  return (
    <Container>
      <h2>Update Appointment</h2>
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
              required
            />
          </Col>
        </Form.Group>

        <Button variant="primary" type="submit">
          Update Appointment
        </Button>
      </Form>
    </Container>
  );
};

export default UpdateAppointmentPage;