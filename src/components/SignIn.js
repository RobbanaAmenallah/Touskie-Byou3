import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Css/SignIn.css";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [touchedPassword, setTouchedPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const isEmailValid = email && /\S+@\S+\.\S+/.test(email);
  const isPasswordValid = password && password.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEmailValid || !isPasswordValid) return;

    try {
      const response = await fetch(
        "https://middleware-dynp.onrender.com/user/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const { token } = data;
        localStorage.setItem("token", token); // Store the token
        localStorage.setItem("email", email); // Save email to localStorage

        // Decode and log the token
        const decodedToken = jwtDecode(token);
        console.log("Utilisateur connecté :", decodedToken);

        alert(`Connexion réussie !\nToken: ${token}`);

        // Redirect to dashboard
        navigate("/");
      } else {
        setErrorMessage(
          data.message || "Erreur de connexion. Veuillez réessayer."
        );
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      setErrorMessage("Une erreur s'est produite lors de la connexion.");
    }
  };

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
    if (errorMessage) setErrorMessage(""); // Clear error message on input change
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
    if (errorMessage) setErrorMessage(""); // Clear error message on input change
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Se Connecter</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleChangeEmail}
              onBlur={() => setTouchedEmail(true)}
              placeholder="Entrez votre email"
            />
            {touchedEmail && !isEmailValid && (
              <p className="small text-danger">
                Veuillez entrer un email valide
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de Passe</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handleChangePassword}
              onBlur={() => setTouchedPassword(true)}
              placeholder="Entrez votre mot de passe"
            />
            {touchedPassword && !isPasswordValid && (
              <p className="small text-danger">
                Le mot de passe doit contenir au moins 6 caractères
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn-submit"
            disabled={!isEmailValid || !isPasswordValid}
          >
            Se Connecter
          </button>
        </form>

        <div className="signup-link">
          <p>
            Pas encore inscrit ? <Link to="/SignUp">Créez un compte</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
