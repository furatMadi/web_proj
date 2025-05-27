import React from "react";
// import addameer_logo_white from "../images/addameer_logo_white-removebg-preview.png";
import addameer_logo_white from "../images/humonitor_logo.png";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#222", // Dark background
        color: "#f96332", // Orange text color
        padding: "2rem",
        fontSize: "0.9rem",
        marginTop: "2rem",
        textAlign: "left",
        lineHeight: "1.5",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          {/* Left side */}
          <div style={{ flex: "1 1 300px", marginBottom: "1rem" }}>
            <h3 style={{ color: "#f96332" }}>Contact Us</h3>
            <p>
              Phone: <br />
              +972 (0)2 296 04 46 <br />
              +972 (0)2 297 01 36
            </p>
            <p>
              Fax: <br />
              +972 (0)2 296 04 47
            </p>
            <p>
              Email: <br />
              info@addameer.ps
            </p>
          </div>

          {/* Right side */}
          <div
            style={{
              flex: "1 1 300px",
              marginBottom: "1rem",
              textAlign: "right",
            }}
          >
            <h3 style={{ color: "#f96332" }}>Address</h3>
            <p>
              P.O. Box 17338
              <br />
              Jerusalem
            </p>
            <p>
              Ramallah Office:
              <br />
              Ramallah, Al-Rafidain Square, Musa Tawsafah Street, Sabahat
              Building, First Floor
            </p>
          </div>

          {/* Logo */}
          <div
            style={{
              flex: "1 1 200px",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            <img
              src={addameer_logo_white} // Place logo image in public/images
              alt="Addameer Logo"
              style={{ maxWidth: "150px", margin: "0 auto" }}
            />
          </div>
        </div>

        <hr style={{ borderColor: "#555", margin: "1rem 0" }} />

        <p style={{ color: "#aaa" }}>Addameer, All rights reserved ©2021</p>
      </div>
    </footer>
  );
};

export default Footer;
