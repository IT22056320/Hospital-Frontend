import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Alert, Card } from "react-bootstrap";

// Interface for drug information
interface IDrug {
  drugName: string;
  dosage: string;
  frequency: string;
}

interface IPatientDiagnosis {
  _id: string;
  prescriptionId: string;
  prescriptionDate: string;
  symptoms: string;
  diagnosis: string;
  drugs: IDrug[];
  duration: string;
  additionalNotes: string;
}

const DiagnosisDetailsPage: React.FC = () => {
  const { diagnosisId } = useParams<{ diagnosisId: string }>();
  const navigate = useNavigate();
  const [diagnosis, setDiagnosis] = useState<IPatientDiagnosis | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchDiagnosisDetails();
  }, [diagnosisId]);

  // Fetch diagnosis details by ID
  const fetchDiagnosisDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/patient-diagnosis/${diagnosisId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch diagnosis details");
      }
      const data = await response.json();
      setDiagnosis(data);
    } catch (error) {
      console.error("Error fetching diagnosis details:", error);
      setMessage("Error fetching diagnosis details");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Diagnosis Details</h1>
      {message && <Alert variant="danger">{message}</Alert>}

      {diagnosis ? (
        <Card style={styles.card}>
          <Card.Body>
            <Card.Title style={styles.title}>
              Prescription ID: {diagnosis.prescriptionId}
            </Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              Prescription Date:{" "}
              {new Date(diagnosis.prescriptionDate).toLocaleDateString()}
            </Card.Subtitle>
            <Card.Text>
              <strong>Symptoms:</strong> {diagnosis.symptoms}
            </Card.Text>
            <Card.Text>
              <strong>Diagnosis:</strong> {diagnosis.diagnosis}
            </Card.Text>
            <Card.Text>
              <strong>Duration:</strong> {diagnosis.duration}
            </Card.Text>
            <Card.Text>
              <strong>Additional Notes:</strong> {diagnosis.additionalNotes}
            </Card.Text>
            <strong>Drugs Prescribed:</strong>
            {diagnosis.drugs.length > 0 ? (
              <ul>
                {diagnosis.drugs.map((drug, index) => (
                  <li key={index}>
                    {drug.drugName} - {drug.dosage} ({drug.frequency})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No drugs prescribed</p>
            )}
            <Button
              variant="primary"
              onClick={() => navigate(-1)}
              style={styles.button}
            >
              Back
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <p>Loading diagnosis details...</p>
      )}
    </div>
  );
};

// Inline CSS for styling
const styles = {
  container: {
    margin: "20px auto",
    maxWidth: "95%", // Updated to be more responsive
    padding: "20px",
    backgroundColor: "#dce9ff",
    borderRadius: "8px",
    border: "8px solid #2963f9",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#343a40",
  },
  card: {
    padding: "20px",
    border: "none",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  button: {
    marginTop: "20px",
    width: "100%",
    padding: "10px",
  },
};

export default DiagnosisDetailsPage;
