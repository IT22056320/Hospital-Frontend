import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [roleData, setRoleData] = useState<{ [key: string]: number }>({});

  // Fetch staff data and categorize them by role
  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/staff');
      if (!response.ok) {
        throw new Error('Failed to fetch staff data');
      }
      const data = await response.json();

      // Categorize staff by roles
      const roleCounts: { [key: string]: number } = {};
      data.forEach((staff: any) => {
        const role = staff.role;
        roleCounts[role] = (roleCounts[role] || 0) + 1;
      });
      setRoleData(roleCounts);
    } catch (error) {
      console.error('Error fetching staff data:', error);
    }
  };

  // Prepare chart data
  const chartData = {
    labels: Object.keys(roleData),
    datasets: [
      {
        label: 'Staff Roles',
        data: Object.values(roleData),
        backgroundColor: ['#007bff', '#28a745', '#ffc107', '#17a2b8', '#6f42c1'],
        hoverBackgroundColor: ['#0056b3', '#218838', '#e0a800', '#138496', '#5a1ea3'],
      },
    ],
  };

  return (
    <Container fluid className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h2>

      {/* Admin-specific quick access links */}
      <Row className="gap-y-6 mb-5">
        <Col md={6} sm={12}>
          <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
            <Card.Body className="p-6">
              <Card.Title className="text-xl font-semibold text-blue-600 mb-4">Staff Management</Card.Title>
              <Card.Text className="text-gray-600">
                View and manage staff members.
              </Card.Text>
              <Button 
                variant="primary" 
                className="w-full mt-4 py-2"
                onClick={() => navigate('/staff-list')}
              >
                Manage Staff
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} sm={12}>
          <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
            <Card.Body className="p-6">
              <Card.Title className="text-xl font-semibold text-teal-600 mb-4">Patient Management</Card.Title>
              <Card.Text className="text-gray-600">
                Manage patients and view records.
              </Card.Text>
              <Button 
                variant="info" 
                className="w-full mt-4 py-2"
                onClick={() => navigate('/admin-patients')}
              >
                Manage Patients
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Chart section for staff roles */}
      <Row className="mt-5">
        <Col md={6} className="mx-auto">
          <Card className="shadow-lg">
            <Card.Body>
              <h4 className="text-center text-primary mb-4">Staff Roles Distribution</h4>
              <div className="chart-container" style={{ height: '300px', width: '100%' }}>
                <Pie data={chartData} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
