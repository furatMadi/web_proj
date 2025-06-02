import React, { useState } from "react";
import axios from "axios";
import LocationPicker from "../components/LocationPicker";
const cardStyle = {
  maxWidth: "600px",
  margin: "30px auto",
  padding: "20px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  backgroundColor: "#fff",
};

const rowStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "15px",
};

const labelStyle = {
  width: "150px",
  marginRight: "10px",
  fontWeight: "bold",
};

const inputStyle = {
  flex: 1,
  padding: "6px",
};

const AddReport = () => {
  const [formData, setFormData] = useState({
    reporter_type: "",
    anonymous: false,
    contact_info: { name: "", email: "", phone: "" },
    incident_details: {
      date: "",
      location: { country: "", city: "", latitude: "", longitude: "" },
      description: "",
      violation_types: [],
    },
    evidence: [],
    assigned_to: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNestedChange = (e, parentKey, subKey = null) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (subKey) {
        return {
          ...prev,
          [parentKey]: {
            ...prev[parentKey],
            [subKey]: {
              ...prev[parentKey][subKey],
              [name]: value,
            },
          },
        };
      }
      return {
        ...prev,
        [parentKey]: {
          ...prev[parentKey],
          [name]: value,
        },
      };
    });
  };

  const handleArrayChange = (e, parentKey, subKey) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [subKey]: value.split(",").map((item) => item.trim()),
      },
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault(); // Prevent default form submission behavior
  try {
    const response = await axios.post("http://localhost:8000/reports/report", formData); // store the result in a variable
    setMessage(response.data.message); // use the response variable correctly
  } catch (error) {
    setMessage(error.response?.data?.detail || "Failed to add report"); // Handle error message
  }
};

  return (
    <div style={cardStyle}>
      <h1 style={{ textAlign: "center" }}>Add Incident Report</h1>
      <form onSubmit={handleSubmit}>
        <div style={rowStyle}>
          <label style={labelStyle}>Reporter Type:</label>
          <input
            type="text"
            name="reporter_type"
            value={formData.reporter_type}
            onChange={handleChange}
            style={inputStyle}
            required
          />
        </div>
        <div style={rowStyle}>
          <label style={labelStyle}>Anonymous:</label>
          <input
            type="checkbox"
            name="anonymous"
            checked={formData.anonymous}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, anonymous: e.target.checked }))
            }
          />
        </div>
        {!formData.anonymous && (
          <>
            <div style={rowStyle}>
              <label style={labelStyle}>Contact Name:</label>
              <input
                type="text"
                name="name"
                value={formData.contact_info.name}
                onChange={(e) => handleNestedChange(e, "contact_info")}
                style={inputStyle}
              />
            </div>
            <div style={rowStyle}>
              <label style={labelStyle}>Contact Email:</label>
              <input
                type="email"
                name="email"
                value={formData.contact_info.email}
                onChange={(e) => handleNestedChange(e, "contact_info")}
                style={inputStyle}
              />
            </div>
            <div style={rowStyle}>
              <label style={labelStyle}>Contact Phone:</label>
              <input
                type="text"
                name="phone"
                value={formData.contact_info.phone}
                onChange={(e) => handleNestedChange(e, "contact_info")}
                style={inputStyle}
              />
            </div>
          </>
        )}
        <div style={rowStyle}>
          <label style={labelStyle}>Incident Date:</label>
          <input
            type="datetime-local"
            name="date"
            value={formData.incident_details.date}
            onChange={(e) => handleNestedChange(e, "incident_details")}
            style={inputStyle}
            required
          />
        </div>
       <div style={rowStyle}>
  <label style={labelStyle}>Location Country:</label>
  <input
    type="text"
    name="country"
    value={formData.incident_details.location.country}
    onChange={(e) => handleNestedChange(e, "incident_details", "location")}
    style={inputStyle}
    required
  />
</div>

  <div style={rowStyle}>
  <label style={labelStyle}>Select Location on Map:</label>
  <div style={{ flex: 1 }}>
    <LocationPicker
      latitude={formData.incident_details.location.latitude}
      longitude={formData.incident_details.location.longitude}
      onChange={({ latitude, longitude, city }) =>
       setFormData((prev) => ({
       ...prev,
       incident_details: {
      ...prev.incident_details,
      location: {
        ...prev.incident_details.location,
        latitude,
        longitude,
        city, // ✅ Now defined and correctly saved
      },
    },
  }))
}

    />
  </div>
</div>
<div style={rowStyle}>
  <label style={labelStyle}>City:</label>
  <span>{formData.incident_details.location.city || "Not set"}</span>
</div>

{/* <div style={rowStyle}>
  <label style={labelStyle}>Use My Location:</label>
  <button
    type="button"
    onClick={() => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setFormData((prev) => ({
              ...prev,
              incident_details: {
                ...prev.incident_details,
                location: {
                  ...prev.incident_details.location,
                  latitude,
                  longitude,
                },
              },
            }));
          },
          (error) => {
            alert("Failed to get location: " + error.message);
          }
        );
      } else {
        alert("Geolocation is not supported by your browser.");
      }
    }}
    style={{ padding: "8px 16px" }}
  >
    Get My Location
  </button>
</div> */}

<div style={rowStyle}>
  <label style={labelStyle}>Latitude:</label>
  <span>{formData.incident_details.location.latitude || "Not set"}</span>
</div>
<div style={rowStyle}>
  <label style={labelStyle}>Longitude:</label>
  <span>{formData.incident_details.location.longitude || "Not set"}</span>
</div>


        <div style={rowStyle}>
          <label style={labelStyle}>Description:</label>
          <textarea
            name="description"
            value={formData.incident_details.description}
            onChange={(e) => handleNestedChange(e, "incident_details")}
            style={{ ...inputStyle, height: "80px" }}
            required
          />
        </div>
        <div style={rowStyle}>
          <label style={labelStyle}>Violation Types:</label>
          <input
            type="text"
            name="violation_types"
            value={formData.incident_details.violation_types.join(", ")}
            onChange={(e) => handleArrayChange(e, "incident_details", "violation_types")}
            style={inputStyle}
          />
        </div>
        <div style={rowStyle}>
          <label style={labelStyle}>Assigned To:</label>
          <input
            type="text"
            name="assigned_to"
            value={formData.assigned_to}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <div style={{ textAlign: "center" }}>
          <button type="submit" style={{ padding: "10px 20px" }}>Submit</button>
        </div>
      </form>
      {message && <p style={{ textAlign: "center" }}>{message}</p>}
    </div>
  );
};

export default AddReport;