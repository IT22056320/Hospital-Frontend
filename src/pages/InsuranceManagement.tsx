// src/pages/InsuranceManagement.tsx
import React, { useState, useEffect } from 'react';
import InsuranceForm from '../pages/InsuranceForm';
import InsuranceList from '../pages/InsuranceList';
import InsuranceService, { IInsurance } from '../services/InsuranceService';

const InsuranceManagement: React.FC = () => {
  const [insurances, setInsurances] = useState<IInsurance[]>([]);
  const [selectedInsurance, setSelectedInsurance] = useState<IInsurance | undefined>(undefined);

  // Fetch insurance data when the component mounts
  const fetchInsurances = async () => {
    try {
      const data = await InsuranceService.getAll();
      setInsurances(data);
    } catch (error) {
      console.error('Failed to fetch insurances:', error);
    }
  };

  useEffect(() => {
    fetchInsurances();
  }, []);

  // This will be called after a successful create/update operation
  const handleSuccess = () => {
    fetchInsurances(); // Fetch the updated list of insurances
    setSelectedInsurance(undefined); // Reset the form
  };

  return (
    <div className="container mt-5">
      <h1>Insurance Management</h1>
      <InsuranceForm insurance={selectedInsurance} onSuccess={handleSuccess} />
      <hr />
      <InsuranceList insurances={insurances} onEdit={setSelectedInsurance} onDelete={fetchInsurances} />
    </div>
  );
};

export default InsuranceManagement;
