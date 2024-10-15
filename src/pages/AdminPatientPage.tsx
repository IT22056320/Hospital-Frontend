import React, { useState, useEffect, CSSProperties } from "react";
import { Table, Button, Form } from "react-bootstrap";
import jsPDF from "jspdf"; // PDF generation library
import "jspdf-autotable"; // Import autoTable for generating tables in PDF

interface IPatient {
  _id: string;
  name: string;
  email: string;
}

const AdminPatientPage: React.FC = () => {
  const [patientList, setPatientList] = useState<IPatient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<IPatient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    filterPatients(searchQuery);
  }, [searchQuery, patientList]);

  const fetchPatients = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/staff?role=PATIENT"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }
      const data = await response.json();
      setPatientList(Array.isArray(data) ? data : []);
      setFilteredPatients(Array.isArray(data) ? data : []); // Initial filter set
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filterPatients = (query: string) => {
    if (!query) {
      setFilteredPatients(patientList); // If no query, show all patients
    } else {
      const filtered = patientList.filter((patient) =>
        patient.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Patient List", 10, 10);

    const rows = filteredPatients.map((patient, index) => [
      index + 1,
      patient.name,
      patient.email,
    ]);

    (doc as any).autoTable({
      head: [["#", "Name", "Email"]],
      body: rows,
    });

    doc.save("patient-list.pdf");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Patient List</h1>

      <Form.Control
        type="text"
        placeholder="Search by name"
        value={searchQuery}
        onChange={handleSearchChange}
        style={styles.searchInput}
      />

      <div className="table-responsive">
        <Table striped bordered hover style={styles.table}>
          <thead style={styles.tableHeader}>
            <tr>
              <th style={styles.tableCell}>Name</th>
              <th style={styles.tableCell}>Email</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <tr key={patient._id}>
                  <td style={styles.tableCell}>{patient.name}</td>
                  <td style={styles.tableCell}>{patient.email}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} style={styles.noData}>
                  No patients found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <Button variant="primary" onClick={generatePDF} style={styles.pdfButton}>
        Generate PDF
      </Button>
    </div>
  );
};

const styles: { [key: string]: CSSProperties } = {
  container: {
    padding: "30px",
    marginTop: "60px",
    marginBottom: "60px",
    backgroundColor: "#f8f9fa",
    borderRadius: "10px",
    boxShadow: "0 4px 15px rgba(69, 145, 180, 0.9)",
    maxWidth: "1300px",
    margin: "auto",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#343a40",
    fontFamily: "Arial, sans-serif",
  },
  searchInput: {
    marginBottom: "20px",
    width: "50%",
    margin: "0 auto",
    display: "block",
  },
  table: {
    margin: "20px 0",
    borderCollapse: "collapse",
  },
  tableHeader: {
    fontSize: "10px",
    backgroundColor: "#007bff",
    color: "#ffffff",
    fontWeight: "20px solid",
  },
  tableCell: {
    padding: "12px 15px",
    border: "1px solid #dee2e6",
    textAlign: "left",
    fontWeight: "bold",
  },
  noData: {
    textAlign: "center",
    color: "#6c757d",
    fontStyle: "italic",
    padding: "15px",
  },
  pdfButton: {
    marginTop: "20px",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    padding: "10px 20px",
  },
};

export default AdminPatientPage;
