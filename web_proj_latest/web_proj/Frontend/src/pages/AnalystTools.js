// src/pages/AnalystTools.js
import React from "react";
import { useNavigate } from "react-router-dom";
// import "../css/AnalystTools.css"; // يمكنك تحسين التنسيق لاحقًا أيضًا

const AnalystTools = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>🧠 Analyst Tools</h2>
        <p style={styles.subtitle}>
          Select a function to analyze or review reports:
        </p>
        <div style={styles.buttonGroup}>
          <button
            onClick={() => navigate("/analystDashboard")}
            style={styles.button}
          >
            📊 Violation Stats
          </button>
          <button onClick={() => navigate("/detailed")} style={styles.button}>
            🔍 Detailed View
          </button>
          <button onClick={() => navigate("/geo")} style={styles.button}>
            🗺️ Geo Insights
          </button>
          <button onClick={() => navigate("/report")} style={styles.button}>
            📝 Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "80vh",
    backgroundColor: "#f3f4f6",
    padding: "2rem",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "2rem 3rem",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    textAlign: "center",
    maxWidth: "600px",
    width: "100%",
  },
  title: {
    fontSize: "2rem",
    color: "#e57200",
    marginBottom: "0.5rem",
  },
  subtitle: {
    fontSize: "1rem",
    marginBottom: "2rem",
    color: "#333",
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  button: {
    padding: "0.75rem 1rem",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

export default AnalystTools;
