import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { Link } from 'react-router-dom';
import AnalystNav from '../components/AnalystNav';
import Footer from '../components/Footer';

const AnalystDashboard = () => {
  const [violations, setViolations] = useState({});
  const [regions, setRegions] = useState([]);
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/analytics/violations')
      .then(res => res.json())
      .then(setViolations);

    fetch('http://localhost:8000/analytics/geodata')
      .then(res => res.json())
      .then(setRegions);

    fetch('http://localhost:8000/analytics/timeline')
      .then(res => res.json())
      .then(setTimeline);
  }, []);

  return (
    <>
      <AnalystNav />
      <div className="container mt-4 text-center">
        <header className="mb-5">
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-muted">
            This dashboard presents real-time analytics of violations committed against Palestinian prisoners in Israeli jails.
          </p>
        </header>

        <div className="row justify-content-center mb-4">
          <div className="col-md-6 bg-white rounded shadow p-4">
            <h2 className="text-lg font-semibold mb-3">Distribution of Violation Types</h2>
            <p className="text-secondary">This pie chart shows the proportion of each violation type reported.</p>
            <Plot
              data={[{
                type: 'pie',
                labels: Object.keys(violations),
                values: Object.values(violations),
                textinfo: 'label+percent',
                hoverinfo: 'label+value'
              }]}
              layout={{ width: 450, height: 350, margin: { t: 20, b: 20 } }}
            />
          </div>
        </div>

        <div className="row justify-content-center mb-4">
          <div className="col-md-6 bg-white rounded shadow p-4">
            <h2 className="text-lg font-semibold mb-3">Cases by Region</h2>
            <p className="text-secondary">This bar chart shows the number of cases reported per region.</p>
            <Plot
              data={[{
                type: 'bar',
                x: regions.map(r => r.region),
                y: regions.map(r => r.count),
                marker: { color: 'orange' }
              }]}
              layout={{ width: 450, height: 350, margin: { t: 20, b: 60 }, xaxis: { tickangle: -45 } }}
            />
          </div>
        </div>

        <div className="row justify-content-center mb-5">
          <div className="col-md-10 bg-white rounded shadow p-4">
            <h2 className="text-lg font-semibold mb-3">Violation Trends Over Time</h2>
            <p className="text-secondary">This line graph illustrates the monthly number of reported cases over time.</p>
            <Plot
              data={[{
                type: 'scatter',
                mode: 'lines+markers',
                x: timeline.map(t => t.date),
                y: timeline.map(t => t.cases),
                line: { color: 'tomato' }
              }]}
              layout={{ width: 850, height: 400, margin: { t: 20, b: 40 } }}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AnalystDashboard;
