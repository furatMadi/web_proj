
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8000";

function Admin() {
  const [newReports, setNewReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch new reports
  useEffect(() => {
    fetchNewReports();
  }, []);

  const fetchNewReports = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/reports/new`);
      setNewReports(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setNewReports([]);
    } finally {
      setLoading(false);
    }
  };

  // Accept report
  const handleAccept = async (reportId) => {
    try {
      await axios.patch(`${API_BASE}/reports/review/${reportId}`, {
        status: "accepted",
        reviewed_by: "admin", // You can replace with actual admin username if available
      });
      fetchNewReports();
    } catch (err) {
      alert("Failed to accept report.");
    }
  };

  // Reject report
  const handleReject = async (reportId) => {
    try {
      await axios.patch(`${API_BASE}/reports/review/${reportId}`, {
        status: "rejected",
        reviewed_by: "admin", // You can replace with actual admin username if available
      });
      fetchNewReports();
    } catch (err) {
      alert("Failed to reject report.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🛠️ Admin Dashboard</h1>
      <p style={styles.welcome}>Welcome, Admin!</p>

      <h2 style={styles.sectionTitle}>📋 New Reports</h2>

      <div style={styles.reportList}>
        {loading ? (
          <p style={styles.loading}>Loading reports...</p>
        ) : newReports.length > 0 ? (
          newReports.map((r) => (
            <div key={r._id} style={styles.card}>
              <p><strong>Report ID:</strong> {r.report_id || r._id}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color:
                      r.status === "accepted"
                        ? "green"
                        : r.status === "rejected"
                        ? "red"
                        : "orange",
                  }}
                >
                  {r.status}
                </span>
              </p>
              <p>
                <strong>City:</strong>{" "}
                {r.incident_details?.location?.city || "N/A"}
              </p>
              <div style={styles.buttonContainer}>
                <button
                  onClick={() => handleAccept(r._id)}
                  style={{ ...styles.button, backgroundColor: "#4CAF50" }}
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(r._id)}
                  style={{ ...styles.button, backgroundColor: "#f44336" }}
                >
                  Reject
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
    gap: "0.5rem",
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

export default Admin;
