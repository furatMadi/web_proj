import React from "react";

const NewsCard = ({ date, text }) => {
  return (
    <div style={styles.card}>
      <p style={styles.date}>{date}</p>
      <p style={styles.text}>{text}</p>
    </div>
  );
};

const styles = {
  card: {
    borderBottom: "1px solid #ddd",
    padding: "1rem 0",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  date: {
    fontWeight: "bold",
    color: "#e57200",
    marginBottom: "0.5rem",
  },
  text: {
    fontSize: "1rem",
    color: "#333",
  },
};

export default NewsCard;
