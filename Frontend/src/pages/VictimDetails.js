import React, { useState, useEffect } from "react";
import "../css/VictimDetails.css";
import { useNavigate } from "react-router-dom";

function VictimDetails() {
  const [victimId, setVictimId] = useState("");
  const [victim, setVictim] = useState(null);
  const [victimList, setVictimList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // ✅ Load victim list on mount
  useEffect(() => {
    const fetchVictimList = async () => {
      try {
        const res = await fetch("http://localhost:8000/victims-list");
        const data = await res.json();
        setVictimList(data); // expected: array of {_id, type}
      } catch (err) {
        console.error("Failed to fetch victim list:", err);
      }
    };
    fetchVictimList();
  }, []);

  const fetchVictim = async () => {
    setLoading(true);
    setError(null);
    setVictim(null);

    try {
      const response = await fetch(`http://localhost:8000/victims/${victimId}`);
      if (!response.ok) throw new Error("Failed to fetch victim data");
      const data = await response.json();
      setVictim(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="victim-container">
      <h2>🔍 Search Victim by ID</h2>
      <div className="search-box">
        <select
          value={victimId}
          onChange={(e) => setVictimId(e.target.value)}
          style={{ padding: "8px", marginRight: "10px" }}
        >
          <option value="">-- Select Victim ID --</option>
          {Array.isArray(victimList) &&
            victimList.map((v) => (
              <option key={v._id} value={v._id}>
                {v._id} ({v.type})
              </option>
            ))}
        </select>

        <input
          type="text"
          placeholder="Or enter Victim ID manually"
          value={victimId}
          onChange={(e) => setVictimId(e.target.value)}
        />

        <button onClick={fetchVictim}>Search</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error-msg">Error: {error}</p>}

      {victim && (
        <div className="victim-card">
          <h3 className="section-title">Victim Details</h3>
          <p>
            <strong>Type:</strong> {victim.type}
          </p>
          <p>
            <strong>Anonymous:</strong> {victim.anonymous ? "Yes" : "No"}
          </p>

          <h4 className="section-title">Demographics</h4>
          <p>
            <strong>Gender:</strong> {victim.demographics.gender}
          </p>
          <p>
            <strong>Age:</strong> {victim.demographics.age}
          </p>
          <p>
            <strong>Ethnicity:</strong> {victim.demographics.ethnicity || "N/A"}
          </p>
          <p>
            <strong>Occupation:</strong>{" "}
            {victim.demographics.occupation || "N/A"}
          </p>

          <h4 className="section-title">Contact Info</h4>
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

          <h4 className="section-title">Cases Involved</h4>
          <p>
            <strong>Cases:</strong>{" "}
            {victim.cases_involved?.join(", ") || "None"}
          </p>

          <h4 className="section-title">Risk Assessment</h4>
          <p>
            <strong>Level:</strong> {victim.risk_assessment.level}
          </p>
          <p>
            <strong>Threats:</strong>{" "}
            {victim.risk_assessment.threats.join(", ")}
          </p>
          <p>
            <strong>Protection Needed:</strong>{" "}
            {victim.risk_assessment.protection_needed ? "Yes" : "No"}
          </p>

          <button
            className="btn-update"
            onClick={() => navigate(`/victims/update-risk/${victim._id}`)}
          >
            Update Risk
          </button>

          <h4 className="section-title">Support Services</h4>
          {victim.support_services?.length > 0 ? (
            <ul>
              {victim.support_services.map((s, i) => (
                <li key={i}>
                  {s.type} - {s.provider || "Unknown"} ({s.status || "Unknown"})
                </li>
              ))}
            </ul>
          ) : (
            <p>No support services recorded.</p>
          )}

          <h4 className="section-title">Timestamps</h4>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(victim.created_at).toLocaleString()}
          </p>
          <p>
            <strong>Updated At:</strong>{" "}
            {new Date(victim.updated_at).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}

export default VictimDetails;
