import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// Define the IStaff interface to match the populated staff details
interface IStaff {
  _id: string;
  name: string;
  email: string;
  specialization?: string;
  role: string;
}

// Define the IAppointment interface to match the backend response
interface IAppointment {
  _id: string;
  staffId: IStaff | string; // staffId can either be populated staff object or just an ID
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
      console.log(data); 
      setAppointments(data); // Set the fetched appointments into state
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

      // Update the appointment list after deletion
      setAppointments((prevList) => prevList.filter((appointment) => appointment._id !== id));
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const handleUpdate = (id: string) => {
    navigate(`/update-appointment/${id}`); // Navigate to the update appointment page
  };

  return (
    <div>
      <h1>Appointment List</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Doctor Name</th>
            <th>Doctor Email</th>
            <th>Specialization</th>
            <th>Date</th>
            <th>Time</th>
            <th>Reason</th>
            <th>Patient Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <tr key={appointment._id}>
                {/* Check if staffId is populated and has the doctor details */}
                <td>{typeof appointment.staffId === 'object' ? appointment.staffId.name : 'Unknown Doctor'}</td>
                <td>{typeof appointment.staffId === 'object' ? appointment.staffId.email : 'Unknown'}</td>
                <td>{typeof appointment.staffId === 'object' && appointment.staffId.specialization ? appointment.staffId.specialization : 'N/A'}</td>
                <td>{new Date(appointment.date).toLocaleDateString()}</td>
                <td>{appointment.time}</td>
                <td>{appointment.reason}</td>
                <td>{appointment.patientName}</td>
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
              <td colSpan={8}>No appointments found.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default AppointmentListPage;
