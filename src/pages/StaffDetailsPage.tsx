import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Button, Modal } from 'react-bootstrap';

interface IStaff {
  name: string;
  email: string;
  role: string;
  contactInformation: string;
  department: string;
  schedule: string;
}

interface IStaffDetails {
  workExperience: string;
  about: string;
  degree: string;
  specialization: string;
}

const StaffDetailsPage: React.FC = () => {
  const { staffId } = useParams<{ staffId: string }>(); // Get staff ID from URL params

  // State for basic staff information
  const [staff, setStaff] = useState<IStaff>({
    name: '',
    email: '',
    role: '',
    contactInformation: '',
    department: '',
    schedule: '',
  });

  // State for additional staff details
  const [details, setDetails] = useState<IStaffDetails>({
    workExperience: '',
    about: '',
    degree: '',
    specialization: '',
  });

  // State for modal visibility
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Fetch both staff info and details on component mount
    fetchStaff();
    fetchStaffDetails();
  }, [staffId]);

  // Fetch basic staff information from the staff CRUD
  const fetchStaff = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/staff/${staffId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch staff info');
      }
      const data = await response.json();
      setStaff({
        name: data.name,
        email: data.email,
        role: data.role,
        contactInformation: data.contactInformation,
        department: data.department,
        schedule: data.schedule,
      });
    } catch (error) {
      console.error('Error fetching staff info:', error);
    }
  };

  // Fetch additional staff details from the Staff Details CRUD
  const fetchStaffDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/staff-details/${staffId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch staff details');
      }
      const data = await response.json();
      setDetails({
        workExperience: data.workExperience || '',
        about: data.about || '',
        degree: data.degree || '',
        specialization: data.specialization || '',
      });
    } catch (error) {
      console.error('Error fetching staff details:', error);
    }
  };

  // Handle form submission to update staff details
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3000/api/v1/staff-details/${staffId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(details),
      });

      if (!response.ok) {
        throw new Error('Failed to update staff details');
      }

      // Update the state with the new details (to reflect the changes immediately)
      const updatedDetails = await response.json();
      setDetails(updatedDetails); // Update the details in state to reflect changes

      alert('Staff details updated successfully');
      setShowModal(false); // Close the modal after successful update
    } catch (error) {
      console.error('Error updating staff details:', error);
    }
  };

  return (
    <div>
      <h1>Staff Details</h1>

      <h3>Basic Information</h3>
      <p><strong>Name:</strong> {staff.name}</p>
      <p><strong>Email:</strong> {staff.email}</p>
      <p><strong>Role:</strong> {staff.role}</p>
      <p><strong>Contact Information:</strong> {staff.contactInformation}</p>
      <p><strong>Department:</strong> {staff.department}</p>
      <p><strong>Schedule:</strong> {staff.schedule}</p>

      <h3>Additional Information</h3>
      <p><strong>Work Experience:</strong> {details.workExperience}</p>
      <p><strong>About:</strong> {details.about}</p>
      <p><strong>Degree:</strong> {details.degree}</p>
      <p><strong>Specialization:</strong> {details.specialization}</p>

      {/* Button to open modal for editing */}
      <Button variant="info" className="mt-3" onClick={() => setShowModal(true)}>
        Edit Details
      </Button>

      {/* Modal for updating staff details */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Staff Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formWorkExperience">
              <Form.Label>Work Experience</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter work experience"
                value={details.workExperience}
                onChange={(e) => setDetails({ ...details, workExperience: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="formAbout">
              <Form.Label>About</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter about information"
                value={details.about}
                onChange={(e) => setDetails({ ...details, about: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="formDegree">
              <Form.Label>Degree</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter degree"
                value={details.degree}
                onChange={(e) => setDetails({ ...details, degree: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="formSpecialization">
              <Form.Label>Specialization</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter specialization"
                value={details.specialization}
                onChange={(e) => setDetails({ ...details, specialization: e.target.value })}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StaffDetailsPage;
