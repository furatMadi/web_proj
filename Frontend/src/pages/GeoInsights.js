import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import L from 'leaflet';
import AnalystNav from '../components/AnalystNav';
import Footer from '../components/Footer';

const GeoInsights = () => {
  const [locations, setLocations] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [violationType, setViolationType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [violationOptions, setViolationOptions] = useState([]);
  const mapRef = useRef();

  useEffect(() => {
    fetch('http://localhost:8000/analytics/geodata')
      .then(res => res.json())
      .then(setLocations);

    fetch('http://localhost:8000/api/options/violations')
      .then(res => res.json())
      .then(setViolationOptions);
  }, []);

  const handleExport = async () => {
    if (!selectedRegion) {
      alert("Please click a region on the map before generating the report.");
      return;
    }

    const params = new URLSearchParams();
    if (startDate) params.append("start", startDate);
    if (endDate) params.append("end", endDate);
    if (selectedRegion) params.append("region", selectedRegion);
    if (violationType) params.append("violation_type", violationType);

    try {
      const response = await fetch(`http://localhost:8000/report/generate?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to generate report");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "region_report.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Error generating report");
      console.error(error);
    }
  };

  const handleReset = () => {
    setSelectedRegion('');
    mapRef.current?.setView([31.9, 35.2], 7);
  };

  const defaultIcon = new L.Icon.Default();
  const selectedIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x-green.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
    shadowSize: [41, 41]
  });

  return (
    <>
      <AnalystNav />
      <div className="container mt-4">
        <h1 className="mb-4">Geospatial Insights</h1>

        <div className="alert alert-info">
          Click a region marker on the map to select it for report generation.
        </div>

        <form className="row g-3 mb-4">
          <div className="col-md-4">
            <label className="form-label">Violation Type</label>
            <select className="form-select" value={violationType} onChange={e => setViolationType(e.target.value)}>
              <option value="All">All</option>
              {violationOptions.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Start Date</label>
            <input type="date" className="form-control" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div className="col-md-4">
            <label className="form-label">End Date</label>
            <input type="date" className="form-control" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
          <div className="col-12 d-flex gap-2">
            <button type="button" className="btn btn-success" onClick={handleExport}>Export Report</button>
            <button type="button" className="btn btn-secondary" onClick={handleReset}>Reset</button>
          </div>
        </form>

        <MapContainer center={[31.9, 35.2]} zoom={7} style={{ height: '500px', width: '100%' }} whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {locations.map((loc, index) => {
            const coords = loc.coordinates;
            if (!coords || coords.length < 2) return null;

            const isSelected = selectedRegion === loc.region;

            return (
              <Marker
                key={index}
                position={[coords[1], coords[0]]}
                icon={isSelected ? selectedIcon : defaultIcon}
                eventHandlers={{
                  click: () => {
                    setSelectedRegion(loc.region);
                    console.log("Selected region:", loc.region);
                    mapRef.current?.setView([coords[1], coords[0]], 10);
                  }
                }}
              >
                <Popup>
                  <strong>{loc.region}</strong>: {loc.count} cases
                  {isSelected && <div className="text-success mt-1">(Selected)</div>}
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {selectedRegion && (
          <div className="alert alert-success mt-3">
            Selected Region: <strong>{selectedRegion}</strong>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default GeoInsights;
