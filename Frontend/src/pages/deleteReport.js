import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8000";

function DeleteReport() {
  const [newReports, setNewReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewReports();
  }, []);

  const fetchNewReports = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/reports/new`);
      setNewReports(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setNewReports([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reportId) => {
    try {
      await axios.delete(`${API_BASE}/reports/${reportId}`);
      setNewReports((prev) => prev.filter((r) => r._id !== reportId));
    } catch (err) {
      alert("Failed to delete report.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🛠️ Delete New Reports</h1>

      <h2 style={styles.sectionTitle}>🗑️ New Reports (Delete)</h2>

      <div style={styles.reportList}>
        {loading ? (
          <p style={styles.loading}>Loading reports...</p>
        ) : newReports.length > 0 ? (
          newReports.map((r) => (
            <div key={r._id} style={styles.card}>
              <p><strong>Report ID:</strong> {r.report_id || r._id}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span style={{ color: "orange" }}>{r.status}</span>
              </p>
              <p>
                <strong>City:</strong>{" "}
                {r.incident_details?.location?.city || "N/A"}
              </p>
              <div style={styles.buttonContainer}>
                <button
                  onClick={() => handleDelete(r._id)}
                  style={{ ...styles.button, backgroundColor: "#f44336" }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={styles.noData}>🚫 No new reports found.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "3rem auto",
    padding: "1rem",
    fontFamily: "Segoe UI, sans-serif",
  },
  title: {
    textAlign: "center",
    fontSize: "2.5rem",
    marginBottom: "0.5rem",
    color: "#333",
  },
  welcome: {
    textAlign: "center",
    fontSize: "1.1rem",
    marginBottom: "2rem",
    color: "#555",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    marginBottom: "1rem",
    color: "#222",
    borderBottom: "2px solid #eee",
    paddingBottom: "0.5rem",
  },
  reportList: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "1rem",
  },
  card: {
    padding: "1rem",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
    border: "1px solid #f0f0f0",
  },
  noData: {
    textAlign: "center",
    color: "#999",
    fontStyle: "italic",
  },
  loading: {
    textAlign: "center",
    color: "#007bff",
    fontStyle: "italic",
  },
  buttonContainer: {
    marginTop: "1rem",
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    padding: "0.5rem 1rem",
    borderRadius: "5px",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default DeleteReport;
