import React, { useEffect, useState } from "react";

const AllCases = () => {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/allcases")
      .then((res) => res.json())
      .then((data) => setCases(data))
      .catch((err) => console.error("Error fetching cases:", err));
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>All Reported Cases</h2>
      <div style={styles.grid}>
        {cases.map((c) => (
          <div key={c._id} style={styles.card}>
            <h3>{c.title}</h3>
            <p>
              <strong>Case ID:</strong> {c.case_id}
            </p>
            <p>
              <strong>Status:</strong> {c.status}
            </p>
            <p>
              <strong>Priority:</strong> {c.priority}
            </p>
            <p>
              <strong>Description:</strong> {c.description}
            </p>
            <p>
              <strong>Violation Types:</strong> {c.violation_types?.join(", ")}
            </p>
            <p>
              <strong>Location:</strong> {c.location?.country},{" "}
              {c.location?.region}
            </p>
            <p>
              <strong>Date Occurred:</strong> {c.date_occurred?.split("T")[0]}
            </p>
            <p>
              <strong>Date Reported:</strong> {c.date_reported?.split("T")[0]}
            </p>
            <p>
              <strong>Victims:</strong> {c.victims?.join(", ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
  },
  header: {
    textAlign: "center",
    color: "#e57200",
    marginBottom: "2rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    backgroundColor: "#fff",
    padding: "1.5rem",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    transition: "transform 0.3s ease",
    borderLeft: "6px solid #e57200",
  },
};

export default AllCases;
