import React, { useState, useEffect } from "react";
// import Navbar from "./Navbar";
import Footer from "../components/Footer";
import axios from "axios";

const API_BASE = "http://localhost:8000";

const SearchPage = () => {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [results, setResults] = useState([]);

  // Fetch all unique cities on mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await axios.get(`${API_BASE}/reports/`);
        const reports = Array.isArray(res.data) ? res.data : [];
        // Extract unique city names
        const citySet = new Set();
        reports.forEach((r) => {
          const city = r.incident_details?.location?.city;
          if (city) citySet.add(city);
        });
        setCities(Array.from(citySet));
      } catch (err) {
        setCities([]);
      }
    };
    fetchCities();
  }, []);

  // Fetch reports for selected city
  const handleCityChange = async (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    if (!city) {
      setResults([]);
      return;
    }
    try {
      const res = await axios.get(`${API_BASE}/reports/`, {
        params: { assigned_to: undefined, status: undefined }, // ensure no other filters
      });
      const reports = Array.isArray(res.data) ? res.data : [];
      // Filter client-side for exact city match
      const filtered = reports.filter(
        (r) => r.incident_details?.location?.city === city
      );
      setResults(filtered);
    } catch (err) {
      setResults([]);
    }
  };

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      {/* <Navbar /> */}
      <main
        style={{
          flexGrow: 1,
          padding: "2rem",
          maxWidth: "900px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <h1 style={{ marginBottom: "1rem", textAlign: "center" }}>
          Search and Filter Data
        </h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <label
            htmlFor="city-select"
            style={{ fontWeight: "bold" }}
          >
            Location:
          </label>
          <select
            id="city-select"
            value={selectedCity}
            onChange={handleCityChange}
            style={{
              padding: "0.5rem",
              borderRadius: "4px",
              minWidth: "180px",
            }}
          >
            <option value="">Select a city</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
    {/* Display filtered results */}
<div style={{ marginTop: "2rem" }}>
  {results.length > 0 ? (
    <ul>
      {results.map((r) => (
        <li key={r._id} style={{ marginBottom: "1rem" }}>
          {/* ─── Top-level fields ─────────────────────────────── */}
          <strong>Report ID:</strong> {r.report_id || r._id}<br />
          <strong>Reporter Type:</strong> {r.reporter_type || "N/A"}<br />
          <strong>Anonymous?:</strong> {r.anonymous ? "Yes" : "No"}<br />

          {/* ─── Incident details  */}
          <strong>Date:</strong>{" "}
          {r.incident_details?.date
            ? new Date(r.incident_details.date).toLocaleString()
            : "N/A"}<br />

          {/* ─── Location (only if  anonymous) ─────────────── */}
          {r.anonymous && (
            <>
              <strong>City:</strong> {r.incident_details?.location?.city || "N/A"}<br />
              <strong>Address:</strong> {r.incident_details?.location?.address || "N/A"}<br />
              <strong>State:</strong> {r.incident_details?.location?.state || "N/A"}<br />
              <strong>ZIP:</strong> {r.incident_details?.location?.zip || "N/A"}<br />
            </>
          )}

          {/* ─── Description & violations ─────────────────────── */}
          <strong>Description:</strong> {r.incident_details?.description || "N/A"}<br />
          <strong>Violation Types:</strong>{" "}
          {r.incident_details?.violation_types?.length
            ? r.incident_details.violation_types.join(", ")
            : "N/A"}<br />

          {/* ─── Evidence array ──────────────────────────────── */}
          {r.evidence?.length ? (
            <>
              <strong>Evidence:</strong>
              <ul style={{ marginTop: ".25rem" }}>
                {r.evidence.map((ev, idx) => (
                  <li key={idx}>
                    {ev.type ?? "file"} –{" "}
                    {ev.url ? (
                      <a href={ev.url} target="_blank" rel="noopener noreferrer">
                        {ev.description || ev.url}
                      </a>
                    ) : (
                      ev.description || "N/A"
                    )}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <strong>Evidence:</strong> N/A
            </>
          )}
        </li>
      ))}
    </ul>
  ) : (
    <p style={{ color: "#888" }}>No results found.</p>
  )}
</div>


      </main>
      <Footer />
    </div>
  );
};

export default SearchPage;