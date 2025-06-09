import React, { useState } from "react";
import axios from "axios";
import LocationPicker from "../components/LocationPicker";

const AddCaseByAdmin = () => {
  const [formData, setFormData] = useState({
    case_id: "",
    title: "",
    description: "",
    violation_types: [],
    priority: "medium",
    location: {
      country: "",
      region: "",
      coordinates: {
        type: "Point",
        coordinates: [0, 0]
      }
    },
    date_occurred: "",
    date_reported: "",
    victims: [],
    perpetrators: [{ name: "", type: "" }],
    evidence: [{ type: "", url: "", description: "", date_captured: "" }]
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayInput = (e, key) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      [key]: value.split(",").map(v => v.trim())
    }));
  };

  const handlePerpetratorChange = (field, value) => {
    const updated = [...formData.perpetrators];
    updated[0][field] = value;
    setFormData({ ...formData, perpetrators: updated });
  };

  const handleEvidenceChange = (field, value) => {
    const updated = [...formData.evidence];
    updated[0][field] = value;
    setFormData({ ...formData, evidence: updated });
  };

  const handleLocationChange = ({ latitude, longitude, city }) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        region: city || prev.location.region,
        coordinates: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)]
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const cleanedEvidence = formData.evidence.filter(ev =>
    ev.type || ev.url || ev.description || ev.date_captured
  );

  const payload = {
    ...formData,
    evidence: cleanedEvidence,
    status: "accepted",
    created_by: "admin",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  try {
    const res = await axios.post("http://localhost:8000/admin/create-case", payload);
    setMessage(res.data.message || "Case created successfully.");
  } catch (err) {
    setMessage(err.response?.data?.detail || "Something went wrong.");
  }
};

  // Styles...
  const containerStyle = {
    maxWidth: "750px",
    margin: "30px auto",
    padding: "25px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 0 15px rgba(0,0,0,0.1)"
  };
  const formGroup = { display: "flex", flexDirection: "column", marginBottom: "16px" };
  const labelStyle = { fontWeight: "bold", marginBottom: "6px" };
  const inputStyle = { padding: "8px", border: "1px solid #ccc", borderRadius: "5px" };
  const sectionTitle = { marginTop: "25px", marginBottom: "10px", fontSize: "18px", fontWeight: "600", borderBottom: "1px solid #ccc", paddingBottom: "5px" };
  const buttonStyle = { padding: "12px 20px", backgroundColor: "#ff6600", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Add Case (Admin)</h2>
      <form onSubmit={handleSubmit}>
        {/* Basic fields */}
        <div style={formGroup}>
          <label style={labelStyle}>Case ID:</label>
          <input style={inputStyle} name="case_id" value={formData.case_id} onChange={handleChange} required />
        </div>

        <div style={formGroup}>
          <label style={labelStyle}>Title:</label>
          <input style={inputStyle} name="title" value={formData.title} onChange={handleChange} required />
        </div>

        <div style={formGroup}>
          <label style={labelStyle}>Description:</label>
          <textarea style={{ ...inputStyle, height: "100px" }} name="description" value={formData.description} onChange={handleChange} required />
        </div>

        <div style={formGroup}>
          <label style={labelStyle}>Violation Types (comma-separated):</label>
          <input style={inputStyle} value={formData.violation_types.join(", ")} onChange={(e) => handleArrayInput(e, "violation_types")} />
        </div>

        <div style={formGroup}>
          <label style={labelStyle}>Priority:</label>
          <select style={inputStyle} name="priority" value={formData.priority} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Location */}
        <h4 style={sectionTitle}>Location</h4>
        <div style={formGroup}>
          <label style={labelStyle}>Country:</label>
          <input style={inputStyle} name="country" value={formData.location.country} onChange={(e) =>
            setFormData(prev => ({
              ...prev,
              location: { ...prev.location, country: e.target.value }
            }))
          } />
        </div>
        <div style={formGroup}>
          <label style={labelStyle}>Region/City:</label>
          <input style={inputStyle} name="region" value={formData.location.region} onChange={(e) =>
            setFormData(prev => ({
              ...prev,
              location: { ...prev.location, region: e.target.value }
            }))
          } />
        </div>
        <div style={formGroup}>
          <label style={labelStyle}>Select on Map:</label>
          <LocationPicker onChange={handleLocationChange} />
          <p>Coordinates: {formData.location.coordinates.coordinates.join(", ")}</p>
        </div>

        {/* Dates */}
        <h4 style={sectionTitle}>Dates</h4>
        <div style={formGroup}>
          <label style={labelStyle}>Date Occurred:</label>
          <input style={inputStyle} type="datetime-local" name="date_occurred" value={formData.date_occurred} onChange={handleChange} required />
        </div>
        <div style={formGroup}>
          <label style={labelStyle}>Date Reported:</label>
          <input style={inputStyle} type="datetime-local" name="date_reported" value={formData.date_reported} onChange={handleChange} required />
        </div>

        {/* Victims */}
        <div style={formGroup}>
          <label style={labelStyle}>Victim IDs (comma-separated):</label>
          <input style={inputStyle} value={formData.victims.join(", ")} onChange={(e) => handleArrayInput(e, "victims")} />
        </div>

        {/* Perpetrator */}
        <h4 style={sectionTitle}>Perpetrator</h4>
        <div style={formGroup}>
          <label style={labelStyle}>Name:</label>
          <input style={inputStyle} value={formData.perpetrators[0].name} onChange={(e) => handlePerpetratorChange("name", e.target.value)} />
        </div>
        <div style={formGroup}>
          <label style={labelStyle}>Type:</label>
          <input style={inputStyle} value={formData.perpetrators[0].type} onChange={(e) => handlePerpetratorChange("type", e.target.value)} />
        </div>

        {/* Evidence */}
        <h4 style={sectionTitle}>Evidence</h4>
        <div style={formGroup}>
          <label style={labelStyle}>Type:</label>
          <input style={inputStyle} value={formData.evidence[0].type} onChange={(e) => handleEvidenceChange("type", e.target.value)} />
        </div>
        <div style={formGroup}>
          <label style={labelStyle}>URL:</label>
          <input style={inputStyle} value={formData.evidence[0].url} onChange={(e) => handleEvidenceChange("url", e.target.value)} />
        </div>
        <div style={formGroup}>
          <label style={labelStyle}>Description:</label>
          <input style={inputStyle} value={formData.evidence[0].description} onChange={(e) => handleEvidenceChange("description", e.target.value)} />
        </div>
        <div style={formGroup}>
          <label style={labelStyle}>Date Captured:</label>
          <input style={inputStyle} type="datetime-local" value={formData.evidence[0].date_captured} onChange={(e) => handleEvidenceChange("date_captured", e.target.value)} />
        </div>

        {/* Submit */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button type="submit" style={buttonStyle}>Submit Case</button>
        </div>
      </form>

      {message && (
        <pre style={{ textAlign: "center", marginTop: "15px", fontWeight: "bold", color: "red" }}>
          {message}
        </pre>
      )}
    </div>
  );
};

export default AddCaseByAdmin;
