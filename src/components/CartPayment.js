import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Importer jwt-decode
import "./Css/CartPayment.css";
import emailjs from "emailjs-com"; // Import EmailJS

const CartPayment = () => {
  const [contactMethod, setContactMethod] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState(""); // Email extrait du token
  const [confirmationCode, setConfirmationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cvc, setCvc] = useState("");
  const [expirationDate, setExpirationDate] = useState("");

  // Fonction pour récupérer les données du panier
  async function fetchCartData() {
    try {
      // Decode the token to extract the user's email
      const token = localStorage.getItem("token"); // Assuming you store the token in localStorage
      const decoded = jwtDecode(token); // Decode the token to get user details
      const email = decoded.email;

      // Fetch user data by email
      const response = await axios.get(`http://localhost:4000/user/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Extract the cart from the user's data
      const { cart } = response.data.user;
      console.log("Cart Data:", cart);
      return cart;
    } catch (error) {
      console.error("Error fetching cart data:", error);
      return [];
    }
  }

  // Example usage: Populate cartData state
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    fetchCartData().then((data) => setCartData(data));
  }, []);

  const totalAmount = cartData.reduce((acc, item) => acc + item.total, 0);

  // Fonction pour récupérer l'email depuis le token JWT
  const getEmailFromToken = () => {
    const token = localStorage.getItem("token"); // Supposons que le token est dans le localStorage
    if (token) {
      const decoded = jwtDecode(token);
      return decoded.email; // Assurez-vous que l'email est dans le payload du token
    }
    return "";
  };

  // Utilisation de useEffect pour charger l'email depuis le token
  useEffect(() => {
    const userEmail = getEmailFromToken();
    setEmail(userEmail); // Définir l'email à partir du token
  }, []);

  // Fonction pour envoyer le code de confirmation
  const handleSendCode = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/payment/send-code",
        {
          contactMethod,
          phoneNumber,
          email, // L'email est maintenant pris du token
        }
      );
      if (response.data.message === "Code de confirmation envoyé par SMS.") {
        setIsCodeSent(true);
      }
    } catch (error) {
      console.error("Error sending code:", error);
      if (error.response) {
        console.error("Server response:", error.response.data);
      }
    }
  };

  // Fonction pour confirmer le paiement et envoyer l'email
  const handleConfirmPayment = async () => {
    const paymentData = {
      code: confirmationCode,
      contactMethod,
      phoneNumber,
      email, // L'email est maintenant pris du token
      cart: cartData.map((item) => ({
        announcementId: item.announcementId,
        quantity: item.quantity,
        total: item.total,
      })),
      totalAmount,
      paymentMethod: "Credit Card",
      paymentStatus: "Success",
      timestamp: new Date().toISOString(),
    };

    // Afficher les données avant d'envoyer la requête
    console.log("Payment Data to send:", paymentData);

    // Vérifier les champs manquants
    const missingFields = [];
    if (!paymentData.code) missingFields.push("Confirmation code");
    if (!paymentData.contactMethod) missingFields.push("Contact method");
    if (!paymentData.phoneNumber && !paymentData.email)
      missingFields.push("Phone number or email");
    if (paymentData.cart.length === 0) missingFields.push("Cart items");
    if (!paymentData.totalAmount) missingFields.push("Total amount");
    if (!paymentData.paymentMethod) missingFields.push("Payment method");
    if (!paymentData.paymentStatus) missingFields.push("Payment status");

    if (missingFields.length > 0) {
      console.log("Missing fields:", missingFields.join(", "));
      alert(
        `Please complete the following fields: ${missingFields.join(", ")}`
      );
      return;
    }

    try {
      // Vérifier le code de confirmation avec le serveur
      const response = await axios.post(
        "http://localhost:4000/payment/verify-code",
        paymentData
      );
      console.log(response.data.message);

      // Envoyer un email de confirmation après la vérification du paiement
      const emailParams = {
        to_name: "Customer", // Remplacer par le nom de l'utilisateur si disponible
        from_name: "Touskié-Byou3", // Votre site ou nom d'entreprise
        to_email: email, // Utilisation de l'email de l'utilisateur passé dynamiquement
        transaction_details: `Total amount: ${totalAmount}, Payment Method: Credit Card, Status: Success`, // Détails de la transaction
      };
      console.log("Email to send to:", email);

      // Envoi de l'email via EmailJS
      emailjs
        .send(
          "service_6nmzyln", // Remplacer par votre ID de service EmailJS
          "template_deoir68", // Remplacer par votre ID de modèle EmailJS
          emailParams,
          "wMzpA_50TTc7EFx4D" // Remplacer par votre ID utilisateur EmailJS
        )
        .then((response) => {
          console.log("Email sent successfully:", response);
          alert("Payment successful. A confirmation email has been sent.");
        })
        .catch((error) => {
          console.error("Error sending email:", error);
          alert("Payment successful, but failed to send confirmation email.");
        });
    } catch (error) {
      if (error.response) {
        console.error("Error response data:", error.response.data);
        alert(
          `Payment failed: ${error.response.data.message || "Unknown error"}`
        );
      } else if (error.request) {
        console.error("Error request:", error.request);
        alert("Network error: No response from server.");
      } else {
        console.error("Error message:", error.message);
        alert(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div className="container">
      <h2>Payment</h2>
      <div>
        <label>Confirmation Method:</label>
        <select
          onChange={(e) => setContactMethod(e.target.value)}
          value={contactMethod}
        >
          <option value="">Select Method</option>
          <option value="sms">SMS</option>
          <option value="email">Email</option>
        </select>
      </div>
      <div>
        {contactMethod === "sms" && (
          <>
            <label>Phone Number:</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
            />
          </>
        )}
        {contactMethod === "email" && (
          <>
            <label>Email Address:</label>
            <input
              type="email"
              value={email}
              placeholder="Your email is auto-filled"
              disabled
            />
          </>
        )}
      </div>
      <button onClick={handleSendCode}>Send Confirmation Code</button>

      {isCodeSent && (
        <div className="confirmation-section">
          <h3>Enter Confirmation Code</h3>
          <input
            type="text"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            placeholder="Enter the code"
          />
          <h3>Enter Card Details</h3>
          <label>Card Number:</label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="Enter your card number (16 digits)"
          />
          <label>CVC:</label>
          <input
            type="text"
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
            placeholder="Enter CVC"
          />
          <label>Expiration Date (MM/YY):</label>
          <input
            type="text"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            placeholder="MM/YY"
          />
          <button onClick={handleConfirmPayment}>Confirm Payment</button>
        </div>
      )}
    </div>
  );
};

export default CartPayment;
