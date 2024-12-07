import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header"; // Importez votre composant Header
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Css/GestAnnoun.css"; // Créez un fichier CSS pour styliser ce composant

function GestAnnoun() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error(
            "Vous devez être connecté pour accéder à cette page."
          );
        }
        // Récupérer les annonces de l'utilisateur connecté
        const response = await axios.get(
          "http://localhost:4000/announcement/user/announcements",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAnnouncements(response.data.announcements); // Assurez-vous que la réponse contient les bonnes annonces
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  // Fonction pour supprimer une annonce
  const handleDelete = async (announcementId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Vous devez être connecté pour supprimer une annonce.");
      }
      await axios.delete(
        `http://localhost:4000/announcement/${announcementId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAnnouncements(
        announcements.filter((ann) => ann.id !== announcementId)
      ); // Filtrer l'annonce supprimée
    } catch (err) {
      setError(err.message);
    }
  };

  // Fonction pour la mise à jour d'une annonce (redirection vers la page de mise à jour)
  const handleUpdate = (announcementId) => {
    navigate(`/announcements/update/${announcementId}`);
  };

  if (loading) {
    return <div className="loading">Chargement des annonces...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="gest-announ-container">
      <Header /> {/* Composant Header */}
      <div className="container mt-5">
        <h1 className="text-center text-white mb-4">Gestion des Annonces</h1>
        <div className="row">
          {announcements.length === 0 ? (
            <div className="text-center text-white">
              <p>Vous n'avez Aucune Annonce</p>
              <Link to="/product/add" className="btn btn-primary">
                Créez une annonce
              </Link>
              <br />
              <br />
              <br />
            </div>
          ) : (
            announcements.map((announcement) => (
              <div key={announcement.id} className="col-md-6 col-lg-4 mb-4">
                <div
                  className="announcement-card shadow-sm p-3"
                  style={{
                    background: "linear-gradient(145deg, #2c2c2c, #3c3c3c)",
                    border: "1px solid #444",
                    borderRadius: "10px",
                  }}
                >
                  <h5 className="text-white">{announcement.title}</h5>
                  <p className="text-secondary">{announcement.description}</p>
                  <div className="text-end">
                    <Link
                      to={`/product/${announcement.id}`}
                      className="btn btn-outline-light"
                    >
                      Voir Détails
                    </Link>
                    <button
                      className="btn btn-danger ms-2"
                      onClick={() => handleDelete(announcement.id)}
                    >
                      Supprimer
                    </button>
                    <button
                      className="btn btn-primary ms-2"
                      onClick={() => handleUpdate(announcement.id)}
                    >
                      Mettre à jour
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
          <Link to={`/statistics`} className="btn btn-primary">
            <FontAwesomeIcon icon={["fas", "chart-line"]} className="me-2" />
            Voir mes statistiques
          </Link>
        </div>
      </div>
    </div>
  );
}

export default GestAnnoun;
