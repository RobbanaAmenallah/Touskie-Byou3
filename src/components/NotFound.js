import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>404 - Page Not Found</h1>
      <p style={styles.message}>
        Désolé, la page que vous cherchez n'existe pas et Na9es bla Tbarbich.
      </p>
      <Link to="/" style={styles.link}>
        Retour à l'accueil
      </Link>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    textAlign: "center",
    backgroundColor: "#f8f9fa",
    color: "#343a40",
  },
  header: {
    fontSize: "4rem",
    fontWeight: "bold",
  },
  message: {
    fontSize: "1.5rem",
  },
  link: {
    fontSize: "1.25rem",
    color: "#007bff",
    textDecoration: "none",
    marginTop: "20px",
  },
};

export default NotFound;
