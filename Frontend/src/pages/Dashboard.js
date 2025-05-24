// Dashboard.js
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();

    return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
            <button
                style={{
                    padding: "0.75rem 2rem",
                    borderRadius: "5px",
                    border: "none",
                    background: "#1976d2",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    cursor: "pointer",
                    marginTop: "1rem"
                }}
                onClick={() => navigate("/login")}
            >
                Login
            </button>
            <h1 style={{ marginTop: "2rem" }}>Dashboard</h1>
            <p>Welcome to the dashboard. Please login to continue.</p>
        </div>
    );
}
