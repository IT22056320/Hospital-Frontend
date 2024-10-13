// StaffSchedulePage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

const StaffSchedulePage: React.FC = () => {
  const { staffId } = useParams<{ staffId: string }>();
  const [schedule, setSchedule] = useState<string>('');

  useEffect(() => {
    fetchSchedule();
  }, [staffId]);

  const fetchSchedule = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/staff/${staffId}/schedule`);
      if (!response.ok) throw new Error('Failed to fetch schedule');
      const data = await response.json();
      setSchedule(data.schedule);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/v1/staff/${staffId}/schedule`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schedule }),
      });
      if (!response.ok) throw new Error('Failed to update schedule');
      alert('Schedule updated successfully');
    } catch (error) {
      console.error('Error updating schedule:', error);
    }
  };

  return (
    <div>
      <h1>Staff Schedule</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="schedule">
          <Form.Label>Schedule</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter schedule details"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
          />
        </Form.Group>
        <Button type="submit">Save Schedule</Button>
      </Form>
    </div>
  );
};

export default StaffSchedulePage;
