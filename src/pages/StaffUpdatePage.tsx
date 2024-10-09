import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

interface IStaff {
  name: string;
  email: string;
  password: string;
  role: string;
  contactInformation: string;
  department: string;
  schedule: string;
}

const StaffUpdatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get staff ID from URL params
  const navigate = useNavigate();

  // State for staff details
  const [staff, setStaff] = useState<IStaff>({
    name: '',
    email: '',
    password: '',
    role: '',
    contactInformation: '',
    department: '',
    schedule: '',
  });

  // Fetch staff details by ID
  useEffect(() => {
    const fetchStaffDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/staff/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch staff details');
        }
        const data = await response.json();
        setStaff(data);
      } catch (error) {
        console.error('Error fetching staff details:', error);
      }
    };

    fetchStaffDetails();
  }, [id]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStaff((prevState) => ({ ...prevState, [name]: value }));
  };

  // Handle form submission to update staff
  const handleUpdateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/v1/staff/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(staff),
      });

      if (!response.ok) {
        throw new Error('Failed to update staff');
      }

      alert('Staff updated successfully!');
      navigate('/staff-list'); // Redirect to staff list page after update
    } catch (error) {
      console.error('Error updating staff:', error);
    }
  };

  return (
    <div>
      <h1>Update Staff</h1>
      <Form onSubmit={handleUpdateStaff}>
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            name="name"
            value={staff.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            value={staff.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter new password (leave empty to keep current password)"
            name="password"
            value={staff.password}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formRole">
          <Form.Label>Role</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter role"
            name="role"
            value={staff.role}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formContactInformation">
          <Form.Label>Contact Information</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter contact information"
            name="contactInformation"
            value={staff.contactInformation}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formDepartment">
          <Form.Label>Department</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter department"
            name="department"
            value={staff.department}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formSchedule">
          <Form.Label>Schedule</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter schedule"
            name="schedule"
            value={staff.schedule}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Update Staff
        </Button>
      </Form>
    </div>
  );
};

export default StaffUpdatePage;
