import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const GeoInsights = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/analytics/geodata')
      .then(res => res.json())
      .then(setLocations);
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Geospatial Insights</h1>
      <MapContainer center={[31.9, 35.2]} zoom={7} style={{ height: '500px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {locations.map((loc, index) => {
  const coords = loc.coordinates;
  if (!coords || coords.length < 2) return null;

  return (
    <Marker key={index} position={[coords[1], coords[0]]}>
      <Popup>{loc.region}: {loc.count} cases</Popup>
    </Marker>
  );
})}

      </MapContainer>
    </div>
  );
};

export default GeoInsights;