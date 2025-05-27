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
        </>
      )}

      {victim.risk_assessment && (
        <>
          <h3>Risk Assessment</h3>
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
      )}
    </div>
  );
}

export default VictimDetails;
