import React, { useState, useEffect, CSSProperties } from "react";
import { Table, Button, Container} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface IPatient {
  _id: string;
  name: string;
  email: string;
}

const PatientListPage: React.FC = () => {
  const [patientList, setPatientList] = useState<IPatient[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

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
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const handleAddDiagnosis = (id: string) => {
    navigate(`/patient-diagnosis/${id}`);
  };

  const handleViewDiagnoses = (id: string) => {
    navigate(`/patient-diagnoses/${id}`);
  };

  return (
    <Container style={styles.container}>
      <h1 style={styles.title}>Patient List</h1>

      <Table striped bordered hover responsive="sm" style={styles.table}>
        <thead style={styles.tableHeader}>
          <tr>
            <th style={styles.tableCell}>Name</th>
            <th style={styles.tableCell}>Email</th>
            <th style={styles.tableCell}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patientList.length > 0 ? (
            patientList.map((patient) => (
              <tr key={patient._id}>
                <td style={styles.tableCell}>{patient.name}</td>
                <td style={styles.tableCell}>{patient.email}</td>
                <td style={styles.actionCell}>
                  <Button
                    variant="success"
                    onClick={() => handleAddDiagnosis(patient._id)}
                    style={{ ...styles.actionButton, ...styles.successButton }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#218838";
                      e.currentTarget.style.borderColor = "#1e7e34"; // Border on hover
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#28a745";
                      e.currentTarget.style.borderColor = "#28a745"; // Revert to original
                    }}
                  >
                    Add Diagnosis
                  </Button>
                  <Button
                    variant="warning"
                    onClick={() => handleViewDiagnoses(patient._id)}
                    style={{ ...styles.actionButton, ...styles.warningButton }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#e0a800";
                      e.currentTarget.style.borderColor = "#d39e00"; // Border on hover
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#ffc107";
                      e.currentTarget.style.borderColor = "#ffc107"; // Revert to original
                    }}
                  >
                    View Diagnoses
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} style={styles.noData}>
                No patients found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

const styles: { [key: string]: CSSProperties } = {
  container: {
    padding: "30px",
    marginTop: "60px",
    marginBottom: "60px",
    backgroundColor: "#dce9ff",
    borderRadius: "10px",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
    border: "4px solid #007bff",
    maxWidth: "1300px",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "Black",
    fontFamily: "Arial, sans-serif",
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
  actionCell: {
    padding: "12px 15px",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
  },
  actionButton: {
    padding: "5px 8px",
    marginRight: "2px",
    borderRadius: "5px",
    whiteSpace: "nowrap",
    transition: "background-color 0.3s ease, border-color 0.3s ease", // Smooth transition for both background and border
  },
  successButton: {
    backgroundColor: "#28a745",
    borderColor: "#28a745",
  },
  warningButton: {
    backgroundColor: "#ffc107",
    borderColor: "#ffc107",
  },
  dangerButton: {
    backgroundColor: "#dc3545",
    borderColor: "#dc3545",
  },
  noData: {
    textAlign: "center",
    color: "#6c757d",
    fontStyle: "italic",
    padding: "15px",
  },
};

export default PatientListPage;
