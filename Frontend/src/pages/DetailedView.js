import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/custom.css';
<<<<<<< HEAD
import AnalystNav from '../components/AnalystNav';
=======
// import AnalystNav from '../components/AnalystNav';
>>>>>>> b2bad12aec1bf4923d9a265b246404c794c8587c
import Footer from '../components/Footer';

const DetailedView = () => {
  const [filters, setFilters] = useState({
    start_date: '',
    end_date: '',
    region: '',
    violation_type: ''
  });

  const [violations, setViolations] = useState({});
  const [regions, setRegions] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [regionOptions, setRegionOptions] = useState([]);
  const [violationOptions, setViolationOptions] = useState([]);

  const buildQuery = () => {
    const query = new URLSearchParams();
    if (filters.start_date) query.append('start_date', filters.start_date);
    if (filters.end_date) query.append('end_date', filters.end_date);
    if (filters.region) query.append('region', filters.region.trim());
    if (filters.violation_type) query.append('violation_type', filters.violation_type.trim());
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

  const fetchOptions = () => {
    fetch(`http://localhost:8000/api/options/regions`)
      .then(res => res.json())
      .then(data => setRegionOptions(Array.isArray(data) ? data : []));

    fetch(`http://localhost:8000/api/options/violations`)
      .then(res => res.json())
      .then(data => setViolationOptions(Array.isArray(data) ? data : []));
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  useEffect(() => {
    fetchData();
    fetchOptions();
  }, []);

  return (
    <>
<<<<<<< HEAD
      <AnalystNav />
=======
      {/* <AnalystNav /> */}
>>>>>>> b2bad12aec1bf4923d9a265b246404c794c8587c
      <div className="container mt-4 text-center">
        <h1 className="mb-4">Detailed Analytics</h1>
        <form onSubmit={handleSubmit} className="row g-3 mb-5 text-start">
          <div className="col-md-3">
            <label className="form-label">Start Date</label>
            <input type="date" name="start_date" className="form-control" onChange={handleChange} value={filters.start_date} />
          </div>
          <div className="col-md-3">
            <label className="form-label">End Date</label>
            <input type="date" name="end_date" className="form-control" onChange={handleChange} value={filters.end_date} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Region</label>
            <select name="region" className="form-select" onChange={handleChange} value={filters.region}>
              <option value="">All</option>
              {regionOptions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Violation Type</label>
            <select name="violation_type" className="form-select" onChange={handleChange} value={filters.violation_type}>
              <option value="">All</option>
              {violationOptions.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary">Apply Filters</button>
          </div>
        </form>

        <div className="mb-5 d-flex justify-content-center">
          <div>
            <h2 className="h5 mb-3">Violation Types (Filtered)</h2>
            <Plot
              data={[{ type: 'pie', labels: Object.keys(violations), values: Object.values(violations) }]}
              layout={{ width: 500, height: 400 }}
            />
          </div>
        </div>

        <div className="mb-5 d-flex justify-content-center">
          <div>
            <h2 className="h5 mb-3">Cases by Region (Filtered)</h2>
            <Plot
              data={[{ type: 'bar', x: regions.map(r => r.region), y: regions.map(r => r.count) }]}
              layout={{ width: 600, height: 400 }}
            />
          </div>
        </div>

        <div className="mb-5 d-flex justify-content-center">
          <div>
            <h2 className="h5 mb-3">Cases Over Time (Filtered)</h2>
            <Plot
              data={[{ type: 'scatter', mode: 'lines+markers', x: timeline.map(t => t.date), y: timeline.map(t => t.cases) }]}
              layout={{ width: 600, height: 400 }}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DetailedView;
