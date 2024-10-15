import React, { useState } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';

const DoctorDashboard: React.FC = () => {
  const appointments = [
    { patientName: 'John Doe', time: '10:00 AM', reason: 'Consultation' },
    { patientName: 'Jane Smith', time: '11:30 AM', reason: 'Follow-up' },
    { patientName: 'Michael Brown', time: '02:00 PM', reason: 'Check-up' }
  ];

  const messages = [
    { sender: 'Admin', content: 'Meeting with the board tomorrow at 9 AM.' },
    { sender: 'Jane Smith', content: 'I have some concerns about my medication.' },
    { sender: 'Michael Brown', content: 'Can I reschedule my appointment?' }
  ];

  // State for handling the message modal visibility
  const [showMessages, setShowMessages] = useState(false);

  // Function to toggle the modal
  const handleViewMessages = () => {
    setShowMessages(!showMessages);
  };

  return (
    <div style={{ width: '100vw', padding: '20px', backgroundColor: '#f5f5f5' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Doctor Dashboard</h2>

      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px' }}>
        {/* Today's Appointments Section */}
        <Card style={{ width: '30%', border: '2px solid #007bff', borderRadius: '10px', minWidth: '300px' }}>
          <Card.Header style={{ backgroundColor: '#007bff', color: 'white', textAlign: 'center' }}>
            <strong>Today's Appointments</strong>
          </Card.Header>
          <Card.Body>
            {appointments.map((appointment, index) => (
              <div key={index} style={{ marginBottom: '15px', padding: '10px 0', borderBottom: '1px solid #ddd' }}>
                <strong>{appointment.patientName}</strong> - {appointment.time}
                <div style={{ color: '#555', fontSize: '14px' }}>Reason: {appointment.reason}</div>
              </div>
            ))}
          </Card.Body>
        </Card>

        {/* Patient Statistics Section */}
        <Card style={{ width: '30%', border: '2px solid #28a745', borderRadius: '10px', minWidth: '300px' }}>
          <Card.Header style={{ backgroundColor: '#28a745', color: 'white', textAlign: 'center' }}>
            <strong>Patient Statistics</strong>
          </Card.Header>
          <Card.Body style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '18px' }}>Total Patients This Week: <strong>24</strong></p>
            <p style={{ fontSize: '18px' }}>Upcoming Appointments: <strong>5</strong></p>
            <p style={{ fontSize: '18px' }}>Canceled Appointments: <strong>2</strong></p>
          </Card.Body>
        </Card>

        {/* Notifications Section */}
        <Card style={{ width: '30%', border: '2px solid #ffc107', borderRadius: '10px', minWidth: '300px' }}>
          <Card.Header style={{ backgroundColor: '#ffc107', color: 'black', textAlign: 'center' }}>
            <strong>Notifications</strong>
          </Card.Header>
          <Card.Body style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '18px' }}>You have <strong>3</strong> new messages</p>
            <p style={{ fontSize: '18px' }}>1 patient canceled their appointment</p>
            <Button 
              onClick={handleViewMessages} 
              style={{ backgroundColor: '#007bff', borderColor: '#007bff', borderRadius: '30px', marginTop: '10px' }}>
              View Messages
            </Button>
          </Card.Body>
        </Card>
      </div>

      {/* Upcoming Tasks Section */}
      <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <Card style={{ width: '60%', border: '2px solid #17a2b8', borderRadius: '10px', minWidth: '300px' }}>
          <Card.Header style={{ backgroundColor: '#17a2b8', color: 'white', textAlign: 'center' }}>
            <strong>Upcoming Tasks</strong>
          </Card.Header>
          <Card.Body>
            <div style={{ marginBottom: '10px', padding: '10px 0', borderBottom: '1px solid #ddd' }}>
              Review lab reports for Michael Brown
            </div>
            <div style={{ marginBottom: '10px', padding: '10px 0', borderBottom: '1px solid #ddd' }}>
              Meeting with Dr. Adams at 3:00 PM
            </div>
            <div style={{ padding: '10px 0' }}>
              Prepare presentation for conference
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Modal to show messages */}
      <Modal show={showMessages} onHide={handleViewMessages} centered>
        <Modal.Header closeButton>
          <Modal.Title>Messages</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {messages.map((message, index) => (
            <div key={index} style={{ marginBottom: '15px', padding: '10px 0', borderBottom: '1px solid #ddd' }}>
              <strong>{message.sender}:</strong>
              <p style={{ marginTop: '5px', fontSize: '14px' }}>{message.content}</p>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleViewMessages}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DoctorDashboard;