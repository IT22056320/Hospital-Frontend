import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Phone number validation regex for Sri Lanka
const phoneNumberRegex = /^(?:0|94|\+94)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|912)(0|2|3|4|5|7|9)|7(0|1|2|5|6|7|8)\d)\d{6}$/;

// Validation schema using Yup with custom phone number validation
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, 'Name must contain only letters and spaces.')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters long')
    .required('Password is required'),
  contactInformation: Yup.string()
    .matches(phoneNumberRegex, 'Contact information must be a valid Sri Lankan phone number.')
    .required('Contact information is required'),
  role: Yup.string().required('Role is required'),
  department: Yup.string().required('Department is required'),
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

interface IStaff {
  name: string;
  email: string;
  password: string;
  role: string;
  contactInformation: string;
  department: string;
}

const roles = ['DOCTOR', 'NURSE', 'ADMIN'];

const StaffManagementPage: React.FC = () => {
  const navigate = useNavigate();

  const initialValues: IStaff = {
    name: '',
    email: '',
    password: '',
    role: '',
    contactInformation: '',
    department: '',
  };

  const handleCreateStaff = async (values: IStaff) => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
  
      if (response.status === 409) { // Handle conflict error (email already exists)
        throw new Error('A user with this email already exists.');
      }
  
      if (!response.ok) {
        throw new Error('Failed to create staff');
      }
  
      // Show success toast notification
      toast.success('Staff created successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
  
      // Redirect to staff list after a short delay (after the toast closes)
      setTimeout(() => {
        navigate('/staff-list');
      }, 3000);
  
    } catch (error) {
      // Narrowing down the type of error
      if (error instanceof Error) {
        // Show error toast notification
        toast.error(error.message, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        // Fallback message for unknown error types
        toast.error('An unexpected error occurred. Please try again.', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  };
  

  return (
    <Container 
      fluid 
      className="d-flex justify-content-center align-items-center" 
      style={{ backgroundColor: '#f4f7fc', minHeight: '100vh' }}
    >
      <ToastContainer /> {/* Include Toast Container for displaying toasts */}
      <Row className="justify-content-center w-100">
        <Col xs={12} md={8} lg={6}>
          <div 
            className="p-4 p-md-5 shadow-lg" 
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '15px',
              maxWidth: '100%',
              width: '100%',
            }}
          >
            <h2 className="text-center mb-4" style={{ color: '#007bff' }}>
              Create New Staff
            </h2>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleCreateStaff}
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

                  <Form.Group controlId="formPassword" className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter password"
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={!!errors.password && touched.password}
                      className="form-control-lg"
                      style={{ borderRadius: '8px', padding: '12px' }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
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
                    Create Staff
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

export default StaffManagementPage;
