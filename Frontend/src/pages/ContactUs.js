import React, { useState } from "react";
import Footer from "../components/Footer";
import Navbar from "./Navbar";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send form data to an API or process it here
    alert("Message sent successfully!");
  };

  return (
    <div>
      <Navbar />
      <main style={{ padding: "2rem 3rem" }}>
        <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
          Contact Us
        </h1>

        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ color: "#f96332" }}>Our Contact Information</h3>
            <p>
              Phone: <br />
              +972 (0)2 296 04 46 <br />
              +972 (0)2 297 01 36
            </p>
            <p>
              Email: <br />
              info@addameer.ps
            </p>
          </div>

          <div>
            <h3 style={{ color: "#f96332" }}>Send Us a Message</h3>
            <form onSubmit={handleSubmit}>
              <label style={{ display: "block", marginBottom: "1rem" }}>
                Name:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    marginTop: "0.5rem",
                    fontSize: "1rem",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                  required
                />
              </label>

              <label style={{ display: "block", marginBottom: "1rem" }}>
                Email:
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    marginTop: "0.5rem",
                    fontSize: "1rem",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                  required
                />
              </label>

              <label style={{ display: "block", marginBottom: "1rem" }}>
                Message:
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    marginTop: "0.5rem",
                    fontSize: "1rem",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    height: "150px",
                  }}
                  required
                ></textarea>
              </label>

              <button
                type="submit"
                style={{
                  backgroundColor: "#e57200",
                  color: "white",
                  padding: "0.7rem 1.5rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactUs;
