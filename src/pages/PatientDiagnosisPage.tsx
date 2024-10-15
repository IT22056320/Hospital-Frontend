import React, { useState } from "react";
import { Form, Button, Alert, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

interface IPatientDiagnosis {
  patientId: string;
  prescriptionId: string;
  prescriptionDate: Date;
  symptoms: string;
  diagnosis: string;
  drugs: {
    drugName: string;
    dosage: string;
    frequency: string;
  }[];
  duration: string;
  additionalNotes: string;
}

const PatientDiagnosisPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [diagnosis, setDiagnosis] = useState<IPatientDiagnosis>({
    patientId: "",
    prescriptionId: "",
    prescriptionDate: new Date(),
    symptoms: "",
    diagnosis: "",
    drugs: [
      {
        drugName: "",
        dosage: "",
        frequency: "",
      },
    ],
    duration: "",
    additionalNotes: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [focusedFields, setFocusedFields] = useState<{
    [key: string]: boolean;
  }>({});

  const handleFocus = (field: string) => {
    setFocusedFields({ ...focusedFields, [field]: true });
  };

  const handleBlur = (field: string) => {
    setFocusedFields({ ...focusedFields, [field]: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/patient-diagnosis/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(diagnosis),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add diagnosis");
      }

      setMessage("Diagnosis added successfully");
      setTimeout(() => navigate(`/patient-diagnoses/${id}`), 2000);
    } catch (error) {
      console.error("Error adding diagnosis:", error);
      setMessage("Error adding diagnosis");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index?: number
  ) => {
    if (index !== undefined && e.target.name.startsWith("drug")) {
      const updatedDrugs = [...diagnosis.drugs];
      const fieldName = e.target.name.replace("drug.", "");
      updatedDrugs[index] = {
        ...updatedDrugs[index],
        [fieldName]: e.target.value,
      };
      setDiagnosis({ ...diagnosis, drugs: updatedDrugs });
    } else {
      setDiagnosis({
        ...diagnosis,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleCancel = () => {
    navigate(`/patient-list/${diagnosis.patientId}`);
  };

  const addDrug = () => {
    setDiagnosis({
      ...diagnosis,
      drugs: [
        ...diagnosis.drugs,
        {
          drugName: "",
          dosage: "",
          frequency: "",
        },
      ],
    });
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
    fontSize: "32px",
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
    marginTop: "10px",
    marginLeft: "20px",
    borderColor: "#dc3545",
    color: "#fff",
    borderRadius: "5px",
    fontSize: "16px",
    padding: "10px 65px",
    fontWeight: "bold",
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: "900",
    marginBottom: "10px",
  };

  const drugContainerStyle: React.CSSProperties = {
    padding: "10px",
    marginTop: "15px",
    marginBottom: "15px",
    backgroundColor: "#e9ecef",
    borderRadius: "10px",
    border: "2px solid #007bff",
  };

  const inputStyle: React.CSSProperties = {
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "10px",
    backgroundColor: "#f9f9f9",
  };

  const inputFocusStyle: React.CSSProperties = {
    border: "2px solid #3348b6",
    borderRadius: "10px",
    padding: "10px",
    backgroundColor: "#f9f9f9",
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Prescription Form</h1>
      {message && (
        <Alert variant={message.includes("success") ? "success" : "danger"}>
          {message}
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col xs={12}>
            <Form.Group controlId="prescriptionId">
              <Form.Label style={labelStyle}>Prescription ID</Form.Label>
              <Form.Control
                type="text"
                name="prescriptionId"
                value={diagnosis.prescriptionId}
                placeholder="P0001"
                onChange={handleChange}
                required
                style={
                  focusedFields["prescriptionId"] ? inputFocusStyle : inputStyle
                }
                onFocus={() => handleFocus("prescriptionId")}
                onBlur={() => handleBlur("prescriptionId")}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <Form.Group controlId="symptoms">
              <Form.Label style={labelStyle}>Symptoms</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="symptoms"
                value={diagnosis.symptoms}
                placeholder="Add any symptoms"
                onChange={handleChange}
                required
                style={focusedFields["symptoms"] ? inputFocusStyle : inputStyle}
                onFocus={() => handleFocus("symptoms")}
                onBlur={() => handleBlur("symptoms")}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <Form.Group controlId="diagnosis">
              <Form.Label style={labelStyle}>Diagnosis</Form.Label>
              <Form.Control
                type="text"
                name="diagnosis"
                value={diagnosis.diagnosis}
                placeholder="Add diagnosis"
                onChange={handleChange}
                required
                style={
                  focusedFields["diagnosis"] ? inputFocusStyle : inputStyle
                }
                onFocus={() => handleFocus("diagnosis")}
                onBlur={() => handleBlur("diagnosis")}
              />
            </Form.Group>
          </Col>
        </Row>

        {diagnosis.drugs.map((drug, index) => (
          <div key={index} style={drugContainerStyle}>
            <h4>Drug {index + 1}</h4>
            <Row>
              <Col xs={12}>
                <Form.Group controlId={`drugName-${index}`}>
                  <Form.Label style={labelStyle}>Drug Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="drug.drugName"
                    value={drug.drugName}
                    placeholder="Add Drug Name"
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
              </Col>
              <Col xs={12}>
                <Form.Group controlId={`dosage-${index}`}>
                  <Form.Label style={labelStyle}>
                    Dosage (e.g., 500 mg)
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="drug.dosage"
                    value={drug.dosage}
                    placeholder="Add Drug Dosage"
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
              </Col>
              <Col xs={12}>
                <Form.Group controlId={`frequency-${index}`}>
                  <Form.Label style={labelStyle}>
                    Frequency (e.g., twice daily)
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="drug.frequency"
                    value={drug.frequency}
                    placeholder="Add Drug Frequency"
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
              </Col>
            </Row>
          </div>
        ))}

        <Button
          variant="primary"
          onClick={addDrug}
          style={{ marginBottom: "20px", borderRadius: "5px" }}
        >
          Add Drug
        </Button>

        <Row>
          <Col xs={12}>
            <Form.Group controlId="duration">
              <Form.Label style={labelStyle}>
                Duration (e.g., 7 days)
              </Form.Label>
              <Form.Control
                type="text"
                name="duration"
                value={diagnosis.duration}
                placeholder="Add Duration"
                onChange={handleChange}
                required
                style={focusedFields["duration"] ? inputFocusStyle : inputStyle}
                onFocus={() => handleFocus("duration")}
                onBlur={() => handleBlur("duration")}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <Form.Group controlId="additionalNotes">
              <Form.Label style={labelStyle}>Additional Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="additionalNotes"
                value={diagnosis.additionalNotes}
                placeholder="Add Any Additional Notes"
                onChange={handleChange}
                style={
                  focusedFields["additionalNotes"]
                    ? inputFocusStyle
                    : inputStyle
                }
                onFocus={() => handleFocus("additionalNotes")}
                onBlur={() => handleBlur("additionalNotes")}
              />
            </Form.Group>
          </Col>
        </Row>

        <Button type="submit" style={buttonStyle}>
          Submit Diagnosis
        </Button>
        <Button
          variant="danger"
          onClick={handleCancel}
          style={cancelButtonStyle}
        >
          Cancel
        </Button>
      </Form>
    </div>
  );
};

export default PatientDiagnosisPage;
