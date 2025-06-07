// src/components/AnalystNav.js
import React from "react";
import { Link } from "react-router-dom";
import logo from "../images/humonitor_logo.png";

const AnalystNav = () => (
  <nav style={styles.navbar}>
    <Link to="/analystDashboard" className="d-flex align-items-center text-white text-decoration-none">
      <img src={logo} alt="Logo" style={{ height: "50px", marginRight: "10px" }} />
      <span style={styles.brand}>Analyst Dashboard</span>
    </Link>
    <ul style={styles.navLinks}>
      <li><Link style={styles.link} to="/analystDashboard">Overview</Link></li>
      <li><Link style={styles.link} to="/detailed">Detailed View</Link></li>
      <li><Link style={styles.link} to="/geo">Geo Insights</Link></li>
      <li><Link style={styles.link} to="/report">Generate Report</Link></li>
      <li><Link style={{ ...styles.link, color: "#fff0f0" }} to="/logout">Logout</Link></li>
    </ul>
  </nav>
);

const styles = {
  navbar: {
    backgroundColor: "#e57200",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1rem 2rem",
    fontFamily: "'Segoe UI', sans-serif",
  },
  brand: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "white",
  },
  navLinks: {
    display: "flex",
    gap: "1.5rem",
    listStyle: "none",
    margin: 0,
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "1rem",
    fontWeight: "500",
  },
};

export default AnalystNav;
