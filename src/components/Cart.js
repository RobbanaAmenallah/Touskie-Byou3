import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrashAlt, FaPlus, FaMinus } from "react-icons/fa"; // Importer les icônes
import "./Css/Cart.css";
import { Link } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fonction de récupération du panier
  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://middleware-dynp.onrender.com/user/cart",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setCart(response.data.cart || []);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Erreur de chargement.");
    } finally {
      setLoading(false);
    }
  };

  // Calcul du total
  const calculateTotal = () => {
    const totalAmount = cart.reduce((sum, item) => sum + item.total, 0);
    setTotal(totalAmount);
  };

  // Mise à jour de la quantité
  const updateQuantity = async (announcementId, newQuantity) => {
    if (newQuantity <= 0) return;
    setLoading(true);
    try {
      await axios.patch(
        "https://middleware-dynp.onrender.com/user/cart/update",
        { announcementId, newQuantity },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchCart();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Erreur de mise à jour."
      );
    } finally {
      setLoading(false);
    }
  };

  // Suppression d'un article
  const removeItem = async (announcementId) => {
    setLoading(true);
    try {
      await axios.delete(
        "https://middleware-dynp.onrender.com/user/cart/remove",
        {
          data: { announcementId },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchCart();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Erreur de suppression."
      );
    } finally {
      setLoading(false);
    }
  };

  // Vider le panier
  const clearCart = async () => {
    setLoading(true);
    try {
      await axios.post(
        "https://middleware-dynp.onrender.com/user/cart/clear",
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setCart([]);
      setTotal(0);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Erreur de vidage.");
    } finally {
      setLoading(false);
    }
  };

  // Fonction de confirmation d'achat
  const confirmPurchase = async () => {
    setLoading(true);
    try {
      // Appeler l'API pour effectuer l'achat (création d'une commande)
      await axios.post(
        "https://middleware-dynp.onrender.com/user/confirm-purchase",
        { cart }, // Passer le panier ou une partie des données nécessaires
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      // Après confirmation, vider le panier
      clearCart();
      alert("Votre achat a été confirmé !");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Erreur de confirmation d'achat."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [cart]);

  return (
    <div className="cart-container">
      <h2>Votre Panier</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {loading ? (
        <p>Chargement...</p>
      ) : cart.length === 0 ? (
        <p>Votre panier est vide.</p>
      ) : (
        <div className="cart-box">
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.announcementId} className="cart-item">
                <div className="cart-item-info">
                  {console.log("URL de l'image:", item)}

                  <img
                    src={
                      item.picUrl
                        ? `${process.env.PUBLIC_URL}${item.picUrl}`
                        : "/uploads/default-image.jpg"
                    } // Corrected field name and default image fallback
                    alt={item.title}
                    className="cart-item-image"
                  />
                  <h3>{item.title}</h3>
                  <p>Prix : {item.price} DT</p>
                  <p>Quantité : {item.quantity}</p>
                  <p>Total : {item.total} DT</p>
                </div>
                <div className="cart-item-actions">
                  <button
                    className="btn-icon"
                    onClick={() =>
                      updateQuantity(item.announcementId, item.quantity + 1)
                    }
                  >
                    <FaPlus />
                  </button>
                  <button
                    className="btn-icon"
                    onClick={() =>
                      updateQuantity(item.announcementId, item.quantity - 1)
                    }
                    disabled={item.quantity === 1}
                  >
                    <FaMinus />
                  </button>
                  <button
                    className="btn-icon btn-remove"
                    onClick={() => removeItem(item.announcementId)}
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-total">
            <h3>Total : {total} DT</h3>
          </div>

          <button className="btn-clear" onClick={clearCart}>
            Vider le panier
          </button>
          <Link to="/cartpayment">
            <button className="btn-confirm" onClick={confirmPurchase}>
              Confirmer l'achat
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
