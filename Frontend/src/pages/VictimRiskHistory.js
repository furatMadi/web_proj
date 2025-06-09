import React, { useState, useEffect } from "react";
import "../css/VictimRiskHistory.css";

const VictimRiskHistory = () => {
  const [victimId, setVictimId] = useState("");
  const [victimList, setVictimList] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVictimList = async () => {
      try {
        const res = await fetch(
          "http://localhost:8000/risk-assessments/victims/list"
        );
        const data = await res.json();
        setVictimList(data);
      } catch (err) {
        console.error("Error fetching victim list:", err);
      }
    };

    fetchVictimList();
  }, []);

  // جلب تقييمات الخطر عند اختيار ضحية
  const fetchAssessments = async () => {
    if (!victimId) return;
    setLoading(true);
    setError("");
    setAssessments([]);

    try {
      const res = await fetch(
        `http://localhost:8000/risk-assessments/${victimId}`
      );
      if (!res.ok) throw new Error("Failed to fetch risk assessments");
      const data = await res.json();
      setAssessments(data);
    } catch (err) {
      console.log(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="risk-history-container">
      <h2>📋 Victim Risk Assessment History</h2>

      <div className="search-box">
        <select value={victimId} onChange={(e) => setVictimId(e.target.value)}>
          <option value="">-- Select Victim --</option>
          {victimList.map((v) => (
            <option key={v._id} value={v._id}>
              {v._id} - {v.type}
            </option>
          ))}
        </select>
        <button onClick={fetchAssessments} disabled={!victimId}>
          Search
        </button>
      </div>

      {loading && <p>Loading assessments...</p>}
      {error && <p className="error-msg">{error}</p>}

      {assessments.length > 0 && (
        <div className="assessment-list">
          {assessments.map((a, i) => (
            <div className="assessment-card" key={i}>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(a.assessment_date).toLocaleString()}
              </p>
              <p>
                <strong>Level:</strong> {a.risk_level}
              </p>
              <p>
                <strong>Threats:</strong> {a.threats?.join(", ") || "N/A"}
              </p>
              <p>
                <strong>Protection Needed:</strong>{" "}
                {a.protection_needed ? "Yes" : "No"}
              </p>
              <p>
                <strong>Assessed By:</strong> {a.assessed_by}
              </p>
              <p>
                <strong>Notes:</strong> {a.notes}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VictimRiskHistory;
