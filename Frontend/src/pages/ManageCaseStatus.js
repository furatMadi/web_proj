import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageCaseStatus = () => {
  const [cases, setCases] = useState([]);
  const [message, setMessage] = useState("");

  const fetchCases = async () => {
    try {
      const res = await axios.get("http://localhost:8000/cases/");
      setCases(res.data.filter((c) => c.status !== "archived"));
    } catch (err) {
      console.error("Error fetching cases:", err);
    }
  };

  const updateStatus = async (caseId, status) => {
    try {
      const res = await axios.put(`http://localhost:8000/AdminCases/${caseId}?status=${status}`);
      setMessage(res.data.message);
      fetchCases();
    } catch (err) {
      setMessage(err.response?.data?.detail || "Error updating case status");
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Manage Case Status</h2>
      {message && <p style={styles.message}>{message}</p>}
      {cases.length === 0 ? (
        <p style={styles.noCases}>No cases found.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.tableCell}>Case ID</th>
              <th style={styles.tableCell}>Title</th>
              <th style={styles.tableCell}>Status</th>
              <th style={styles.tableCell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => (
              <tr key={c.case_id} style={styles.tableRow}>
                <td style={styles.tableCell}>{c.case_id}</td>
                <td style={styles.tableCell}>{c.title}</td>
                <td style={styles.tableCell}>{c.status}</td>
                <td style={styles.tableCell}>
                  <button
                    onClick={() => updateStatus(c.case_id, "under investigation")}
                    style={{ ...styles.button, ...styles.investigationButton }}
                  >
                    Under Investigation
                  </button>
                  <button
                    onClick={() => updateStatus(c.case_id, "solved")}
                    style={{ ...styles.button, ...styles.solvedButton }}
                  >
                    Mark Solved
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "900px",
    margin: "30px auto",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
    fontSize: "1.8rem",
    fontWeight: "bold",
  },
  message: {
    color: "green",
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "1.2rem",
  },
  noCases: {
    textAlign: "center",
    color: "#666",
    fontSize: "1.2rem",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  tableHeader: {
    backgroundColor: "#007bff",
    color: "#fff",
    textAlign: "left",
  },
  tableCell: {
    padding: "10px",
    borderBottom: "1px solid #ccc",
  },
  tableRow: {
    transition: "background-color 0.3s",
  },
  tableRowHover: {
    backgroundColor: "#f0f0f0",
  },
  button: {
    padding: "5px 10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s, transform 0.2s",
  },
  investigationButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    marginRight: "5px",
  },
  solvedButton: {
    backgroundColor: "green",
    color: "#fff",
  },
};

export default ManageCaseStatus;
