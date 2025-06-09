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
  const [victimList, setVictimList] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(false);


  // ✅ Fetch list of all victim IDs on load
  useEffect(() => {
  const fetchVictims = async () => {
    try {
      const res = await fetch("http://localhost:8000/risk-assessments/victims/list");
      const data = await res.json();
      setVictimList(data);
    } catch (err) {
      console.error("Error fetching victim list:", err);
    }
  };

  fetchVictims();
}, []);


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
        {/* قائمة الضحايا للاختيار */}
        <select
          value={victimId}
          onChange={(e) => setVictimId(e.target.value)}
          style={{ padding: "8px", marginRight: "10px" }}
        >
          <option value="">-- Select Victim ID --</option>
          {victimList.map((v) => (
            <option key={v._id} value={v._id}>
              {v._id} ({v.type})
            </option>
          ))}
        </select>



        {/* أو إدخال يدوي */}
        <input
          type="text"
          placeholder="Or enter Victim ID manually"
          value={victimId}
          onChange={(e) => setVictimId(e.target.value)}
        />

        <button
          onClick={fetchData}
          style={{ marginLeft: "10px", padding: "8px 16px" }}
        >
          Fetch Trend
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {assessments.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={assessments}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis
              domain={[0, 3]}
              ticks={[1, 2, 3]}
              tickFormatter={(v) => ["", "Low", "Medium", "High"][v]}
            />
            <Tooltip
              formatter={(value) =>
                ["", "Low", "Medium", "High"][value] || value
              }
            />
            <Line
              type="monotone"
              dataKey="level"
              stroke="#8884d8"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        !loading && <p>No risk assessments found for this victim.</p>
      )}
    </div>
  );
};

export default RiskTrends;
