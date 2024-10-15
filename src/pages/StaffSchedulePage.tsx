import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface RecurringSchedule {
  day: string; // "Monday", "Tuesday", etc.
  isFreeDay: boolean;
  timeSlots: TimeSlot[];
}

interface CustomSchedule {
  date: Date | null; // Store the specific date
  isFreeDay: boolean;
  timeSlots: TimeSlot[];
}

interface Schedule {
  recurring: RecurringSchedule[];
  custom: CustomSchedule[];
}

const StaffSchedulePage: React.FC = () => {
  const { staffId } = useParams<{ staffId: string }>(); // Get staffId from route params
  const [recurringSchedule, setRecurringSchedule] = useState<RecurringSchedule[]>([]);
  const [customSchedule, setCustomSchedule] = useState<CustomSchedule[]>([]);

  useEffect(() => {
    fetchSchedule();
  }, [staffId]);

  const fetchSchedule = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/staff/${staffId}/schedule`);
      if (!response.ok) throw new Error('Failed to fetch schedule');
      const data: Schedule = await response.json();

      setRecurringSchedule(data.recurring);
      setCustomSchedule(
        data.custom.map((custom: any) => ({
          ...custom,
          date: new Date(custom.date), // Ensure date is a Date object
        }))
      );
    } catch (error) {
      console.error('Error fetching schedule:', error);
    }
  };

  // Update recurring schedule handler
  const handleRecurringChange = (index: number, key: string, value: any) => {
    const updatedSchedule = [...recurringSchedule];
    updatedSchedule[index] = { ...updatedSchedule[index], [key]: value };
    setRecurringSchedule(updatedSchedule);
  };

  // Update custom schedule handler
  const handleCustomChange = (index: number, key: string, value: any) => {
    const updatedSchedule = [...customSchedule];
    updatedSchedule[index] = { ...updatedSchedule[index], [key]: value };
    setCustomSchedule(updatedSchedule);
  };

  // Handle date change for custom schedule
  const handleDateChange = (index: number, date: Date | null) => {
    const updatedSchedule = [...customSchedule];
    updatedSchedule[index].date = date;
    setCustomSchedule(updatedSchedule);
  };

  // Submit the schedule updates to the backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/v1/staff/${staffId}/schedule`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recurring: recurringSchedule,
          custom: customSchedule,
        }),
      });
      if (!response.ok) throw new Error('Failed to update schedule');
      alert('Schedule updated successfully');
    } catch (error) {
      console.error('Error updating schedule:', error);
    }
  };

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4" style={{ color: '#007bff' }}>Staff Schedule</h1>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6} className="mb-4">
            <Card className="shadow-sm">
              <Card.Body>
                <h4 className="text-primary mb-3">Recurring Schedule</h4>
                {recurringSchedule.map((daySchedule, index) => (
                  <div key={index} className="mb-3">
                    <Form.Group controlId={`recurring-day-${index}`}>
                      <Form.Label>Day: {daySchedule.day}</Form.Label>
                      <Form.Check
                        type="checkbox"
                        label="Is Free Day"
                        checked={daySchedule.isFreeDay}
                        onChange={(e) => handleRecurringChange(index, 'isFreeDay', e.target.checked)}
                        className="mb-2"
                      />
                    </Form.Group>

                    <Form.Group controlId={`recurring-timeSlots-${index}`}>
                      <Form.Label>Time Slots</Form.Label>
                      <ul>
                        {daySchedule.timeSlots.map((slot, slotIndex) => (
                          <li key={slotIndex}>
                            {slot.startTime} - {slot.endTime}
                          </li>
                        ))}
                      </ul>
                    </Form.Group>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} className="mb-4">
            <Card className="shadow-sm">
              <Card.Body>
                <h4 className="text-primary mb-3">Custom Schedule</h4>
                {customSchedule.map((daySchedule, index) => (
                  <div key={daySchedule.date?.toString() || index} className="mb-3">
                    <Form.Group controlId={`custom-day-${index}`}>
                      <Form.Label>Date</Form.Label>
                      <DatePicker
                        selected={daySchedule.date}
                        onChange={(date) => handleDateChange(index, date)}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Select a day"
                        className="form-control"
                      />
                    </Form.Group>

                    <Form.Group controlId={`custom-freeDay-${index}`}>
                      <Form.Check
                        type="checkbox"
                        label="Is Free Day"
                        checked={daySchedule.isFreeDay}
                        onChange={(e) => handleCustomChange(index, 'isFreeDay', e.target.checked)}
                        className="mb-2"
                      />
                    </Form.Group>

                    <Form.Group controlId={`custom-timeSlots-${index}`}>
                      <Form.Label>Time Slots</Form.Label>
                      <ul>
                        {daySchedule.timeSlots.map((slot, slotIndex) => (
                          <li key={slotIndex}>
                            {slot.startTime} - {slot.endTime}
                          </li>
                        ))}
                      </ul>
                    </Form.Group>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Button type="submit" className="btn-block btn-lg" style={{ backgroundColor: '#007bff', border: 'none', borderRadius: '8px' }}>
          Save Schedule
        </Button>
      </Form>
    </Container>
  );
};

export default StaffSchedulePage;
