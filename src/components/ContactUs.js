import React, { useState } from "react";
import axios from "axios";
import logo from "../assets/images/Logo.png"; // Import the logo image

import {
  FaUser,
  FaEnvelope,
  FaPencilAlt,
  FaRegCommentDots,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    object: "",
    details: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle form input change
  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:4000/contactus/create",
        formData
      );
      setSuccess(response.data.message);
      setFormData({
        firstname: "",
        lastname: "",
        email: "",
        object: "",
        details: "",
      });
    } catch (error) {
      setError("Erreur lors de l'envoi du message.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.contactBox}>
        {/* Left Section: Contact Info */}
        <div style={styles.contactInfo}>
          <img
            src={logo} // Use the logo image
            alt="Touskié-Informatique"
            style={{
              width: "200px",
              height: "auto",
              display: "block", // Ensures the image is treated as a block for centering
              margin: "0 auto", // Centers the image horizontally
            }}
          />

          <br />
          <br />

          <h2 style={styles.contactHeading}>Nous contacter</h2>
          <p style={styles.info}>
            <FaMapMarkerAlt style={styles.icon} /> 2096 Nouvelle Médina, Ben
            Arous
          </p>
          <p style={styles.info}>
            <FaPhone style={styles.icon} /> +216 95 612 913
          </p>
          <p style={styles.info}>
            <FaEnvelope style={styles.icon} /> TouskiéInformatique@gmail.com
          </p>
        </div>

        {/* Right Section: Contact Form */}
        <div style={styles.formBox}>
          <h1 style={styles.heading}>Contactez-Nous</h1>
          <form style={styles.form} onSubmit={handleSubmit}>
            <div style={styles.inputContainer}>
              <FaUser style={styles.icon} />
              <input
                style={styles.input}
                type="text"
                name="firstname"
                placeholder="Prénom"
                value={formData.firstname}
                onChange={handleChange}
              />
            </div>
            <div style={styles.inputContainer}>
              <FaUser style={styles.icon} />
              <input
                style={styles.input}
                type="text"
                name="lastname"
                placeholder="Nom"
                value={formData.lastname}
                onChange={handleChange}
              />
            </div>
            <div style={styles.inputContainer}>
              <FaEnvelope style={styles.icon} />
              <input
                style={styles.input}
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div style={styles.inputContainer}>
              <FaPencilAlt style={styles.icon} />
              <input
                style={styles.input}
                type="text"
                name="object"
                placeholder="Objet"
                value={formData.object}
                onChange={handleChange}
              />
            </div>
            <div style={styles.inputContainer}>
              <FaRegCommentDots style={styles.icon} />
              <textarea
                style={styles.textarea}
                name="details"
                placeholder="Message"
                value={formData.details}
                onChange={handleChange}
              />
            </div>
            <button style={styles.button} type="submit">
              Envoyer
            </button>
            {success && <p style={styles.success}>{success}</p>}
            {error && <p style={styles.error}>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#1E1E1E",
    color: "#E0E0E0",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    borderRadius: "8px",
    maxWidth: "1200px",
    margin: "40px auto",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
  },
  contactBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
  },
  contactInfo: {
    flex: "1",
    backgroundColor: "#2A2A2A",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "left",
  },
  formBox: {
    flex: "2",
    backgroundColor: "#2A2A2A",
    padding: "20px",
    borderRadius: "8px",
  },
  logo: {
    width: "150px",
    marginBottom: "20px",
  },
  contactHeading: {
    color: "#FFFFFF",
    fontSize: "24px",
    marginBottom: "10px",
  },
  info: {
    color: "#FFFFFF",
    fontSize: "16px",
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
  },
  heading: {
    textAlign: "center",
    color: "#FFFFFF",
    marginBottom: "20px",
    fontSize: "28px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    borderRadius: "4px",
    padding: "8px",
    border: "1px solid #444444",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#2A2A2A",
    color: "#FFFFFF",
    fontSize: "16px",
  },
  textarea: {
    padding: "10px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#2A2A2A",
    color: "#FFFFFF",
    height: "100px",
    fontSize: "16px",
    resize: "none",
  },
  button: {
    padding: "12px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#4CAF50",
    color: "#FFFFFF",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s",
  },
  icon: {
    color: "#FFFFFF",
    fontSize: "18px",
    marginRight: "10px",
  },
  success: {
    color: "#00FF00",
    textAlign: "center",
  },
  error: {
    color: "#FF0000",
    textAlign: "center",
  },
};

export default ContactUs;
