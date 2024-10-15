import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

interface IDrug {
  drugName: string;
  dosage: string;
  frequency: string;
}

interface IPatientDiagnosis {
  patientId: string;
  prescriptionId: string;
  prescriptionDate: string;
  symptoms: string;
  diagnosis: string;
  drugs: IDrug[];
  duration: string;
  additionalNotes: string;
}

const UpdateDiagnosisPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [diagnosis, setDiagnosis] = useState<IPatientDiagnosis>({
    patientId: "",
    prescriptionId: "",
    prescriptionDate: "",
    symptoms: "",
    diagnosis: "",
    drugs: [{ drugName: "", dosage: "", frequency: "" }],
    duration: "",
    additionalNotes: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [focusedFields, setFocusedFields] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    fetchDiagnosis();
  }, []);

  const fetchDiagnosis = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/patient-diagnosis/${id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch diagnosis");
      }
      const data = await response.json();
      setDiagnosis(data);
    } catch (error) {
      console.error("Error fetching diagnosis:", error);
      setMessage("Error fetching diagnosis");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/patient-diagnosis/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(diagnosis),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update diagnosis");
      }

      setMessage("Diagnosis updated successfully");
      setTimeout(
        () => navigate(`/patient-diagnoses/${diagnosis.patientId}`),
        2000
      );
    } catch (error) {
      console.error("Error updating diagnosis:", error);
      setMessage("Error updating diagnosis");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index?: number
  ) => {
    if (index !== undefined) {
      const updatedDrugs = [...diagnosis.drugs];
      updatedDrugs[index] = {
        ...updatedDrugs[index],
        [e.target.name]: e.target.value,
      };
      setDiagnosis({ ...diagnosis, drugs: updatedDrugs });
    } else {
      setDiagnosis({ ...diagnosis, [e.target.name]: e.target.value });
    }
  };

  const handleAddDrug = () => {
    setDiagnosis({
      ...diagnosis,
      drugs: [...diagnosis.drugs, { drugName: "", dosage: "", frequency: "" }],
    });
  };

  const handleRemoveDrug = (index: number) => {
    const updatedDrugs = diagnosis.drugs.filter((_, i) => i !== index);
    setDiagnosis({ ...diagnosis, drugs: updatedDrugs });
  };

  const handleCancel = () => {
    navigate(`/patient-diagnoses/${diagnosis.patientId}`);
  };

  // Handle input focus and blur events
  const handleFocus = (field: string) => {
    setFocusedFields((prevState) => ({ ...prevState, [field]: true }));
  };

  const handleBlur = (field: string) => {
    setFocusedFields((prevState) => ({ ...prevState, [field]: false }));
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: "900px",
    margin: "50px auto",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#dce9ff",
    border: "2px solid #007bff",
  };

  const titleStyle: React.CSSProperties = {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "px",
    color: "black",
    fontWeight: "bold",
  };

  const buttonStyle: React.CSSProperties = {
    marginTop: "20px",
    marginBottom: "10px",
    backgroundColor: "#007bff",
    borderRadius: "5px",
    borderColor: "#007bff",
    fontSize: "16px",
    padding: "10px 20px",
    fontWeight: "bold",
    color: "#fff",
  };

  const cancelButtonStyle: React.CSSProperties = {
    marginRight: "20px",
    marginTop: "20px",

    borderColor: "#dc3545",
    color: "#fff",
    borderRadius: "5px",
    fontSize: "16px",
    padding: "10px 65px",
    fontWeight: "bold",
  };

  const formGroupStyle: React.CSSProperties = { marginBottom: "20px" };

  const labelStyle: React.CSSProperties = { fontWeight: "bold", color: "#333" };

  const drugContainerStyle: React.CSSProperties = {
    padding: "10px",
    marginBottom: "15px",
    backgroundColor: "#e9ecef",
    borderRadius: "10px",
    border: "2px solid #007bff",
  };

  const inputStyle: React.CSSProperties = {
    padding: "10px",
    borderRadius: "10px",
    transition: "border-color 0.3s ease",
    border: "2px solid #ced4da",
  };

  const inputFocusStyle: React.CSSProperties = {
    border: "2px solid #007bff",
    outline: "none",
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Update Prescription Form</h1>
      {message && (
        <Alert variant={message.includes("success") ? "success" : "danger"}>
          {message}
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="prescriptionId" style={formGroupStyle}>
          <Form.Label style={labelStyle}>Prescription ID</Form.Label>
          <Form.Control
            type="text"
            name="prescriptionId"
            value={diagnosis.prescriptionId}
            onChange={handleChange}
            required
            style={
              focusedFields["prescriptionId"] ? inputFocusStyle : inputStyle
            }
            onFocus={() => handleFocus("prescriptionId")}
            onBlur={() => handleBlur("prescriptionId")}
          />
        </Form.Group>

        <Form.Group controlId="prescriptionDate" style={formGroupStyle}>
          <Form.Label style={labelStyle}>Prescription Date</Form.Label>
          <Form.Control
            type="date"
            name="prescriptionDate"
            value={diagnosis.prescriptionDate.split("T")[0]}
            onChange={handleChange}
            required
            style={
              focusedFields["prescriptionDate"] ? inputFocusStyle : inputStyle
            }
            onFocus={() => handleFocus("prescriptionDate")}
            onBlur={() => handleBlur("prescriptionDate")}
          />
        </Form.Group>

        <Form.Group controlId="symptoms" style={formGroupStyle}>
          <Form.Label style={labelStyle}>Symptoms</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="symptoms"
            value={diagnosis.symptoms}
            onChange={handleChange}
            required
            style={{ ...inputStyle, resize: "none" }}
            onFocus={() => handleFocus("symptoms")}
            onBlur={() => handleBlur("symptoms")}
          />
        </Form.Group>

        <Form.Group controlId="diagnosis" style={formGroupStyle}>
          <Form.Label style={labelStyle}>Diagnosis</Form.Label>
          <Form.Control
            type="text"
            name="diagnosis"
            value={diagnosis.diagnosis}
            onChange={handleChange}
            required
            style={focusedFields["diagnosis"] ? inputFocusStyle : inputStyle}
            onFocus={() => handleFocus("diagnosis")}
            onBlur={() => handleBlur("diagnosis")}
          />
        </Form.Group>

        {diagnosis.drugs.map((drug, index) => (
          <div key={index} style={drugContainerStyle}>
            <h5>Drug {index + 1}</h5>
            <Form.Group controlId={`drugName-${index}`} style={formGroupStyle}>
              <Form.Label style={labelStyle}>Drug Name</Form.Label>
              <Form.Control
                type="text"
                name="drugName"
                value={drug.drugName}
                onChange={(e) => handleChange(e, index)}
                required
                style={
                  focusedFields[`drugName-${index}`]
                    ? inputFocusStyle
                    : inputStyle
                }
                onFocus={() => handleFocus(`drugName-${index}`)}
                onBlur={() => handleBlur(`drugName-${index}`)}
              />
            </Form.Group>

            <Form.Group controlId={`dosage-${index}`} style={formGroupStyle}>
              <Form.Label style={labelStyle}>Dosage</Form.Label>
              <Form.Control
                type="text"
                name="dosage"
                value={drug.dosage}
                onChange={(e) => handleChange(e, index)}
                required
                style={
                  focusedFields[`dosage-${index}`]
                    ? inputFocusStyle
                    : inputStyle
                }
                onFocus={() => handleFocus(`dosage-${index}`)}
                onBlur={() => handleBlur(`dosage-${index}`)}
              />
            </Form.Group>

            <Form.Group controlId={`frequency-${index}`} style={formGroupStyle}>
              <Form.Label style={labelStyle}>Frequency</Form.Label>
              <Form.Control
                type="text"
                name="frequency"
                value={drug.frequency}
                onChange={(e) => handleChange(e, index)}
                required
                style={
                  focusedFields[`frequency-${index}`]
                    ? inputFocusStyle
                    : inputStyle
                }
                onFocus={() => handleFocus(`frequency-${index}`)}
                onBlur={() => handleBlur(`frequency-${index}`)}
              />
            </Form.Group>
            <Button
              variant="danger"
              onClick={() => handleRemoveDrug(index)}
              style={{ marginBottom: "10px", borderRadius: "5px" }}
            >
              Remove Drug
            </Button>
          </div>
        ))}
        <Button
          variant="primary"
          onClick={handleAddDrug}
          style={{ marginBottom: "20px", borderRadius: "5px" }}
        >
          Add Drug
        </Button>

        <Form.Group controlId="duration" style={formGroupStyle}>
          <Form.Label style={labelStyle}>Duration</Form.Label>
          <Form.Control
            type="text"
            name="duration"
            value={diagnosis.duration}
            onChange={handleChange}
            required
            style={focusedFields["duration"] ? inputFocusStyle : inputStyle}
            onFocus={() => handleFocus("duration")}
            onBlur={() => handleBlur("duration")}
          />
        </Form.Group>

        <Form.Group controlId="additionalNotes" style={formGroupStyle}>
          <Form.Label style={labelStyle}>Additional Notes</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="additionalNotes"
            value={diagnosis.additionalNotes}
            onChange={handleChange}
            style={{ ...inputStyle, resize: "none" }}
            onFocus={() => handleFocus("additionalNotes")}
            onBlur={() => handleBlur("additionalNotes")}
          />
        </Form.Group>

        <Row>
          <Col>
            <Button variant="primary" type="submit" style={buttonStyle}>
              Update Diagnosis
            </Button>
          </Col>
          <Col>
            <Button
              variant="danger"
              onClick={handleCancel}
              style={cancelButtonStyle}
            >
              Cancel
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default UpdateDiagnosisPage;
