import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface IAppointment {
  _id: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  reason: string;
  patientName: string;
}

const AppointmentListPage: React.FC = () => {
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
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
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this appointment?');
    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:3000/api/v1/appointments/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete appointment');
      }

      setAppointments((prevList) => prevList.filter((appointment) => appointment._id !== id));
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const handleUpdate = (id: string) => {
    navigate(`/update-appointment/${id}`);
  };

  return (
    <div>
      <h1>Appointment List</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Doctor Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Reason</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <tr key={appointment._id}>
                <td>{appointment.doctorName}</td>
                <td>{appointment.date}</td>
                <td>{appointment.time}</td>
                <td>{appointment.reason}</td>
                <td>
                  <Button variant="warning" className="me-2" onClick={() => handleUpdate(appointment._id)}>
                    Update
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(appointment._id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>No appointments found.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default AppointmentListPage;
