import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Phone number validation regex for Sri Lanka
const phoneNumberRegex = /^(?:0|94|\+94)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|912)(0|2|3|4|5|7|9)|7(0|1|2|5|6|7|8)\d)\d{6}$/;

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, 'Name must contain only letters and spaces.')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  contactInformation: Yup.string()
    .matches(phoneNumberRegex, 'Contact information must be a valid Sri Lankan phone number.')
    .required('Contact information is required'),
  department: Yup.string()
    .required('Department is required'),
  role: Yup.string().required('Role is required'),
});

// List of hospital departments
const departments = [
  'Admin',
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Radiology',
  'Oncology',
  'Gynecology',
  'Emergency',
  'Dermatology',
  'Anesthesiology',
];

// Role options
const roles = ['DOCTOR', 'NURSE', 'ADMIN'];

const StaffUpdatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get staff ID from URL params
  const navigate = useNavigate();

  // State for staff details
  const [initialValues, setInitialValues] = useState({
    name: '',
    email: '',
    role: '',
    contactInformation: '',
    department: '',
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
        setInitialValues({
          name: data.name,
          email: data.email,
          role: data.role,
          contactInformation: data.contactInformation,
          department: data.department, // Set the department from fetched data
        });
      } catch (error) {
        console.error('Error fetching staff details:', error);
      }
    };

    fetchStaffDetails();
  }, [id]);

  // Handle form submission to update staff
  const handleUpdateStaff = async (values: typeof initialValues) => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/staff/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to update staff');
      }

      toast.success('Staff updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setTimeout(() => {
        navigate('/staff-list'); // Redirect to staff list after update
      }, 3000);

    } catch (error) {
      console.error('Error updating staff:', error);
      toast.error('Error updating staff, please try again.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center" style={{ backgroundColor: '#f4f7fc', minHeight: '100vh' }}>
      <ToastContainer /> {/* Include Toast Container for displaying toasts */}
      <Row className="justify-content-center w-100">
        <Col xs={12} md={8} lg={6}>
          <div className="p-4 p-md-5 shadow-lg" style={{ backgroundColor: '#ffffff', borderRadius: '15px', maxWidth: '100%', width: '100%' }}>
            <h2 className="text-center mb-4" style={{ color: '#007bff' }}>Update Staff</h2>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleUpdateStaff}
              enableReinitialize
            >
              {({
                handleChange,
                handleSubmit,
                values,
                errors,
                touched,
                handleBlur,
              }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Group controlId="formName" className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter name"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={!!errors.name && touched.name}
                      className="form-control-lg"
                      style={{ borderRadius: '8px', padding: '12px' }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="formEmail" className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={!!errors.email && touched.email}
                      className="form-control-lg"
                      style={{ borderRadius: '8px', padding: '12px' }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="formRole" className="mb-3">
                    <Form.Label>Role</Form.Label>
                    <Form.Control
                      as="select"
                      name="role"
                      value={values.role}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="form-control-lg"
                      style={{ borderRadius: '8px', padding: '12px' }}
                    >
                      <option value="">Select Role</option>
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {errors.role}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="formContactInformation" className="mb-3">
                    <Form.Label>Contact Information</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter contact information"
                      name="contactInformation"
                      value={values.contactInformation}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={!!errors.contactInformation && touched.contactInformation}
                      className="form-control-lg"
                      style={{ borderRadius: '8px', padding: '12px' }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.contactInformation}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="formDepartment" className="mb-4">
                    <Form.Label>Department</Form.Label>
                    <Form.Control
                      as="select"
                      name="department"
                      value={values.department}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="form-control-lg"
                      style={{ borderRadius: '8px', padding: '12px' }}
                    >
                      <option value="">Select Department</option>
                      {departments.map((department) => (
                        <option key={department} value={department}>
                          {department}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {errors.department}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 btn-lg"
                    style={{
                      backgroundColor: '#007bff',
                      borderRadius: '8px',
                      padding: '14px',
                      fontSize: '18px',
                      border: 'none',
                    }}
                  >
                    Update Staff
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default StaffUpdatePage;
