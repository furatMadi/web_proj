import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState , useEffect } from 'react';
import AnalystNav from '../components/AnalystNav';
import Footer from '../components/Footer';

const ReportPage = () => {
const handleGenerate = async () => {
  const form = document.querySelector("form");
  const formData = new FormData(form);
  const params = new URLSearchParams();

  for (const [key, value] of formData.entries()) {
    if (value) params.append(key, value);
  }

  try {
    const response = await fetch(`http://localhost:8000/report/generate?${params.toString()}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server responded with ${response.status}: ${errorText}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "report.xlsx"; 
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    alert("Failed to generate report. Please check the server or filters.");
    console.error("Excel Report Error:", err);
  }
};
    const [regionOptions, setRegionOptions] = useState([]);
    const [violationOptions, setViolationOptions] = useState([]);

   const fetchOptions = () => {
  fetch(`http://localhost:8000/api/options/regions`)
    .then(res => res.json())
    .then(data => {
      console.log("Region options:", data);
      setRegionOptions(Array.isArray(data) ? data : []);
    });

  fetch(`http://localhost:8000/api/options/violations`)
    .then(res => res.json())
    .then(data => {
      console.log("Violation options:", data);
      setViolationOptions(Array.isArray(data) ? data : []);
    });
};

  useEffect(() => {
    fetchOptions();
  }, []);

  return (
     <>
      <AnalystNav />
    <div className="container mt-4">
      <h1 className="mb-4">Report Generator</h1>
      <form className="row g-3 mb-4">
        <div className="col-md-3">
          <label className="form-label">Start Date</label>
          <input type="date" className="form-control" name="start" />
        </div>
        <div className="col-md-3">
          <label className="form-label">End Date</label>
          <input type="date" className="form-control" name="end" />
        </div>
        <div className="col-md-3">
          <label className="form-label">Region</label>
          <select name="region" className="form-select" >
            <option value="">All</option>
            {regionOptions.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Violation Type</label>
          <select name="violation_type" className="form-select"  >
            <option value="">All</option>
            {violationOptions.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className="col-12">
          <button type="button" className="btn btn-success" onClick={handleGenerate}>Generate Report</button>
        </div>
      </form>
    </div>
     <Footer />
  </>
  );
};

export default ReportPage;
