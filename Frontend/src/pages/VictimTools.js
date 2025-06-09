import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/VictimTools.css";

const VictimTools = () => {
  const navigate = useNavigate();

  return (
    <div className="victim-tools-container">
      <h2>🧍 Victim Management</h2>
      <p>Select a tool to manage or search victim data:</p>

      <div className="tool-buttons">
        <button onClick={() => navigate("/victim-details")}>
          🔎 Search Victim by ID
        </button>
        <button onClick={() => navigate("/victims-by-case")}>
          📂 Victims by Case
        </button>
        <button onClick={() => navigate("/add-victim")}>
          ➕ Add New Victim
        </button>
        <button onClick={() => navigate("/risk-trends")}>
          📈 Risk Trend Visualization
        </button>
        <button onClick={() => navigate("/victim-risk-history")}>
          📝 Risk Assessment History
        </button>
      </div>
    </div>
  );
};

export default VictimTools;
