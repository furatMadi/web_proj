<<<<<<< HEAD
import React, { useEffect, useState } from "react";

function VictimDetails({ victimId }) {
  const [victim, setVictim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchVictim() {
      try {
        const response = await fetch(
          `http://localhost:8000/victims/${victimId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch victim data");
        }
        const data = await response.json();
        setVictim(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchVictim();
  }, [victimId]);

  if (loading) return <p>Loading victim details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!victim) return <p>No victim data found.</p>;

  return (
    <div>
      <h2>Victim Details</h2>
      <p>
        <strong>Type:</strong> {victim.type}
      </p>
      <p>
        <strong>Anonymous:</strong> {victim.anonymous ? "Yes" : "No"}
      </p>

      {victim.demographics && (
        <>
          <h3>Demographics</h3>
=======
import React, { useState } from "react";
import "../css/VictimDetails.css";
import { useNavigate } from "react-router-dom";

function VictimDetails() {
  const [victimId, setVictimId] = useState("");
  const [victim, setVictim] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const fetchVictim = async () => {
    setLoading(true);
    setError(null);
    setVictim(null);

    try {
      const response = await fetch(`http://localhost:8000/victims/${victimId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch victim data");
      }
      const data = await response.json();
      console.log(data);
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
        <input
          type="text"
          placeholder="Enter Victim ID"
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
>>>>>>> b2bad12aec1bf4923d9a265b246404c794c8587c
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
<<<<<<< HEAD
          {victim.demographics.residence && (
            <>
              <p>
                <strong>Residence:</strong> {victim.demographics.residence.city}
                , {victim.demographics.residence.country}
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {victim.demographics.residence.address || "N/A"}
              </p>
            </>
          )}
        </>
      )}

      {victim.contact_info && (
        <>
          <h3>Contact Info</h3>
=======

          <h4 className="section-title">Contact Info</h4>
>>>>>>> b2bad12aec1bf4923d9a265b246404c794c8587c
          <p>
            <strong>Email:</strong> {victim.contact_info.email || "N/A"}
          </p>
          <p>
            <strong>Phone:</strong> {victim.contact_info.phone || "N/A"}
          </p>
          <p>
            <strong>Secure Messaging:</strong>{" "}
            {victim.contact_info.secure_messaging || "N/A"}
          </p>
<<<<<<< HEAD
        </>
      )}

      {victim.risk_assessment && (
        <>
          <h3>Risk Assessment</h3>
=======

          <h4 className="section-title">Cases Involved</h4>
          <p>
            <strong>Cases:</strong>{" "}
            {victim.cases_involved && victim.cases_involved.length > 0
              ? victim.cases_involved.join(", ")
              : "None"}
          </p>

          {/* <h4 className="section-title">Risk Assessment</h4>
          <p><strong>Level:</strong> {victim.risk_assessment.level}</p>
          <p><strong>Threats:</strong> {victim.risk_assessment.threats.join(", ")}</p>
          <p><strong>Protection Needed:</strong> {victim.risk_assessment.protection_needed ? "Yes" : "No"}</p> */}

          <h4 className="section-title">Risk Assessment</h4>
>>>>>>> b2bad12aec1bf4923d9a265b246404c794c8587c
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
<<<<<<< HEAD
          <p>
            <strong>Notes:</strong> {victim.risk_assessment.notes || "N/A"}
          </p>
        </>
      )}

      {victim.support_services && victim.support_services.length > 0 && (
        <>
          <h3>Support Services</h3>
          <ul>
            {victim.support_services.map((service, index) => (
              <li key={index}>
                {service.type} - {service.provider || "Unknown"} (
                {service.status || "Status unknown"})
              </li>
            ))}
          </ul>
        </>
=======

          <button
            className="btn-update"
            onClick={() => navigate(`/victims/update-risk/${victim._id}`)}
          >
            Update Risk
          </button>

          <h4 className="section-title">Support Services</h4>
          {victim.support_services.length > 0 ? (
            <ul>
              {victim.support_services.map((s, i) => (
                <li key={i}>
                  {s.type} - {s.provider || "Unknown"} (
                  {s.status || "Unknown status"})
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
>>>>>>> b2bad12aec1bf4923d9a265b246404c794c8587c
      )}
    </div>
  );
}

<<<<<<< HEAD
export default VictimDetails;
=======
export default VictimDetails;
>>>>>>> b2bad12aec1bf4923d9a265b246404c794c8587c
