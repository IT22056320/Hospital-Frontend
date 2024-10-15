// src/components/InsuranceList.tsx
import React from 'react';
import { Table, Button } from 'react-bootstrap';
import InsuranceService, { IInsurance } from '../services/InsuranceService';
import { formatDate } from '../utils/formatDate'; // Import formatDate utility
import '../assets/InsuranceList.css'; // Import your custom CSS

interface InsuranceListProps {
  insurances: IInsurance[];
  onEdit: (insurance: IInsurance) => void; // Callback to handle edit
  onDelete: () => void;                    // Callback to refresh the list after deletion
}

const InsuranceList: React.FC<InsuranceListProps> = ({ insurances, onEdit, onDelete }) => {
  const handleDelete = async (id: string) => {
    try {
      await InsuranceService.delete(id);
      onDelete(); // Refresh the list after deletion
    } catch (error) {
      console.error('Failed to delete insurance:', error);
    }
  };

  return (
    <div className="insurance-list-container">
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>Insurance ID</th>
            <th>Policy Number</th>
            <th>Provider</th>
            <th>Coverage Amount</th>
            <th>Premium</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {insurances.map((insurance) => (
            <tr key={insurance._id}>
              <td>{insurance.insuranceId}</td>
              <td>{insurance.policyNumber}</td>
              <td>{insurance.provider}</td>
              <td>{insurance.coverageAmount}</td>
              <td>{insurance.premium}</td>
              <td>{formatDate(insurance.startDate)}</td>
              <td>{formatDate(insurance.endDate)}</td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => onEdit(insurance)}
                  className="me-2"
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(insurance._id!)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Mobile View Display */}
      <div className="d-md-none">
        {insurances.map((insurance) => (
          <div key={insurance._id} className="mobile-insurance-card">
            <h5>Insurance ID: {insurance.insuranceId}</h5>
            <p><strong>Policy Number:</strong> {insurance.policyNumber}</p>
            <p><strong>Provider:</strong> {insurance.provider}</p>
            <p><strong>Coverage Amount:</strong> {insurance.coverageAmount}</p>
            <p><strong>Premium:</strong> {insurance.premium}</p>
            <p><strong>Start Date:</strong> {formatDate(insurance.startDate)}</p>
            <p><strong>End Date:</strong> {formatDate(insurance.endDate)}</p>
            <div className="mobile-actions">
              <Button variant="warning" onClick={() => onEdit(insurance)} className="me-2">
                Edit
              </Button>
              <Button variant="danger" onClick={() => handleDelete(insurance._id!)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsuranceList;
