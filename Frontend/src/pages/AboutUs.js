import React from "react";
<<<<<<< HEAD
import Navbar from "./Navbar"; // تأكد من المسار الصحيح
=======
// import Navbar from "./Navbar"; // تأكد من المسار الصحيح
>>>>>>> b2bad12aec1bf4923d9a265b246404c794c8587c
import Footer from "../components/Footer"; // تأكد من المسار الصحيح

const AboutUs = () => {
  return (
    <div>
<<<<<<< HEAD
      <Navbar />
=======
      {/* <Navbar /> */}
>>>>>>> b2bad12aec1bf4923d9a265b246404c794c8587c
      <main style={{ padding: "3rem 2rem" }}>
        <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>About Us</h1>

        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <section style={{ marginBottom: "2rem" }}>
            <h2 style={{ color: "#e57200" }}>Who We Are</h2>
            <p>
              We are a non-profit organization dedicated to protecting human
              rights and raising awareness about the challenges faced by people
              around the world. Our team works tirelessly to support the victims
              of human rights violations and provide them with a voice. We are
              committed to creating a more just and equal society.
            </p>
          </section>

          <section style={{ marginBottom: "2rem" }}>
            <h2 style={{ color: "#e57200" }}>Our Mission</h2>
            <p>
              Our mission is to advocate for human rights, raise awareness, and
              provide support to individuals and communities suffering from
              injustice. Through our efforts, we aim to create systemic change
              and ensure justice for all.
            </p>
          </section>

          <section style={{ marginBottom: "2rem" }}>
            <h2 style={{ color: "#e57200" }}>Our Team</h2>
            <p>
              Our team consists of dedicated individuals from diverse
              backgrounds who are passionate about human rights. Together, we
              work to address the most pressing issues and bring about
              meaningful change.
            </p>
            <div
              style={{ display: "flex", justifyContent: "center", gap: "2rem" }}
            >
              <div>
                <img
                  src="team_member_1.jpg" // ضع المسار الصحيح للصورة
                  alt="Team Member 1"
                  style={{
                    width: "150px",
                    borderRadius: "50%",
                    marginBottom: "1rem",
                  }}
                />
                <h4>Aya Hammad</h4>
                <p>Human Rights Admin</p>
              </div>
              <div>
                <img
                  src="teamImages/me.jpg" 
                  alt="Team Member 2"
                  style={{
                    width: "150px",
                    borderRadius: "50%",
                    marginBottom: "1rem",
                  }}
                />
                <h4>Leen Odeh</h4>
                <p>Human right organizor</p>
              </div>
              <div>
                <img
                  src="team_member_2.jpg" 
                  alt="Team Member 2"
                  style={{
                    width: "150px",
                    borderRadius: "50%",
                    marginBottom: "1rem",
                  }}
                />
                <h4>Furat Madi</h4>
                <p>Human right Analyzer</p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;