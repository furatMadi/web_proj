import React, { useState } from "react";
import "../css/AddVictim.css";

const AddVictim = () => {
  const [formData, setFormData] = useState({
    type: "",
    anonymous: false,
    demographics: {
      gender: "",
      age: "",
      ethnicity: "",
      occupation: "",
    },
    contact_info: {
      email: "",
      phone: "",
      secure_messaging: "",
    },
    cases_involved: [],
    risk_assessment: {
      level: "",
      threats: "",
      protection_needed: false,
    },
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes("demographics.")) {
      setFormData((prev) => ({
        ...prev,
        demographics: {
          ...prev.demographics,
          [name.split(".")[1]]: value,
        },
      }));
    } else if (name.includes("contact_info.")) {
      setFormData((prev) => ({
        ...prev,
        contact_info: {
          ...prev.contact_info,
          [name.split(".")[1]]: value,
        },
      }));
    } else if (name.includes("risk_assessment.")) {
      setFormData((prev) => ({
        ...prev,
        risk_assessment: {
          ...prev.risk_assessment,
          [name.split(".")[1]]: type === "checkbox" ? checked : value,
        },
      }));
    } else if (name === "anonymous") {
      setFormData((prev) => ({ ...prev, anonymous: checked }));
    } else if (name === "cases_involved") {
      setFormData((prev) => ({
        ...prev,
        cases_involved: value.split(",").map((id) => id.trim()),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    // ✅ تنظيف البيانات قبل الإرسال
    const cleanedData = {
      ...formData,
      demographics: {
        ...formData.demographics,
        age: parseInt(formData.demographics.age), // تحويل العمر لرقم
      },
      risk_assessment: {
        ...formData.risk_assessment,
        threats: formData.risk_assessment.threats
          ? formData.risk_assessment.threats.split(",").map((t) => t.trim())
          : [],
      },
      support_services: [], // تأكد أنها موجودة كقائمة فاضية إذا مش مستخدمة
    };

    try {
      const response = await fetch("http://localhost:8000/victims/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedData),
      });

      if (!response.ok) throw new Error("Failed to add victim");

      const data = await response.json();
      setSuccess("Victim added successfully with ID: " + data.id);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="add-victim-container">
      <h2>➕ Add New Victim</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Type:</label>
          <input
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group form-checkbox-inline">
          <label>
            <input
              type="checkbox"
              name="anonymous"
              checked={formData.anonymous}
              onChange={handleChange}
            />
            Anonymous
          </label>
        </div>

        <h3>Demographics</h3>
        <div className="form-row">
          <input
            name="demographics.gender"
            placeholder="Gender"
            onChange={handleChange}
            required
          />
          <input
            name="demographics.age"
            type="number"
            placeholder="Age"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-row">
          <input
            name="demographics.ethnicity"
            placeholder="Ethnicity"
            onChange={handleChange}
          />
          <input
            name="demographics.occupation"
            placeholder="Occupation"
            onChange={handleChange}
          />
        </div>

        <h3>Contact Info</h3>
        <div className="form-row">
          <input
            name="contact_info.email"
            placeholder="Email"
            onChange={handleChange}
          />
          <input
            name="contact_info.phone"
            placeholder="Phone"
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <input
            name="contact_info.secure_messaging"
            placeholder="Secure Messaging"
            onChange={handleChange}
          />
        </div>

        <h3>Cases Involved</h3>
        <div className="form-group">
          <input
            name="cases_involved"
            placeholder="Comma-separated case IDs"
            onChange={handleChange}
            required
          />
        </div>

        <h3>Risk Assessment</h3>
        <div className="form-row">
          <input
            name="risk_assessment.level"
            placeholder="Risk Level (e.g., low)"
            onChange={handleChange}
            required
          />
          <input
            name="risk_assessment.threats"
            placeholder="Comma-separated threats"
            onChange={handleChange}
          />
        </div>
        <div className="form-group form-checkbox-inline">
          <label>
            <input
              type="checkbox"
              name="risk_assessment.protection_needed"
              checked={formData.risk_assessment.protection_needed}
              onChange={handleChange}
            />
            ProtectionNeeded
          </label>
        </div>

        <div className="form-group">
          <button type="submit">Submit</button>
        </div>

        {success && <p className="success-msg">{success}</p>}
        {error && <p className="error-msg">{error}</p>}
      </form>
    </div>
  );
};

export default AddVictim;
