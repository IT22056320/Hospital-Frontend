// src/services/InsuranceService.ts
export interface IInsurance {
    _id?: string;
    insuranceId: string;
    policyNumber: string;
    provider: string;
    coverageAmount: number;
    premium: number;
    startDate: string;
    endDate: string;
  }
  
  const API_URL = 'http://localhost:3000/api/insurance';
  
  class InsuranceService {
    async getAll(): Promise<IInsurance[]> {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch insurances');
      }
      return response.json();
    }
  
    async get(id: string): Promise<IInsurance> {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch insurance');
      }
      return response.json();
    }
  
    async create(insurance: IInsurance): Promise<IInsurance> {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(insurance),
      });
      if (!response.ok) {
        throw new Error('Failed to create insurance');
      }
      return response.json();
    }
  
    async update(id: string, insurance: IInsurance): Promise<IInsurance> {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(insurance),
      });
      if (!response.ok) {
        throw new Error('Failed to update insurance');
      }
      return response.json();
    }
  
    async delete(id: string): Promise<void> {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete insurance');
      }
    }
  }
  
  export default new InsuranceService();
  