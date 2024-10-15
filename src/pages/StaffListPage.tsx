import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Row, Col, FormControl, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Import autoTable for generating tables in PDF

interface IStaff {
  _id: string;
  name: string;
  email: string;
  role: string;
  contactInformation: string;
  department: string;
}

const StaffListPage: React.FC = () => {
  const [staffList, setStaffList] = useState<IStaff[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<IStaff[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, staffList]);

  // Fetch staff members from the backend
  const fetchStaff = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/staff');
      if (!response.ok) {
        throw new Error('Failed to fetch staff');
      }
      const data = await response.json();
      
      // Filter out staff with role of 'PATIENT'
      const filteredStaff = data.filter((staff: IStaff) => staff.role !== 'PATIENT');
      setStaffList(Array.isArray(filteredStaff) ? filteredStaff : []);
      setFilteredStaff(Array.isArray(filteredStaff) ? filteredStaff : []);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  // Handle search
  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredStaff(staffList); // If no query, show all staff
    } else {
      const filtered = staffList.filter((staff) =>
        staff.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredStaff(filtered);
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

  // Handle schedule view
  const handleViewSchedule = (id: string) => {
    navigate(`/work-schedule/${id}`); // Navigate to the staff schedule page with the staff ID
  };

  // Handle add new staff
  const handleAddNewStaff = () => {
    navigate('/staff-form'); // Navigate to add staff form
  };

  // Generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Staff List', 10, 10);

    const rows = filteredStaff.map((staff, index) => [
      index + 1,
      staff.name,
      staff.email,
      staff.role,
      staff.contactInformation,
      staff.department,
    ]);

    (doc as any).autoTable({
      head: [['#', 'Name', 'Email', 'Role', 'Contact Info', 'Department']],
      body: rows,
    });

    doc.save('staff-list.pdf');
  };

  return (
    <Container fluid className="pt-4">
      <Row className="justify-content-center mb-4">
        <Col xs={12} className="text-center">
          <h1 className="mb-4" style={styles.heading}>Staff Members</h1>
          <Button
            variant="primary"
            onClick={handleAddNewStaff}
            className="mb-4 btn-lg"
            style={styles.addButton}
          >
            Add New Staff
          </Button>
        </Col>
      </Row>

      <Row className="justify-content-center mb-4">
        <Col xs={12} md={8} lg={6}>
          <Form>
            <FormControl
              type="text"
              placeholder="Search by name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </Form>
        </Col>
        <Col xs={12} className="text-center">
          <Button
            variant="success"
            onClick={generatePDF}
            className="mb-4 btn-lg"
            style={styles.pdfButton}
          >
            Generate PDF
          </Button>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <div className="table-responsive-md shadow-lg p-3 mb-5 bg-white rounded">
            <Table striped bordered hover responsive="md" className="table-hover text-center">
              <thead className="table-primary text-white">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Contact Info</th>
                  <th>Department</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.length > 0 ? (
                  filteredStaff.map((staff) => (
                    <tr key={staff._id} className="bg-gray-100 hover:bg-gray-200 transition duration-200 ease-in-out">
                      <td className="py-2">{staff.name}</td>
                      <td className="py-2">{staff.email}</td>
                      <td className="py-2">{staff.role}</td>
                      <td className="py-2">{staff.contactInformation}</td>
                      <td className="py-2">{staff.department}</td>
                      <td className="py-2">
                        <Button
                          variant="info"
                          className="me-2 mb-2 bg-blue-500 hover:bg-blue-600 text-white"
                          onClick={() => handleViewDetails(staff._id)}
                          style={styles.actionButton}
                        >
                          View
                        </Button>
                        <Button
                          variant="warning"
                          className="me-2 mb-2 bg-yellow-500 hover:bg-yellow-600 text-white"
                          onClick={() => navigate(`/staff-update/${staff._id}`)}
                          style={styles.actionButton}
                        >
                          Update
                        </Button>
                        <Button
                          variant="info"
                          className="me-2 mb-2 bg-green-500 hover:bg-green-600 text-white"
                          onClick={() => handleViewSchedule(staff._id)}
                          style={styles.actionButton}
                        >
                          Schedule
                        </Button>
                        <Button
                          variant="danger"
                          className="mb-2 bg-red-500 hover:bg-red-600 text-white"
                          onClick={() => handleDelete(staff._id)}
                          style={styles.actionButton}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center">
                      No staff members found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

// Inline CSS for additional styling
const styles = {
  heading: {
    color: '#007bff',
    fontSize: '2.5rem',
    fontWeight: 'bold',
  },
  addButton: {
    borderRadius: '8px',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    transition: 'background-color 0.3s',
  },
  searchInput: {
    marginBottom: '20px',
    width: '100%',
  },
  pdfButton: {
    borderRadius: '8px',
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    transition: 'background-color 0.3s',
  },
  actionButton: {
    borderRadius: '8px',
    padding: '5px 10px',
  },
};

export default StaffListPage;
