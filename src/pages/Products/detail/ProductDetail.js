import React, { useState, useEffect } from "react";
import Image from "../../../assets/images/nillkin-case-1.jpg";
import RelatedProduct from "./RelatedProduct";
import { Link, useParams } from "react-router-dom";
import ScrollToTopOnMount from "../../../components/ScrollToTopOnMount";
import axios from "axios";

function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartMessage, setCartMessage] = useState(""); // Pour les messages de retour

  // Fonction pour récupérer les détails du produit
  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Vous devez être connecté pour voir ce produit.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `https://middleware-dynp.onrender.com/announcement/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProduct(response.data); // Stocker les données du produit dans l'état
      setLoading(false);
    } catch (error) {
      setError(
        error.response && error.response.status === 404
          ? "Produit non trouvé."
          : "Échec du chargement des détails du produit."
      );
      setLoading(false);
      console.error(
        "Erreur lors de la récupération des données du produit :",
        error
      );
    }
  };

  // Fonction pour ajouter le produit au panier
  const addToCart = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setCartMessage(
          "Vous devez vous connecter pour ajouter des produits au panier."
        );
        return;
      }

      const response = await axios.post(
        `https://middleware-dynp.onrender.com/user/cart/add`, // URL de l'API
        {
          announcementId: productId, // Utiliser productId comme announcementId
          quantity: 1, // Quantité par défaut
          picUrl: product?.picUrl, // Inclure l'URL de l'image
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCartMessage("Produit ajouté au panier avec succès.");
    } catch (error) {
      setCartMessage(
        error.response?.data?.message ||
          "Échec de l'ajout du produit au panier."
      );
      console.error("Erreur lors de l'ajout du produit au panier :", error);
    }
  };

  // Récupérer le produit au montage du composant ou lorsque productId change
  useEffect(() => {
    fetchProduct();
  }, [productId]);

  // Afficher un message d'erreur si le chargement des données du produit échoue
  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  // Afficher un indicateur de chargement pendant la récupération des données du produit
  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mt-5 py-4 px-xl-5">
      <ScrollToTopOnMount />
      <nav aria-label="breadcrumb" className="bg-custom-light rounded mb-4">
        <ol className="breadcrumb p-3">
          <li className="breadcrumb-item">
            <Link
              className="text-decoration-none link-secondary"
              to="/products"
            >
              Tous les produits
            </Link>
          </li>
          <li className="breadcrumb-item">
            <a className="text-decoration-none link-secondary" href="#!">
              {product?.category}
            </a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {product?.name}
          </li>
        </ol>
      </nav>

      <div className="row mb-4">
        <div className="d-none d-lg-block col-lg-1">
          <div className="image-vertical-scroller">
            <div className="d-flex flex-column">
              {product?.images?.map((image, index) => (
                <a key={index} href="#!">
                  <img
                    className={`rounded mb-2 ratio ${
                      index === 0 ? "opacity-6" : ""
                    }`}
                    alt={`product-image-${index}`}
                    src={image || Image} // Image de secours si aucune n'est fournie
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="row">
            <div className="col-12 mb-4">
              <img
                className="border rounded ratio ratio-1x1"
                alt="product"
                src={
                  product?.picUrl
                    ? `${process.env.PUBLIC_URL}${product.picUrl}`
                    : "/uploads/default-image.jpg"
                } // Image de secours si aucune n'est fournie
              />
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="d-flex flex-column h-100">
            <h2 className="mb-1">{product?.name}</h2>
            <h4 className="text-muted mb-4">{product?.price} DT</h4>
            <div className="row g-3 mb-4">
              <div className="col">
                <button
                  className="btn btn-outline-dark py-2 w-100"
                  onClick={addToCart} // Gestionnaire de clic pour le bouton "Ajouter au panier"
                >
                  Ajouter au panier
                </button>
              </div>
              <div className="col">
                <button className="btn btn-dark py-2 w-100">
                  Acheter maintenant
                </button>
              </div>
            </div>

            {cartMessage && (
              <div className="alert alert-info">{cartMessage}</div>
            )}

            <h4 className="mb-0">Détails</h4>
            <hr />
            <dl className="row">
              <dt className="col-sm-4">Nom</dt>
              <dd className="col-sm-8 mb-3">{product?.title}</dd>
              <dt className="col-sm-4">Catégorie</dt>
              <dd className="col-sm-8 mb-3">{product?.category}</dd>
              <dt className="col-sm-4">Prix</dt>
              <dd className="col-sm-8 mb-3">{product?.price} DT</dd>
              <dt className="col-sm-4">Quantité</dt>
              <dd className="col-sm-8 mb-3">{product?.quantity}</dd>
            </dl>

            <h4 className="mb-0">Description</h4>
            <hr />
            <p className="lead flex-shrink-0 product-description">
              <small>{product?.description}</small>
            </p>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12 mb-4">
          <hr />
          <h4 className="text-muted my-4">Produits similaires</h4>
          <RelatedProduct category={product?.category} />
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
