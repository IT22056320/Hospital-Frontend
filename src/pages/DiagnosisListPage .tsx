import React, { useState, useEffect, CSSProperties } from "react";
import { Table, Button, Alert, Container } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";

// Interface for diagnosis information
interface IPatientDiagnosis {
  _id: string;
  prescriptionId: string;
  prescriptionDate: string; // Adjust format if necessary
  diagnosis: string;
  additionalNotes: string;
}

const DiagnosisListPage: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>(); // Get patientId from URL params
  const navigate = useNavigate();
  const [diagnoses, setDiagnoses] = useState<IPatientDiagnosis[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [showQRCode, setShowQRCode] = useState(false); // State to toggle QR code visibility

  useEffect(() => {
    fetchDiagnoses();
  }, []);

  // Fetch diagnoses by patient ID
  const fetchDiagnoses = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/patient-diagnosis/patient/${patientId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch diagnoses");
      }
      const data = await response.json();
      setDiagnoses(data);
    } catch (error) {
      console.error("Error fetching diagnoses:", error);
      setMessage("Error fetching diagnoses");
    }
  };

  // Handle view diagnosis details
  const handleViewDetails = (id: string) => {
    navigate(`/diagnosis-details/${id}`); // Navigate to the diagnosis details page
  };

  // Handle delete diagnosis
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this diagnosis?"
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/patient-diagnosis/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete diagnosis");
      }

      // Remove deleted diagnosis from the list
      setDiagnoses((prevList) =>
        prevList.filter((diagnosis) => diagnosis._id !== id)
      );
      setMessage("Diagnosis deleted successfully");
    } catch (error) {
      console.error("Error deleting diagnosis:", error);
      setMessage("Error deleting diagnosis");
    }
  };

  // Handle update diagnosis
  const handleUpdate = (id: string) => {
    navigate(`/update-diagnosis/${id}`); // Navigate to the update diagnosis form
  };

  // Toggle QR code visibility
  const handleGenerateQRCode = () => {
    setShowQRCode(!showQRCode); // Toggle the QR code display
  };

  // Get the current URL
  const currentUrl = window.location.href;

  return (
    <Container style={styles.container}>
      <h1 style={styles.title}>Diagnoses for Patient</h1>
      {message && (
        <Alert
          variant={message.includes("success") ? "success" : "danger"}
          style={styles.alert}
        >
          {message}
        </Alert>
      )}

      {/* Button to generate the QR code */}
      <Button
        variant="primary"
        onClick={handleGenerateQRCode}
        className="mb-3"
        style={styles.button}
      >
        {showQRCode ? "Hide QR Code" : "Generate QR Code"}
      </Button>

      {/* Display the QR code if the state is toggled on */}
      {showQRCode && (
        <div style={styles.qrCodeContainer}>
          <QRCode value={currentUrl} size={256} />
        </div>
      )}

      {diagnoses.length > 0 ? (
        <Table striped bordered hover responsive="sm" style={styles.table}>
          <thead style={styles.tableHeader}>
            <tr>
              <th style={styles.tableCell}>Prescription ID</th>
              <th style={styles.tableCell}>Prescription Date</th>
              <th style={styles.tableCell}>Diagnosis</th>
              <th style={styles.tableCell}>Additional Notes</th>
              <th style={styles.actionCell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {diagnoses.map((diagnosis) => (
              <tr key={diagnosis._id}>
                <td style={styles.tableCell}>{diagnosis.prescriptionId}</td>
                <td style={styles.tableCell}>
                  {new Date(diagnosis.prescriptionDate).toLocaleDateString()}
                </td>
                <td style={styles.tableCell}>{diagnosis.diagnosis}</td>
                <td style={styles.tableCell}>{diagnosis.additionalNotes}</td>
                <td style={styles.actionCell}>
                  <Button
                    variant="info"
                    className="me-2"
                    onClick={() => handleViewDetails(diagnosis._id)}
                    style={{ ...styles.actionButton, ...styles.infoButton }}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="warning"
                    className="me-2"
                    onClick={() => handleUpdate(diagnosis._id)}
                    style={{ ...styles.actionButton, ...styles.warningButton }}
                  >
                    Update
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(diagnosis._id)}
                    style={{ ...styles.actionButton, ...styles.dangerButton }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p style={styles.noData}>No diagnoses found for this patient.</p>
      )}
    </Container>
  );
};

const styles: { [key: string]: CSSProperties } = {
  container: {
    padding: "30px",
    marginTop: "60px",
    //marginTop: "0px",
    marginBottom: "60px",
    backgroundColor: "#f8f9fa",
    borderRadius: "10px",
    border: "4px solid #007bff",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
    maxWidth: "1300px",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "black",
    fontFamily: "Arial, sans-serif",
  },
  alert: {
    textAlign: "center",
    marginBottom: "20px",
  },
  button: {
    display: "block",
    margin: "0 auto",
    padding: "10px 20px",
  },
  qrCodeContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  table: {
    margin: "20px 0",
    borderCollapse: "collapse",
  },
  tableHeader: {
    fontSize: "14px",
    backgroundColor: "#007bff",
    color: "#ffffff",
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
  infoButton: {
    backgroundColor: "#17a2b8",
    borderColor: "#17a2b8",
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
  },
};

export default DiagnosisListPage;
