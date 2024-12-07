import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "./Footer"; // Import du composant Footer
import Header from "./Header"; // Import du composant Header
import "./Css/UpdateAnnoun.css"; // Fichier CSS pour styliser ce composant

function UpdateAnnoun() {
  const { announcementId } = useParams(); // Récupère l'ID de l'annonce depuis l'URL
  const [announcement, setAnnouncement] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    quantity: "",
    image: null,
    picUrl: "", // Ajoutez picUrl pour l'URL de l'image
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Utilisation de navigate pour rediriger

  useEffect(() => {
    console.log("Announcement ID:", announcementId); // Affiche l'ID de l'annonce pour vérifier qu'il est correct

    const fetchAnnouncement = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error(
            "Vous devez être connecté pour accéder à cette page."
          );
        }

        const response = await axios.get(
          `https://middleware-dynp.onrender.com/announcement/${announcementId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Annonce récupérée:", response.data); // Affiche l'annonce récupérée

        setAnnouncement(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, [announcementId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnnouncement((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAnnouncement((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    console.log("Données à mettre à jour:", announcement); // Affiche les données avant la mise à jour

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error(
          "Vous devez être connecté pour mettre à jour l'annonce."
        );
      }

      const formData = new FormData();
      formData.append("title", announcement.title);
      formData.append("description", announcement.description);
      formData.append("price", announcement.price);
      formData.append("quantity", announcement.quantity);
      if (announcement.image) {
        formData.append("image", announcement.image);
      }

      await axios.patch(
        `https://middleware-dynp.onrender.com/announcement/${announcementId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate(`/announcement/${announcementId}`); // Rediriger vers la page de détails de l'annonce
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="loading">Chargement des données...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="update-announ-container">
      <Header /> {/* Composant Header */}
      <div className="container-update mt-5">
        <h1 className="text-center text-white mb-4">Modifier l'Annonce</h1>
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <form onSubmit={handleUpdate} encType="multipart/form-data">
              <div className="mb-3">
                <label htmlFor="title" className="form-label text-white">
                  Titre de l'annonce
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  value={announcement.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label text-white">
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  rows="4"
                  value={announcement.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="category" className="form-label text-white">
                  Catégorie
                </label>
                <select
                  className="form-select"
                  id="category"
                  name="category"
                  value={announcement.category}
                  disabled // Champ non modifiable
                >
                  <option value="">{announcement.category}</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="price" className="form-label text-white">
                  Prix
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="price"
                  name="price"
                  value={announcement.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="quantity" className="form-label text-white">
                  Quantité
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="quantity"
                  name="quantity"
                  value={announcement.quantity}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="image" className="form-label text-white">
                  Image
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="image"
                  name="image"
                  onChange={handleFileChange}
                />
                <div className="text-muted mt-2">
                  {announcement.image
                    ? announcement.image.name
                    : announcement.picUrl
                    ? `Image actuelle: ${announcement.picUrl}`
                    : "Aucun fichier sélectionné"}
                </div>
              </div>

              <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-primary">
                  Mettre à jour
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateAnnoun;
