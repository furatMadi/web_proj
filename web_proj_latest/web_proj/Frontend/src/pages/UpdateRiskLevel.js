import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateRiskLevel = () => {
  const { victimId } = useParams();
  const navigate = useNavigate();
  const [level, setLevel] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpdate = async () => {
    setLoading(true);
    setMessage("");

    const data = {
      level,
      notes,
      assessed_by: "admin_user", // اختياري
    };

    try {
      const response = await fetch(
        `http://localhost:8000/victims/${victimId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) throw new Error("Failed to update risk level");

      setMessage("✅ Risk level updated successfully");
      setTimeout(() => navigate("/victim-details"), 1500);
    } catch (err) {
      setMessage("❌ Error updating risk level");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: "2rem" }}>
      <h2>Update Risk Assessment</h2>
      <div style={{ marginBottom: "1rem" }}>
        <label>Risk Level:</label>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          style={{ marginLeft: "1rem" }}
        >
          <option value="">Select...</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>Notes:</label>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{ width: "300px", marginLeft: "1rem" }}
        />
      </div>

      <button onClick={handleUpdate} disabled={loading}>
        {loading ? "Updating..." : "Submit"}
      </button>

      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
    </div>
  );
};

export default UpdateRiskLevel;
