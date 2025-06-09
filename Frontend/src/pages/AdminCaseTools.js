// src/pages/AdminCaseTools.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../images/humonitor_logo.png";

const AdminCaseTools = () => {
  const navigate = useNavigate();
  const [hoverIndex, setHoverIndex] = useState(null);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "New Cases", href: "/admin/cases" },
    { name: "Case Analytics", href: "/analytics" },
    { name: "Logout", href: "/logout" },
  ];

  return (
    <div>
      {/* ✅ Navbar
      <nav style={styles.navbar}>
        <img src={logo} alt="Humonitor Logo" style={{ height: "70px" }} />
        <div style={styles.logo}>Humonitor Dashboard</div>
        <ul style={styles.navLinks}>
          {navItems.map((item, i) => (
            <li key={item.name}>
              <Link
                to={item.href}
                style={{
                  ...styles.navLink,
                  ...(hoverIndex === i ? styles.navLinkHover : {}),
                }}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav> */}

      {/* ✅ Main Tools Section */}
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <h2 style={styles.title}>🗂️ Case Management</h2>
          <p style={styles.subtitle}>Manage new and existing case reports:</p>
          <div style={styles.buttonGroup}>
            <button style={styles.button} onClick={() => navigate("/admin")}>
              View New Cases
            </button>

            <button
              style={styles.button}
              onClick={() => navigate("/all-cases")}
            >
              View All Report
            </button>
             <button
              style={styles.button}
              onClick={() => navigate("/AddCaseByAdmin")}
            >
              Add new Report
            </button>
            <button
              style={styles.button}
              onClick={() => navigate("/SearchPage")}
            >
              Search
            </button>

            <button
              style={styles.button}
              onClick={() => navigate("/view-cases")}
            >
              View Case to delete
            </button>

            
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  // ✅ Navbar styles
  navbar: {
    backgroundColor: "#e57200",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    color: "white",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  logo: {
    fontWeight: "bold",
    fontSize: "2.5rem",
    flexGrow: 1,
    textAlign: "center",
    marginLeft: "1rem",
    transform: "translateX(30px)",
  },
  navLinks: {
    listStyleType: "none",
    display: "flex",
    gap: "1.5rem",
    margin: 0,
    padding: 0,
  },
  navLink: {
    color: "white",
    textDecoration: "none",
    fontSize: "1.2rem",
    cursor: "pointer",
    textShadow: "0 1px 3px rgba(0,0,0,0.6)",
    transition: "text-shadow 0.3s ease",
    display: "inline-block",
  },
  navLinkHover: {
    textShadow: "0 2px 6px rgba(0,0,0,0.8)",
  },

  // ✅ Page + Card styles
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "80vh",
    backgroundColor: "#f3f4f6",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "2rem 3rem",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    textAlign: "center",
    maxWidth: "600px",
    width: "100%",
  },
  title: {
    fontSize: "2rem",
    color: "#007bff",
    marginBottom: "0.5rem",
  },
  subtitle: {
    fontSize: "1rem",
    marginBottom: "2rem",
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  button: {
    padding: "0.75rem 1rem",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    cursor: "pointer",
  },
};

export default AdminCaseTools;
