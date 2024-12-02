import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaPen, FaUser } from 'react-icons/fa'; // Import icons

interface IStaff {
  _id: string;
  name: string;
  email: string;
  specialization?: string;
  role: string;
}

interface IAppointment {
  _id: string;
  staffId: IStaff | null; // staffId can either be populated staff object or null
  date: string;
  time: string;
  reason: string;
  patientName: string;
}

const AppointmentListPage: React.FC = () => {
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  

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
      
      // Sort appointments by date, assuming the appointment date is used for sorting
      const sortedAppointments = data.sort((a: IAppointment, b: IAppointment) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
  
      setAppointments(sortedAppointments);
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

  // Inline CSS for the component
  const cardStyle = {
    borderColor: '#2963f9',
    borderWidth: '2px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 255, 0.2)', 
    backgroundColor: "#dce9ff"
  };

  const updateButtonStyle = {
    backgroundColor: '#A8E6CF', 
    border: '2px solid #4CAF50',
    borderRadius: '50px', 
    color: 'black',
  };

  const cancelButtonStyle = {
    backgroundColor: '#FFABAB',
    border: '2px solid #FF4C4C',
    borderRadius: '50px', 
    color: 'black',
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
                  <Card.Title>
                    {appointment.staffId 
                      ? `Dr. ${appointment.staffId.name}` 
                      : 'Unknown Doctor'}
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {appointment.staffId 
                      ? appointment.staffId.email 
                      : 'Unknown'}
                  </Card.Subtitle>
                  <Card.Text>
                    <strong>Specialization:</strong> {appointment.staffId && appointment.staffId.specialization 
                      ? appointment.staffId.specialization 
                      : 'N/A'}
                  </Card.Text>
  
                  <Card className="mt-3" style={{ border: '1px solid lightgray', borderRadius: '10px' }}>
                    <Card.Body>
                      <Card.Text>
                        <FaCalendarAlt /> <strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()} <br />
                        <FaClock /> <strong>Time:</strong> {appointment.time} <br />
                        <FaPen /> <strong>Reason:</strong> {appointment.reason} <br />
                        <FaUser /> <strong>Patient Name:</strong> {appointment.patientName}
                      </Card.Text>
                    </Card.Body>
                  </Card>
  
                  <div className="mt-3">
                    <Button
                      style={updateButtonStyle} 
                      className="me-2" 
                      onClick={() => handleUpdate(appointment._id)}
                    >
                      Update
                    </Button>
                    <Button
                      style={cancelButtonStyle} 
                      onClick={() => handleCancel(appointment._id)}
                    >
                      Cancel
                    </Button>
                  </div>
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