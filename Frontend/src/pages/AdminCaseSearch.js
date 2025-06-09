import React, { useState } from "react";
import axios from "axios";

const AdminCaseSearch = () => {
  const [filters, setFilters] = useState({
    case_id: "",
    title: "",
    status: "",
    priority: "",
    region: "",
    from_date: "",
    to_date: "",
  });

  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      case_id: "",
      title: "",
      status: "",
      priority: "",
      region: "",
      from_date: "",
      to_date: "",
    });
    setResults([]);
    setMessage("");
  };

  const handleSearch = async () => {
    if (
      filters.from_date &&
      filters.to_date &&
      filters.from_date > filters.to_date
    ) {
      setMessage("❌ Date From cannot be after Date To");
      setResults([]);
      return;
    }

    try {
      const query = Object.entries(filters)
        .filter(([_, v]) => v)
        .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
        .join("&");

      const res = await axios.get(
        `http://localhost:8000/AdminCases/search?${query}`
      );
      setResults(res.data);
      setMessage(res.data.length ? "" : "No cases found.");
    } catch (err) {
      setMessage("Error fetching results.");
    }
  };

  const formGroup = {
    display: "flex",
    flexDirection: "column",
    marginBottom: "15px",
  };
  const label = { fontWeight: "bold", marginBottom: "5px" };
  const input = {
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  };

  return (
    <div style={{ maxWidth: "850px", margin: "auto", padding: "25px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        🔍 Admin Case Search
      </h2>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
      >
        <div style={formGroup}>
          <label style={label}>Case ID:</label>
          <input
            style={input}
            name="case_id"
            value={filters.case_id}
            onChange={handleChange}
          />
        </div>

        <div style={formGroup}>
          <label style={label}>Title:</label>
          <input
            style={input}
            name="title"
            value={filters.title}
            onChange={handleChange}
          />
        </div>

        <div style={formGroup}>
          <label style={label}>Status:</label>
          <select
            style={input}
            name="status"
            value={filters.status}
            onChange={handleChange}
          >
            <option value="">-- Any --</option>
            <option value="new">New</option>
            <option value="accepted">Accepted</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div style={formGroup}>
          <label style={label}>Priority:</label>
          <select
            style={input}
            name="priority"
            value={filters.priority}
            onChange={handleChange}
          >
            <option value="">-- Any --</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div style={formGroup}>
          <label style={label}>Region:</label>
          <input
            style={input}
            name="region"
            value={filters.region}
            onChange={handleChange}
          />
        </div>

        <div style={formGroup}>
          <label style={label}>Date From:</label>
          <input
            style={input}
            type="date"
            name="from_date"
            value={filters.from_date}
            onChange={handleChange}
          />
        </div>

        <div style={formGroup}>
          <label style={label}>Date To:</label>
          <input
            style={input}
            type="date"
            name="to_date"
            value={filters.to_date}
            onChange={handleChange}
          />
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={handleSearch}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: "#007bff",
            color: "#fff",
            borderRadius: "5px",
          }}
        >
          Search
        </button>
        <button
          onClick={resetFilters}
          style={{
            padding: "10px 20px",
            backgroundColor: "#6c757d",
            color: "#fff",
            borderRadius: "5px",
          }}
        >
          Reset
        </button>
      </div>

      <hr style={{ margin: "30px 0" }} />

      {message && <p style={{ color: "red", fontWeight: "bold" }}>{message}</p>}

      {results.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th style={{ padding: "8px", border: "1px solid #ccc" }}>
                Case ID
              </th>
              <th style={{ padding: "8px", border: "1px solid #ccc" }}>
                Title
              </th>
              <th style={{ padding: "8px", border: "1px solid #ccc" }}>
                Status
              </th>
              <th style={{ padding: "8px", border: "1px solid #ccc" }}>
                Priority
              </th>
              <th style={{ padding: "8px", border: "1px solid #ccc" }}>
                Region
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map((c) => (
              <tr key={c.case_id}>
                <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                  {c.case_id}
                </td>
                <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                  {c.title}
                </td>
                <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                  {c.status}
                </td>
                <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                  {c.priority}
                </td>
                <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                  {c.location?.region}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminCaseSearch;
