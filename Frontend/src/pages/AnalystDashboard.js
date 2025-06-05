import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { Link } from 'react-router-dom';

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
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-6">Analyst Panel</h2>
          <nav className="space-y-2">
            <Link to="/analystDashboard" className="block text-blue-700 font-medium">Dashboard</Link>
            <Link to="/detailed" className="block text-gray-700 hover:text-blue-600">Detailed View</Link>
            <Link to="/geo" className="block text-gray-700 hover:text-blue-600">Geo Insights</Link>
            <Link to="/report" className="block text-gray-700 hover:text-blue-600">Generate Report</Link>
          </nav>
        </div>
        <footer className="text-sm text-gray-500">
          <p>© 2025 Human Rights MIS</p>
        </footer>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Logout
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Violation Types</h2>
            <Plot
              data={[{ type: 'pie', labels: Object.keys(violations), values: Object.values(violations) }]}
              layout={{ width: 400, height: 300, margin: { t: 0, b: 0 } }}
            />
          </div>

          <div className="bg-white rounded shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Cases by Region</h2>
            <Plot
              data={[{ type: 'bar', x: regions.map(r => r.region), y: regions.map(r => r.count) }]}
              layout={{ width: 400, height: 300, margin: { t: 0, b: 30 } }}
            />
          </div>

          <div className="bg-white rounded shadow p-4 col-span-full">
            <h2 className="text-lg font-semibold mb-2">Cases Over Time</h2>
            <Plot
              data={[{ type: 'scatter', mode: 'lines+markers', x: timeline.map(t => t.date), y: timeline.map(t => t.cases) }]}
              layout={{ width: 850, height: 300 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalystDashboard;
