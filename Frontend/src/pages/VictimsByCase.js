import React, { useState, useEffect } from "react";
import "../css/VictimsByCase.css";

const VictimsByCase = () => {
  const [selectedCaseId, setSelectedCaseId] = useState("");
  const [victims, setVictims] = useState([]);
  const [caseOptions, setCaseOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all cases to populate dropdown
  useEffect(() => {
    fetch("http://localhost:8000/allcases")
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((c) => ({
          id: c._id,
          title: c.title || c.case_id,
        }));
        setCaseOptions(mapped);
      })
      .catch((err) => {
        console.error("Failed to load cases", err);
        setError("Failed to load cases");
      });
  }, []);

  // Auto-fetch victims when a case is selected
  useEffect(() => {
    if (!selectedCaseId) return;
    fetchVictims(selectedCaseId);
  }, [selectedCaseId]);

  const fetchVictims = async (caseId) => {
    setLoading(true);
    setError("");
    setVictims([]);

    try {
      const res = await fetch(`http://localhost:8000/victims/case/${caseId}`);
      if (!res.ok) throw new Error("Failed to fetch victims");
      const data = await res.json();
      setVictims(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="victims-case-container" dir="ltr">
      <h2>📂 View Victims by Case</h2>

      <div className="search-box">
        <select
          value={selectedCaseId}
          onChange={(e) => setSelectedCaseId(e.target.value)}
        >
          <option value="">Select Case Title</option>
          {caseOptions.map((c, idx) => (
            <option key={idx} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>🔄 Loading victims...</p>}
      {error && <p className="error-msg">❌ {error}</p>}

      {victims.length > 0 && (
        <div className="victim-list">
          {victims.map((victim) => (
            <div key={victim._id} className="victim-card">
              <h3>🔹 Victim ID: {victim._id}</h3>
              <p>
                <strong>Type:</strong> {victim.type}
              </p>
              <p>
                <strong>Anonymous:</strong> {victim.anonymous ? "Yes" : "No"}
              </p>

              <h4>📋 Demographics</h4>
              <p>
                <strong>Age:</strong> {victim.demographics?.age}
              </p>
              <p>
                <strong>Gender:</strong> {victim.demographics?.gender}
              </p>
              <p>
                <strong>Ethnicity:</strong>{" "}
                {victim.demographics?.ethnicity || "Unknown"}
              </p>
              <p>
                <strong>Occupation:</strong>{" "}
                {victim.demographics?.occupation || "Unknown"}
              </p>

              <h4>📞 Contact Info</h4>
              <p>
                <strong>Email:</strong> {victim.contact_info?.email || "N/A"}
              </p>
              <p>
                <strong>Phone:</strong> {victim.contact_info?.phone || "N/A"}
              </p>
              <p>
                <strong>Secure Messaging:</strong>{" "}
                {victim.contact_info?.secure_messaging || "N/A"}
              </p>

              <h4>🧾 Associated Cases</h4>
              <p>{victim.cases_involved?.join(", ") || "None"}</p>

              <h4>⚠️ Risk Assessment</h4>
              <p>
                <strong>Level:</strong> {victim.risk_assessment?.level}
              </p>
              <p>
                <strong>Threats:</strong>{" "}
                {victim.risk_assessment?.threats?.join(", ") || "None"}
              </p>
              <p>
                <strong>Needs Protection:</strong>{" "}
                {victim.risk_assessment?.protection_needed ? "Yes" : "No"}
              </p>

              <h4>🛡️ Support Services</h4>
              {victim.support_services?.length > 0 ? (
                <ul>
                  {victim.support_services.map((s, idx) => (
                    <li key={idx}>
                      {s.type} - {s.provider || "Unknown"} (
                      {s.status || "Unspecified"})
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No services recorded.</p>
              )}

              <h4>⏱️ Timestamps</h4>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(victim.created_at).toLocaleString()}
              </p>
              <p>
                <strong>Last Updated:</strong>{" "}
                {new Date(victim.updated_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {!loading && !victims.length && selectedCaseId && !error && (
        <p className="no-results">🚫 No victims linked to this case.</p>
      )}
    </div>
  );
};

export default VictimsByCase;
