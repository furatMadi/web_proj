import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewCasesForAdmin = () => {
  const [cases, setCases] = useState([]);
  const [message, setMessage] = useState("");

  const fetchCases = async () => {
    try {
      const res = await axios.get("http://localhost:8000/cases/");
      setCases(res.data.filter((c) => c.status !== "archived")); // لا تعرض المؤرشفة
    } catch (err) {
      console.error("Failed to fetch cases", err);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleArchive = async (caseId) => {
    if (!window.confirm("Are you sure you want to archive this case?")) return;
    try {
      const res = await axios.delete(
        `http://localhost:8000/AdminCases/${caseId}`
      );
      setMessage(res.data.message);
      fetchCases(); // تحديث القائمة
    } catch (err) {
      setMessage(err.response?.data?.detail || "Failed to archive case");
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "30px auto", padding: "20px" }}>
      <h2>All Cases</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {cases.length === 0 ? (
        <p>No active cases found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th>Case ID</th>
              <th>Title</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => (
              <tr key={c.case_id} style={{ borderBottom: "1px solid #ccc" }}>
                <td>{c.case_id}</td>
                <td>{c.title}</td>
                <td>{c.status}</td>
                <td>
                  <button
                    style={{
                      backgroundColor: "#ff6600",
                      color: "#fff",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "5px",
                    }}
                    onClick={() => handleArchive(c.case_id)}
                  >
                    Archive
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

export default ViewCasesForAdmin;
