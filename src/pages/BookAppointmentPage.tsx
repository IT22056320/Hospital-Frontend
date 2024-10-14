import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

interface AppointmentFormState {
  date: string;
  time: string;
  reason: string;
  patientName: string;
  staffId: string;
}

const timeOptions = [
  '14:00', '14:30', '15:00', '15:30', '16:00',
  '16:30', '17:00', '17:30', '18:00', '18:30',
];

const BookAppointmentPage: React.FC = () => {
  const { staffId } = useParams<{ staffId: string }>();
  const [appointmentData, setAppointmentData] = useState<AppointmentFormState>({
    date: '',
    time: '',
    reason: '',
    patientName: '',
    staffId: staffId || '',
  });
  const [validated, setValidated] = useState(false);
  const [availableTimes, setAvailableTimes] = useState<string[]>(timeOptions);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!staffId) {
      setMessage('Error: Missing doctor information.');
    }
  }, [staffId]);

  useEffect(() => {
    setAvailableTimes(timeOptions);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAppointmentData({
      ...appointmentData,
      [name]: value,
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    setAppointmentData((prev) => ({ ...prev, date: selectedDate }));
    setAppointmentData((prev) => ({ ...prev, time: '' }));
    setAvailableTimes(timeOptions);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      if (!appointmentData.staffId) {
        setMessage('Error: Doctor information is missing. Please select a valid doctor.');
        return;
      }

      const selectedDate = new Date(appointmentData.date);
      const today = new Date();
      const oneMonthLater = new Date();
      oneMonthLater.setMonth(today.getMonth() + 1);

      if (selectedDate < today || selectedDate > oneMonthLater) {
        setMessage('Date must be today or within the next month.');
        e.preventDefault();
        e.stopPropagation();
      } else {
        try {
          const response = await fetch('http://localhost:3000/api/v1/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appointmentData),
          });

          if (response.ok) {
            setMessage('Appointment created successfully!');
            setAppointmentData({
              date: '',
              time: '',
              reason: '',
              patientName: '',
              staffId: staffId || '',
            });
            navigate('/choose-payment');
          } else {
            const errorData = await response.json();
            setMessage(`Error: ${errorData.message}`);
          }
        } catch (error) {
          console.error('Error booking appointment:', error);
          setMessage('Error booking appointment. Please try again later.');
        }
      }
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
        Book an Appointment
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
              onChange={handleDateChange}
              required
              min={new Date().toISOString().split('T')[0]}
              max={new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]}
              style={{ borderRadius: '6px', padding: '10px', borderColor: '#ccc' }}
            />
            <Form.Control.Feedback type="invalid">
              Please select a valid date.
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formTime">
          <Form.Label column sm={2} style={{ fontWeight: 'bold' }}>Time:</Form.Label>
          <Col sm={10}>
            <Form.Control
              as="select"
              name="time"
              value={appointmentData.time}
              onChange={handleInputChange}
              required
              style={{ borderRadius: '6px', padding: '10px', borderColor: '#ccc' }}
            >
              <option value="">Select Time</option>
              {availableTimes.map((time) => (
                <option key={time} value={time}>{time}</option>
              ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              Please select a valid appointment time.
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formReason">
          <Form.Label column sm={2} style={{ fontWeight: 'bold' }}>Reason:</Form.Label>
          <Col sm={10}>
            <Form.Control
              as="textarea"
              name="reason"
              value={appointmentData.reason}
              onChange={handleInputChange}
              placeholder="Enter reason for appointment (max 200 characters)"
              maxLength={200}
              required
              style={{ borderRadius: '6px', padding: '10px', borderColor: '#ccc' }}
            />
            <Form.Control.Feedback type="invalid">
              Reason must be 200 characters or less.
            </Form.Control.Feedback>
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
              placeholder="Enter your name"
              required
              pattern="[A-Za-z\s]+"
              style={{ borderRadius: '6px', padding: '10px', borderColor: '#ccc' }}
            />
            <Form.Control.Feedback type="invalid">
              Please fill this properly. Patient name can only contain letters.
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Button 
          variant="primary" 
          type="submit" 
          disabled={!staffId} 
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
          Book Appointment
        </Button>
      </Form>
    </Container>
  );
};

export default BookAppointmentPage;