import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface IStaff {
  _id: string;
  name: string;
  email: string;
  specialization?: string;
  role: string;
}

interface IAppointment {
  _id: string;
  staffId: IStaff | string;
  date: string;
  time: string;
  reason: string;
  patientName: string;
}

const AppointmentListPage: React.FC = () => {
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/appointments');
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setMessage('Error fetching appointments. Please try again later.');
    }
  };

  const handleCancel = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to cancel this appointment?');
    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:3000/api/v1/appointments/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel appointment');
      }

      setAppointments((prevList) => prevList.filter((appointment) => appointment._id !== id));
      setMessage('Appointment canceled successfully!');
    } catch (error) {
      console.error('Error canceling appointment:', error);
      setMessage('Error canceling appointment. Please try again later.');
    }
  };

  const handleUpdate = (id: string) => {
    navigate(`/update-appointment/${id}`);
  };

  const cardStyle = {
    border: '2px solid #007bff', // Blue border color
    borderRadius: '15px', // Rounded corners
    marginBottom: '20px', // Space between cards
  };

  const updateButtonStyle = {
    backgroundColor: '#A8E6CF', // Pastel green background
    border: '2px solid #4CAF50', // Normal green border
    borderRadius: '50px', // Rounded corners
    color: 'black', // Text color
  };

  const cancelButtonStyle = {
    backgroundColor: '#FFABAB', // Pastel red background
    border: '2px solid #FF4C4C', // Normal red border
    borderRadius: '50px', // Rounded corners
    color: 'black', // Text color
  };

  return (
    <Container>
      <h1>Appointment List</h1>
      {message && <Alert variant={message.startsWith('Error') ? 'danger' : 'success'}>{message}</Alert>}
      <Row>
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <Row className="mb-3" key={appointment._id}>
              <Card style={cardStyle}>
                <Card.Body>
                  <Card.Title>{typeof appointment.staffId === 'object' ? appointment.staffId.name : 'Unknown Doctor'}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {typeof appointment.staffId === 'object' ? appointment.staffId.email : 'Unknown'}
                  </Card.Subtitle>
                  <Card.Text>
                    <strong>Specialization:</strong> {typeof appointment.staffId === 'object' && appointment.staffId.specialization ? appointment.staffId.specialization : 'N/A'}<br />
                    <strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}<br />
                    <strong>Time:</strong> {appointment.time}<br />
                    <strong>Reason:</strong> {appointment.reason}<br />
                    <strong>Patient Name:</strong> {appointment.patientName}
                  </Card.Text>
                  <Button
                    style={updateButtonStyle} // Pastel green button style
                    className="me-2" // Add margin to the right
                    onClick={() => handleUpdate(appointment._id)}
                  >
                    Update
                  </Button>
                  <Button
                    style={cancelButtonStyle} // Pastel red button style
                    onClick={() => handleCancel(appointment._id)}
                  >
                    Cancel
                  </Button>

                </Card.Body>
              </Card>
            </Row>
          ))
        ) : (
          <Row>
            <Card style={cardStyle}>
              <Card.Body>
                <Card.Text>No appointments found.</Card.Text>
              </Card.Body>
            </Card>
          </Row>
        )}
      </Row>
    </Container>
  );
};

export default AppointmentListPage;