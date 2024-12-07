import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import "./Css/SignUp.css";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [touchedPassword, setTouchedPassword] = useState(false);
  const [touchedConfirmPassword, setTouchedConfirmPassword] = useState(false);
  const [touchedFirstName, setTouchedFirstName] = useState(false);
  const [touchedLastName, setTouchedLastName] = useState(false);

  const navigate = useNavigate(); // Initialize navigate function

  const isEmailValid = email && /\S+@\S+\.\S+/.test(email);
  const isPasswordValid = password && password.length >= 8;
  const doPasswordsMatch = password === confirmPassword;
  const isFirstNameValid =
    firstName && firstName.length >= 3 && /^[A-Za-z]+$/.test(firstName);
  const isLastNameValid =
    lastName && lastName.length >= 3 && /^[A-Za-z]+$/.test(lastName);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !isEmailValid ||
      !isPasswordValid ||
      !doPasswordsMatch ||
      !isFirstNameValid ||
      !isLastNameValid
    )
      return;

    try {
      const response = await fetch(
        "https://middleware-dynp.onrender.com/user/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstname: firstName,
            lastname: lastName,
            email: email,
            password: password,
            role: "user",
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Inscription réussie !");
        navigate("/SignIn"); // Redirect to SignIn page
      } else {
        alert(`Erreur : ${data.message}`);
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      alert("Une erreur s'est produite lors de l'inscription");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Créer un compte</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Prénom</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onBlur={() => setTouchedFirstName(true)}
              placeholder="Votre prénom"
              required
            />
            {touchedFirstName && !isFirstNameValid && (
              <p className="error-message">
                Le prénom doit contenir au moins 3 lettres et uniquement des
                lettres.
              </p>
            )}
          </div>
          <div className="form-group">
            <label>Nom</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onBlur={() => setTouchedLastName(true)}
              placeholder="Votre nom"
              required
            />
            {touchedLastName && !isLastNameValid && (
              <p className="error-message">
                Le nom doit contenir au moins 3 lettres et uniquement des
                lettres.
              </p>
            )}
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouchedEmail(true)}
              placeholder="Votre email"
              required
            />
            {touchedEmail && !isEmailValid && (
              <p className="error-message">Veuillez entrer un email valide.</p>
            )}
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouchedPassword(true)}
              placeholder="Votre mot de passe"
              required
            />
            {touchedPassword && !isPasswordValid && (
              <p className="error-message">
                Le mot de passe doit contenir au moins 8 caractères.
              </p>
            )}
          </div>
          <div className="form-group">
            <label>Confirmez le mot de passe</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => setTouchedConfirmPassword(true)}
              placeholder="Confirmez le mot de passe"
              required
            />
            {touchedConfirmPassword && !doPasswordsMatch && (
              <p className="error-message">
                Les mots de passe ne correspondent pas.
              </p>
            )}
          </div>
          <button
            type="submit"
            className="btn-submit"
            disabled={
              !isEmailValid ||
              !isPasswordValid ||
              !doPasswordsMatch ||
              !isFirstNameValid ||
              !isLastNameValid
            }
          >
            S'inscrire
          </button>
        </form>

        <div className="signin-link">
          <p>
            Vous avez déjà un compte ? <Link to="/SignIn">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
