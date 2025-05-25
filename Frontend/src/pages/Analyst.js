import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const Analyst = () => {
  const [violations, setViolations] = useState({});
  const [regions, setRegions] = useState([]);
  const [timeline, setTimeline] = useState([]);

  const [filters, setFilters] = useState({
    start_date: '',
    end_date: '',
    region: '',
    violation_type: ''
  });

  const buildQuery = () => {
    const query = new URLSearchParams();
    if (filters.start_date) query.append('start_date', filters.start_date);
    if (filters.end_date) query.append('end_date', filters.end_date);
    if (filters.region) query.append('region', filters.region);
    if (filters.violation_type) query.append('violation_type', filters.violation_type);
    return query.toString();
  };

  const fetchData = () => {
    const query = buildQuery();

    fetch(`http://localhost:8000/analytics/violations?${query}`)
      .then(res => res.json())
      .then(setViolations);

    fetch(`http://localhost:8000/analytics/geodata?${query}`)
      .then(res => res.json())
      .then(setRegions);

    fetch(`http://localhost:8000/analytics/timeline?${query}`)
      .then(res => res.json())
      .then(setTimeline);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div style={{ padding: '20px' }}>
      <form onSubmit={handleSubmit}>
        <label>Start Date: <input type="date" name="start_date" onChange={handleChange} /></label>
        <label>End Date: <input type="date" name="end_date" onChange={handleChange} /></label>
        <label>Region: <input type="text" name="region" onChange={handleChange} placeholder="e.g. Ramallah" /></label>
        <label>Violation Type: <input type="text" name="violation_type" onChange={handleChange} placeholder="e.g. arbitrary_detention" /></label>
        <button type="submit">Apply Filters</button>
      </form>

      <h2>Violation Types (Pie)</h2>
      <Plot
        data={[{
          type: 'pie',
          labels: Object.keys(violations),
          values: Object.values(violations),
        }]}
        layout={{ width: 500, height: 400 }}
      />

      <h2>Cases by Region (Bar)</h2>
      <Plot
        data={[{
          type: 'bar',
          x: regions.map(r => r.region),
          y: regions.map(r => r.count),
        }]}
        layout={{ width: 600, height: 400 }}
      />

      <h2>Cases Over Time (Line)</h2>
      <Plot
        data={[{
          type: 'scatter',
          mode: 'lines+markers',
          x: timeline.map(t => t.date),
          y: timeline.map(t => t.cases),
        }]}
        layout={{ width: 600, height: 400 }}
      />
    </div>
  );
};

export default Analyst;
