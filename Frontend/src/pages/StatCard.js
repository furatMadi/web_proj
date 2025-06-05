import React from "react";

const StatCard = ({ title, number, imgSrc }) => {
  return (
    <div style={styles.card}>
      <img src={imgSrc} alt={title} style={styles.image} />

      <h3 style={styles.number}>{number}</h3>
      <p style={styles.title}>{title}</p>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgb(0 0 0 / 0.1)",
    padding: "1rem",
    textAlign: "center",
    width: "250px",
    margin: "1rem",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  image: {
    width: "90px",
    height: "90px",
    objectFit: "contain",
  },
  image1: {
    width: "70px",
    height: "70px",
    objectFit: "contain",
  },
  number: {
    color: "#e57200",
    fontSize: "2rem",
    margin: "0.5rem 0 0.2rem 0",
  },
  title: {
    fontWeight: "600",
    fontSize: "1rem",
  },
};

export default StatCard;