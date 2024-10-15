import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface AppointmentFormState {
  date: string;
  time: string;
  reason: string;
  patientName: string;
  staffId: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const validationSchema = Yup.object().shape({
  reason: Yup.string().required('Reason is required'),
  patientName: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, 'Patient name can only contain letters and spaces')
    .required('Patient name is required'),
});

const BookAppointmentPage: React.FC = () => {
  const { staffId } = useParams<{ staffId: string }>();
  const navigate = useNavigate();

  const [schedule, setSchedule] = useState<any>(null); // Store staff's schedule
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Loading state for fetching schedule
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null); // Track selected time slot
  const [selectedDaySlots, setSelectedDaySlots] = useState<TimeSlot[] | null>(null); // Corrected to an array of objects

  useEffect(() => {
    if (!staffId) {
      setMessage('Error: Missing doctor information.');
      return;
    }

    // Fetch the doctor's schedule
    const fetchSchedule = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/staff/${staffId}`);
        if (!response.ok) throw new Error('Failed to fetch schedule');
        const data = await response.json();
        
        if (data && typeof data.schedule === 'object') {
          setSchedule(data.schedule);
        } else {
          setMessage('No available schedule found.');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching available schedule:', error);
        setMessage('Failed to load available schedule.');
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [staffId]);

  const handleSlotSelect = (time: string) => {
    setSelectedSlot(time); // Allow only one slot to be selected
  };

  const handleFormSubmit = async (values: AppointmentFormState) => {
    if (!selectedSlot) {
      setMessage('Please select a time slot.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/v1/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...values, time: selectedSlot }),
      });

      if (response.ok) {
        setMessage('Appointment created successfully!');
        // Show toast notification on success
        toast.success('Appointment created successfully!');
        setTimeout(() => navigate('/choose-payment'), 3000); // Delay for toast
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message}`);
        // Show error toast
        toast.error(`Error: ${errorData.message}`);
      }
    } catch (error) {
      setMessage('Error booking appointment. Please try again later.');
      // Show error toast
      toast.error('Error booking appointment. Please try again later.');
    }
  };

  // Show loading state while fetching schedule
  if (loading) {
    return (
      <Container className="mt-5">
        <Alert variant="info">Loading available schedule...</Alert>
      </Container>
    );
  }

  // Show error message if schedule fails to load
  if (!schedule || Object.keys(schedule).length === 0) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">No available time slots found. Please try again later.</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5 p-4" style={{ maxWidth: '800px', boxShadow: '0px 0px 20px rgba(0,0,0,0.1)', borderRadius: '10px' }}>
      <ToastContainer />
      <h2 className="mb-4 text-center" style={{ color: '#2963f9', fontWeight: 'bold' }}>Book an Appointment</h2>
      {message && <Alert variant={message.startsWith('Error') ? 'danger' : 'success'}>{message}</Alert>}

      <Formik
        initialValues={{
          date: '',
          time: '',
          reason: '',
          patientName: '',
          staffId: staffId || '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({ values, handleChange }) => (
          <FormikForm>
            <Form.Group as={Row} className="mb-4" controlId="formDate">
              <Form.Label column sm={3} className="text-end">Date:</Form.Label>
              <Col sm={9}>
                <Field
                  as={Form.Control}
                  type="date"
                  name="date"
                  value={values.date}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleChange(e);
                    const selectedDate = new Date(e.target.value);
                    const dayOfWeek = daysOfWeek[selectedDate.getDay()];
                    if (schedule && schedule[dayOfWeek]) {
                      setSelectedDaySlots(schedule[dayOfWeek].filter((slot: TimeSlot) => slot.available));
                    } else {
                      setSelectedDaySlots(null);
                    }
                  }}
                  required
                  className="shadow-sm"
                />
              </Col>
            </Form.Group>

            {selectedDaySlots && (
              <Form.Group as={Row} className="mb-4" controlId="formTime">
                <Form.Label column sm={3} className="text-end">Available Time Slots:</Form.Label>
                <Col sm={9}>
                  {selectedDaySlots.map((slot: TimeSlot) => (
                    <Button
                      key={slot.time}
                      variant={selectedSlot === slot.time ? 'success' : 'outline-primary'}
                      onClick={() => handleSlotSelect(slot.time)}
                      className="m-2 shadow-sm"
                      style={{ minWidth: '100px' }}
                    >
                      {slot.time}
                    </Button>
                  ))}
                </Col>
              </Form.Group>
            )}

            {!selectedDaySlots && values.date && (
              <Alert variant="warning">No available slots for the selected date.</Alert>
            )}

            <Form.Group as={Row} className="mb-4" controlId="formReason">
              <Form.Label column sm={3} className="text-end">Reason:</Form.Label>
              <Col sm={9}>
                <Field
                  as={Form.Control}
                  type="text"
                  name="reason"
                  placeholder="Enter reason for appointment"
                  required
                  className="shadow-sm"
                />
                <ErrorMessage name="reason" component="div" className="text-danger" />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-4" controlId="formPatientName">
              <Form.Label column sm={3} className="text-end">Patient Name:</Form.Label>
              <Col sm={9}>
                <Field
                  as={Form.Control}
                  type="text"
                  name="patientName"
                  placeholder="Enter your name"
                  required
                  className="shadow-sm"
                />
                <ErrorMessage name="patientName" component="div" className="text-danger" />
              </Col>
            </Form.Group>

            <Row className="text-center">
              <Col>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={!selectedSlot}
                  className="shadow-sm"
                  style={{ borderRadius: '30px', padding: '10px 20px' }}
                >
                  Book Appointment
                </Button>
              </Col>
            </Row>
          </FormikForm>
        )}
      </Formik>
    </Container>
  );
};

export default BookAppointmentPage;