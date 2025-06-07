import React, { useEffect, useState } from "react";
import axios from "axios";
import OrganizationNav from "./organizationBar";
import Footer from "../components/Footer";

const API_BASE = "http://localhost:8000";
const ORG_ID = "6830cdbb941edddb797abd1b";

function Organization() {
  const [reports, setReports] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [evidenceInputs, setEvidenceInputs] = useState({});

  const fetchReports = async () => {
    try {
      const res = await axios.get(`${API_BASE}/reports/`, {
        params: { assigned_to: ORG_ID, status: "accepted" }, // Only accepted reports
      });
      setReports(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch reports", err);
      setReports([]);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(`${API_BASE}/reports/analytics`);
      setAnalytics(res.data);
    } catch (err) {
      console.error("Failed to fetch analytics", err);
    }
  };

  const addEvidence = async (reportId) => {
    const { type, url, description, file } = evidenceInputs[reportId] || {};
    if (!type || (!url && !file) || !description) {
      alert("Please fill in all evidence fields.");
      return;
    }

    let evidenceUrl = url;
    // If a file is chosen, upload it and get its URL
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const uploadRes = await axios.post(`${API_BASE}/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        evidenceUrl = uploadRes.data.url;
      } catch (err) {
        alert("File upload failed.");
        return;
      }
    }

    const evidence = {
      type,
      url: evidenceUrl,
      description,
    };

    try {
      await axios.post(`${API_BASE}/reports/${reportId}/evidence`, evidence);
      fetchReports(); // Refresh reports after adding evidence
      setEvidenceInputs((prev) => ({
        ...prev,
        [reportId]: { type: "", url: "", description: "", file: null },
      }));
    } catch (err) {
      console.error("Failed to add evidence", err);
    }
  };

  const handleEvidenceInputChange = (reportId, field, value) => {
    setEvidenceInputs((prev) => ({
      ...prev,
      [reportId]: {
        ...prev[reportId],
        [field]: value,
      },
    }));
  };

  useEffect(() => {
    fetchReports();
    fetchAnalytics();
  }, []);

  return (
    <div>
      <OrganizationNav />
      <div style={{ flex: 1, padding: "1rem 2rem" }}>
        <main>
          <section
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "2rem",
              marginTop: "2rem",
            }}
          >
            {reports.map((r) => (
              <div
                key={r._id}
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
                  padding: "2rem",
                  marginBottom: "2rem",
                  minWidth: "340px",
                  maxWidth: "400px",
                  width: "100%",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  border: "1px solid #f0f0f0",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.03)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 32px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.10)";
                }}
              >
                <h3 style={{ color: "#1976d2", marginBottom: "0.5rem" }}>
                  Report ID: {r.report_id ? r.report_id : r._id}
                </h3>
                <p style={{ margin: "0.5rem 0" }}>
                  <strong>Assigned To:</strong> {r.assigned_to}
                </p>
                <p style={{ margin: "0.5rem 0" }}>
                  <strong>Legal Action:</strong>{" "}
                  {r.legal_action?.status || "None"}
                </p>
                <p style={{ margin: "0.5rem 0" }}>
                  <strong>Document:</strong>{" "}
                  {r.legal_action?.document_url ? (
                    <a
                      href={r.legal_action.document_url}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "#e57200", textDecoration: "underline" }}
                    >
                      View
                    </a>
                  ) : (
                    "N/A"
                  )}
                </p>

                <div style={{ margin: "1rem 0" }}>
                  <h4 style={{ marginBottom: "0.5rem", color: "#444" }}>
                    Evidence:
                  </h4>
                  {r.evidence && r.evidence.length > 0 ? (
                    <ul style={{ paddingLeft: "1.2rem" }}>
                      {r.evidence.map((e, idx) => (
                        <li key={idx} style={{ marginBottom: "0.5rem" }}>
                          <strong>Type:</strong> {e.type} <br />
                          <strong>URL:</strong>{" "}
                          <a
                            href={e.url}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: "#1976d2" }}
                          >
                            {e.url}
                          </a>{" "}
                          <br />
                          <strong>Description:</strong> {e.description}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ color: "#888" }}>No evidence added yet.</p>
                  )}
                </div>

                <div
                  style={{
                    background: "#f9f9f9",
                    borderRadius: "8px",
                    padding: "1rem",
                    marginTop: "1rem",
                  }}
                >
                  <h4
                    style={{ marginBottom: "0.5rem", color: "#1976d2" }}
                  >
                    Add Evidence:
                  </h4>
                  <div style={{ marginBottom: "0.5rem" }}>
                    <label>Type:</label>
                    <select
                      value={evidenceInputs[r._id]?.type || ""}
                      onChange={(e) =>
                        handleEvidenceInputChange(r._id, "type", e.target.value)
                      }
                      style={{
                        marginLeft: "0.5rem",
                        borderRadius: "4px",
                        padding: "0.25rem",
                      }}
                    >
                      <option value="">Select Type</option>
                      <option value="video">Video</option>
                      <option value="file">File</option>
                      <option value="image">Image</option>
                      <option value="text">Text</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: "0.5rem" }}>
                    <label>URL:</label>
                    <input
                      type="text"
                      value={evidenceInputs[r._id]?.url || ""}
                      onChange={(e) =>
                        handleEvidenceInputChange(r._id, "url", e.target.value)
                      }
                      placeholder="Enter URL"
                      style={{
                        marginLeft: "0.5rem",
                        width: "65%",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        padding: "0.25rem",
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: "0.5rem" }}>
                    <label>Or Choose File:</label>
                    <input
                      type="file"
                      accept="video/*,image/*,text/plain"
                      onChange={(e) =>
                        handleEvidenceInputChange(r._id, "file", e.target.files[0])
                      }
                      style={{
                        marginLeft: "0.5rem",
                        width: "65%",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        padding: "0.25rem",
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: "0.5rem" }}>
                    <label>Description:</label>
                    <input
                      type="text"
                      value={evidenceInputs[r._id]?.description || ""}
                      onChange={(e) =>
                        handleEvidenceInputChange(
                          r._id,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Enter Description"
                      style={{
                        marginLeft: "0.5rem",
                        width: "65%",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        padding: "0.25rem",
                      }}
                    />
                  </div>
                  <button
                    onClick={() => addEvidence(r._id)}
                    style={{
                      marginTop: "0.5rem",
                      background: "#1976d2",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      padding: "0.5rem 1.2rem",
                      fontWeight: "bold",
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#145ea8")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#1976d2")}
                  >
                    Add Evidence
                  </button>
                </div>
              </div>
            ))}
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default Organization;
