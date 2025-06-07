// src/pages/RiskTrends.js
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const levelMap = {
  low: 1,
  medium: 2,
  high: 3,
};

const RiskTrends = () => {
  const [victimId, setVictimId] = useState("");
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!victimId) return;
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/risk-assessments/${victimId}`
      );
      const data = await res.json();

      const formatted = data.map((item) => ({
        date: new Date(item.assessment_date).toLocaleDateString(),
        level: levelMap[item.risk_level.toLowerCase()] || 0,
      }));

      setAssessments(formatted);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>📈 Risk Level Trend</h2>
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Enter Victim ID"
          value={victimId}
          onChange={(e) => setVictimId(e.target.value)}
        />
        <button onClick={fetchData} style={{ marginLeft: "10px" }}>
          Fetch Trend
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {assessments.length > 0 && (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={assessments}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis
              domain={[0, 3]}
              ticks={[1, 2, 3]}
              tickFormatter={(v) => ["", "Low", "Medium", "High"][v]}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="level"
              stroke="#8884d8"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default RiskTrends;
