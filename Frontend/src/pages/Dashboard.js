import React from "react";
<<<<<<< HEAD
import Navbar from "./Navbar";
=======
// import Navbar from "./Navbar";
>>>>>>> b2bad12aec1bf4923d9a265b246404c794c8587c
import StatCard from "./StatCard";
import NewsCard from "./NewsCard";

import detaineesImg from "../images/detainees.png";
import childrenImg from "../images/children.png";
import femalesImg from "../images/females.png";
import totalImg from "../images/total.png";
import Footer from "../components/Footer";

<<<<<<< HEAD


=======
>>>>>>> b2bad12aec1bf4923d9a265b246404c794c8587c
const statsData = [
  {
    title: "Administrative Detainees",
    number: 3577,
    imgSrc: detaineesImg,
  },
  {
    title: "Child Prisoners",
    number: 400,
    imgSrc: childrenImg,
  },
  {
    title: "Female Prisoners",
    number: 35,
    imgSrc: femalesImg,
  },
  {
    title: "Total Prisoners",
    number: 10100,
    imgSrc: totalImg,
  },
];

const newsData = [
  { date: "25-05-2025", text: "Suffering of prisoners in Gilboa jail..." },
  { date: "21-05-2025", text: "Female prisoners facing harsh conditions..." },
  { date: "20-05-2025", text: "Occupation convenes session to reconsider..." },
];

const Dashboard = () => {
  return (
    <div>
<<<<<<< HEAD
      <Navbar />
=======
      {/* <Navbar /> */}
>>>>>>> b2bad12aec1bf4923d9a265b246404c794c8587c
      <main style={{ padding: "1rem 2rem" }}>
        <section
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "1rem",
            marginTop: "2rem",
          }}
        >
          {statsData.map(({ title, number, imgSrc }) => (
            <StatCard
              key={title}
              title={title}
              number={number}
              imgSrc={imgSrc}
            />
          ))}
        </section>

        <section
          style={{
            marginTop: "3rem",
            maxWidth: "600px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <h2 style={{ color: "#e57200", marginBottom: "1rem" }}>
            Latest News
          </h2>
          {newsData.map(({ date, text }, i) => (
            <NewsCard key={i} date={date} text={text} />
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
