import React, { useState } from "react";
import { Link, Route, Routes } from "react-router-dom"; // Added Route and Routes
import logo from "../images/humonitor_logo.png";
import DeleteReport from "./deleteReport"; // Import DeleteReport component

const OrganizationNav = () => {
  const [hoverIndex, setHoverIndex] = useState(null);

  const navItems = [
    { name: "Home", href: "./" },
    { name: "About Us", href: "/about" },
    { name: "Add new Report", href: "/addReport" },
    { name: "Search", href: "./SearchPage" },
    { name: "Analytics", href: "/analytics" },
    { name: "Delete Report", href: "/deleteReport" }, // Corrected capitalization
    { name: "Logout", href: "/logout" },
  ];

  return (
    <>
      <nav style={styles.navbar}>
        <img src={logo} alt="Humonitor Logo" style={{ height: "70px" }} />
        <div style={styles.logo}>Organization Dashboard</div>
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
      </nav>
      <Routes>
        <Route path="/deleteReport" element={<DeleteReport />} /> {/* Add route */}
      </Routes>
    </>
  );
};

const styles = {
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
};

export default OrganizationNav;
