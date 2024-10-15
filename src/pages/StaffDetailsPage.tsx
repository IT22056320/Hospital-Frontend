import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Button, Modal, Container, Row, Col } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';

interface IStaff {
  name: string;
  email: string;
  role: string;
  contactInformation: string;
  department: string;
}

interface IStaffDetails {
  workExperience: string;
  about: string;
  degree: string;
  specialization: string;
}

const StaffDetailsPage: React.FC = () => {
  const { staffId } = useParams<{ staffId: string }>();

  const [staff, setStaff] = useState<IStaff>({
    name: '',
    email: '',
    role: '',
    contactInformation: '',
    department: '',
  });

  const [details, setDetails] = useState<IStaffDetails>({
    workExperience: '',
    about: '',
    degree: '',
    specialization: '',
  });

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchStaff();
    fetchStaffDetails();
  }, [staffId]);

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
      });
    } catch (error) {
      console.error('Error fetching staff info:', error);
    }
  };

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

  // Validation schema using Yup
  const validationSchema = Yup.object().shape({
    workExperience: Yup.number()
      .typeError('Work Experience must be a number')
      .min(1, 'Work Experience must be at least 1 year')
      .max(50, 'Work Experience must be less than or equal to 50 years')
      .required('Work Experience is required'),
    about: Yup.string().required('About information is required'),
    degree: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, 'Degree must not contain numbers or special characters')
      .required('Degree is required'),
    specialization: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, 'Specialization must not contain numbers or special characters')
      .required('Specialization is required'),
  });

  const handleSubmit = async (values: IStaffDetails) => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/staff-details/${staffId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to update staff details');
      }

      const updatedDetails = await response.json();
      setDetails(updatedDetails);
      alert('Staff details updated successfully');
      setShowModal(false);
    } catch (error) {
      console.error('Error updating staff details:', error);
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={6} className="mx-auto">
          <div className="shadow-lg p-4 rounded" style={styles.detailsContainer}>
            <h1 className="text-center mb-4" style={styles.heading}>Staff Details</h1>
            <h3 style={styles.subheading}>Basic Information</h3>
            <p><strong>Name:</strong> {staff.name}</p>
            <p><strong>Email:</strong> {staff.email}</p>
            <p><strong>Role:</strong> {staff.role}</p>
            <p><strong>Contact Information:</strong> {staff.contactInformation}</p>
            <p><strong>Department:</strong> {staff.department}</p>

            <h3 style={styles.subheading}>Additional Information</h3>
            <p><strong>Work Experience:</strong> {details.workExperience} years</p>
            <p><strong>About:</strong> {details.about}</p>
            <p><strong>Degree:</strong> {details.degree}</p>
            <p><strong>Specialization:</strong> {details.specialization}</p>

            <Button variant="info" className="mt-3 w-100" onClick={() => setShowModal(true)} style={styles.editButton}>
              Edit Details
            </Button>
          </div>
        </Col>
      </Row>

      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Staff Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={details}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, errors, touched, handleChange, handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formWorkExperience">
                  <Form.Label>Work Experience</Form.Label>
                  <Form.Control
                    type="text"
                    name="workExperience"
                    placeholder="Enter work experience"
                    value={values.workExperience}
                    onChange={handleChange}
                    isInvalid={touched.workExperience && !!errors.workExperience}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.workExperience}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formAbout">
                  <Form.Label>About</Form.Label>
                  <Form.Control
                    type="text"
                    name="about"
                    placeholder="Enter about information"
                    value={values.about}
                    onChange={handleChange}
                    isInvalid={touched.about && !!errors.about}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.about}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formDegree">
                  <Form.Label>Degree</Form.Label>
                  <Form.Control
                    type="text"
                    name="degree"
                    placeholder="Enter degree"
                    value={values.degree}
                    onChange={handleChange}
                    isInvalid={touched.degree && !!errors.degree}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.degree}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formSpecialization">
                  <Form.Label>Specialization</Form.Label>
                  <Form.Control
                    type="text"
                    name="specialization"
                    placeholder="Enter specialization"
                    value={values.specialization}
                    onChange={handleChange}
                    isInvalid={touched.specialization && !!errors.specialization}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.specialization}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-3 w-100">
                  Save Changes
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

// Inline CSS for additional styling
const styles = {
  detailsContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0px 4px 15px rgba(0, 123, 255, 0.2)',
  },
  heading: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#007bff',
  },
  subheading: {
    fontSize: '1.25rem',
    color: '#343a40',
    marginTop: '20px',
    marginBottom: '10px',
  },
  editButton: {
    backgroundColor: '#17a2b8',
    border: 'none',
    fontSize: '1rem',
  },
};

export default StaffDetailsPage;
