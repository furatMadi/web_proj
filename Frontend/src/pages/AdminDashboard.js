import React, { useEffect, useState } from "react";

// import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
// import  { useEffect } from "react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    victims: 0,
    cases: 0,
    reports: 0,
  });
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [v, c, r] = await Promise.all([
          fetch("http://localhost:8000/stats/victims-count").then((res) =>
            res.json()
          ),
          fetch("http://localhost:8000/stats/cases-count").then((res) =>
            res.json()
          ),
          fetch("http://localhost:8000/stats/reports-count").then((res) =>
            res.json()
          ),
        ]);
        setStats({ victims: v.count, cases: c.count, reports: r.count });
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      {/* <Navbar /> */}
      <main style={{ padding: "2rem 3rem" }}>
        <h1 style={{ textAlign: "center" }}>Admin Dashboard</h1>

        {/* Sidebar for navigation */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "2rem",
            marginTop: "2rem",
          }}
        >
          
          

          {/* Main Content for displaying data */}
          <div style={{ width: "75%" }}>
            <h3>Overview</h3>
            <div style={{ display: "flex", gap: "2rem" }}>
              <div style={styles.card}>
                <h4>Victims</h4>
                <p>Total: {stats.victims}</p>
              </div>
              <div style={styles.card}>
                <h4>Cases</h4>
                <p>Total: {stats.cases}</p>
              </div>
              <div style={styles.card}>
                <h4>Incident Reports</h4>
                <p>Total: {stats.reports}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const styles = {
  navLink: {
    color: "#007bff",
    textDecoration: "none",
    fontSize: "1rem",
    display: "block",
  },
  card: {
    backgroundColor: "#fff",
    padding: "1rem",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    flex: "1 1 30%",
  },
  button: {
    display: "inline-block",
    padding: "0.5rem 1rem",
    backgroundColor: "#007bff",
    color: "white",
    borderRadius: "4px",
    textDecoration: "none",
    marginTop: "1rem",
  },
};

export default AdminDashboard;
