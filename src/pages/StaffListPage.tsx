import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface IStaff {
  _id: string;
  name: string;
  email: string;
  role: string;
  contactInformation: string;
  department: string;
  schedule: string;
}

const StaffListPage: React.FC = () => {
  const [staffList, setStaffList] = useState<IStaff[]>([]);
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    fetchStaff();
  }, []);

  // Fetch staff members from the backend
  const fetchStaff = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/staff');
      if (!response.ok) {
        throw new Error('Failed to fetch staff');
      }
      const data = await response.json();
      setStaffList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  // Handle delete staff
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this staff member?');
    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:3000/api/v1/staff/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete staff');
      }

      // Remove deleted staff from the list
      setStaffList((prevList) => prevList.filter((staff) => staff._id !== id));
    } catch (error) {
      console.error('Error deleting staff:', error);
    }
  };

  // Handle view details
  const handleViewDetails = (id: string) => {
    navigate(`/staff-details/${id}`); // Navigate to the staff details page with the staff ID
  };

  return (
    <div>
      <h1>Staff Members</h1>
      <Button
        variant="primary"
        onClick={() => navigate('/staff-form')} // Navigate to the form page to add new staff
        className="mb-3"
      >
        Add New Staff
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Contact Information</th>
            <th>Department</th>
            <th>Schedule</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {staffList.length > 0 ? (
            staffList.map((staff) => (
              <tr key={staff._id}>
                <td>{staff.name}</td>
                <td>{staff.email}</td>
                <td>{staff.role}</td>
                <td>{staff.contactInformation}</td>
                <td>{staff.department}</td>
                <td>{staff.schedule}</td>
                <td>
                  <Button
                    variant="info"
                    className="me-2"
                    onClick={() => handleViewDetails(staff._id)} // Navigate to details page
                  >
                    View Details
                  </Button>
                  <Button
                    variant="warning"
                    className="me-2"
                    onClick={() => navigate(`/staff-update/${staff._id}`)} // Navigate to update form
                  >
                    Update
                  </Button>
                  <Button
                    variant="info"
                    className="me-2"
                    onClick={() => navigate(`/staff/${staff._id}/schedule`)} // Navigate to schedule page
                  >
                    View Schedule
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(staff._id)} // Handle staff deletion
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7}>No staff members found.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default StaffListPage;
