import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import styles for toast
import './Calendar.css'; // Custom CSS for styling the calendar grid

// Utility function to generate time slots (e.g., 09:00 AM - 10:00 AM)
const generateTimeSlots = (start: number, end: number): string[] => {
  const slots = [];
  for (let i = start; i < end; i++) {
    const startTime = i < 10 ? `0${i}:00 AM` : i < 12 ? `${i}:00 AM` : i === 12 ? `12:00 PM` : `${i - 12}:00 PM`;
    const endTime = i + 1 < 10 ? `0${i + 1}:00 AM` : i + 1 < 12 ? `${i + 1}:00 AM` : i + 1 === 12 ? `12:00 PM` : `${i - 11}:00 PM`;
    slots.push(`${startTime} - ${endTime}`);
  }
  return slots;
};

// Define time slots from 9:00 AM to 5:00 PM
const timeSlots = generateTimeSlots(6, 22);

// Initial schedule for the week (Monday to Sunday)
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface ITimeSlot {
  time: string;
  available: boolean;
}

interface ScheduleState {
  [day: string]: ITimeSlot[];
}

const WorkSchedule: React.FC = () => {
  const { staffId } = useParams<{ staffId: string }>();
  const [schedule, setSchedule] = useState<ScheduleState>({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: []
  });

  const [staff, setStaff] = useState<any>(null);
  const [loading, setLoading] = useState(true); // Add loading state for fetching
  const [saving, setSaving] = useState(false); // Add saving state for saving
  const [error, setError] = useState<string | null>(null); // Add error state

  const navigate = useNavigate(); // Initialize navigate for redirection

  // Fetch staff data from the API
  const fetchStaff = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/v1/staff/${staffId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch staff info');
      }
      const data = await response.json();
      setStaff(data);
    } catch (error) {
      setError('Failed to load staff data. Please try again later.');
    } finally {
      setLoading(false); // Stop loading once done
    }
  };

  // Initialize the schedule with unavailable time slots if they don't exist
  useEffect(() => {
    fetchStaff();
  }, [staffId]);

  useEffect(() => {
    if (staff) {
      const initialSchedule: ScheduleState = {};
      daysOfWeek.forEach((day) => {
        initialSchedule[day] = timeSlots.map((time) => {
          // If no slot exists for the time, set it as unavailable (available: false)
          const existingSlot = staff?.schedule && staff?.schedule[day]?.find((slot: any) => slot.time === time);
          return existingSlot || { time, available: false };
        });
      });
      setSchedule(initialSchedule);
    }
  }, [staff]);

  // Toggle availability status of a time slot
  const toggleAvailability = (day: string, time: string) => {
    setSchedule((prevSchedule) => {
      const daySchedule = prevSchedule[day] || [];

      const updatedDaySchedule = daySchedule.map((slot) =>
        slot.time === time ? { ...slot, available: !slot.available } : slot
      );

      return { ...prevSchedule, [day]: updatedDaySchedule };
    });
  };

  // Save the full schedule to an API
  const saveSchedule = async () => {
    setSaving(true); // Start saving
    const apiEndpoint = `http://localhost:3000/api/v1/staff/${staffId}`;

    try {
      const response = await fetch(apiEndpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...staff,
          schedule
        }) // Send the entire schedule
      });

      if (!response.ok) {
        throw new Error('Failed to save schedule');
      }

      // Show success toast notification
      toast.success('Schedule saved successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Navigate to staff list after a short delay
      setTimeout(() => {
        navigate('/staff-list');
      }, 3000);
      
    } catch (error) {
      setError('Failed to save schedule. Please try again.');
    } finally {
      setSaving(false); // Stop saving
    }
  };

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  // Show error message if fetching fails
  if (error) {
    return (
      <Container className="text-center my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid>
      <ToastContainer /> {/* Toast container to display notifications */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="elegant-title">Weekly Schedule for {staff?.name}</h2>
        <Button onClick={saveSchedule} variant="primary" className="shadow-lg">
          {saving ? 'Saving...' : 'Save Schedule'}
        </Button>
      </div>

      {/* Display schedule in rows */}
      <Row className="calendar-row">
        {daysOfWeek.map((day) => (
          <Col xs={12} md={6} lg={4} key={day} className="mb-4">
            <Card className="shadow day-card">
              <Card.Body>
                <Card.Title className="text-center day-title">{day}</Card.Title>
                {timeSlots.map((time) => {
                  const isAvailable =
                    schedule[day]?.find((slot) => slot.time === time)?.available ?? false;

                  return (
                    <div
                      key={time}
                      className={`time-slot-container mb-3 ${isAvailable ? 'available-slot' : 'unavailable-slot'}`}
                      onClick={() => toggleAvailability(day, time)} // Toggle on click
                    >
                      <div className="time-slot text-center">
                        {time}
                      </div>
                    </div>
                  );
                })}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default WorkSchedule;
