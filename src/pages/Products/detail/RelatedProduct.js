import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function RelatedProduct({ category }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Ajout d'un état pour gérer les erreurs

  useEffect(() => {
    const fetchProducts = async () => {
      if (!category) {
        setLoading(false);
        setProducts([]);
        return;
      }

      setLoading(true); // Commencer à charger les produits à chaque changement de catégorie
      setError(null); // Réinitialiser l'erreur avant de refaire la requête

      try {
        const response = await axios.get(
          `http://localhost:4000/announcement/filter/category?category=${category}`
        );
        console.log("Fetched products:", response.data); // Debugging
        if (response.data && Array.isArray(response.data.announcements)) {
          setProducts(response.data.announcements); // Utilisation de `announcements` pour les produits
        } else {
          setProducts([]); // Si aucune annonce n'est trouvée
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("An error occurred while fetching the products.");
        setProducts([]); // En cas d'erreur, on vide les produits
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]); // Recharger les produits chaque fois que la catégorie change

  // Affichage en cas de chargement
  if (loading) {
    return <p>Loading products...</p>;
  }

  // Affichage des erreurs s'il y en a
  if (error) {
    return <p>{error}</p>;
  }

  // Si aucun produit n'est trouvé
  if (!products || products.length === 0) {
    return <p>No related products available.</p>;
  }

  // Mélanger les produits et prendre 3 produits aléatoires
  const randomProducts = products
    .slice() // Crée une copie pour éviter de muter l'état
    .sort(() => 0.5 - Math.random()) // Mélange les produits
    .slice(0, 3); // Prendre les 3 premiers produits après mélange
  console.log(products);
  return (
    <div className="row">
      {randomProducts.map((product) => (
        <div key={product.id} className="col-md-6 col-lg-4">
          <Link to={`/product/${product.id}`} className="text-decoration-none">
            <div className="card shadow-sm">
              {/* Affichage du badge de réduction si applicable */}
              {product.percentOff > 0 && (
                <div
                  className="badge bg-danger py-2 text-white position-absolute"
                  style={{ top: "0.5rem", right: "0.5rem", zIndex: 10 }}
                >
                  {product.percentOff}% OFF
                </div>
              )}

              {/* Affichage de l'image du produit */}
              <img
                className="card-img-top bg-dark cover"
                height="200"
                alt={product.title}
                src={
                  product.picUrl
                    ? `${process.env.PUBLIC_URL}${product.picUrl}`
                    : "/uploads/default-image.jpg"
                }
              />

              <div className="card-body">
                <p className="card-text text-center text-muted">
                  <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                    {product.title}
                  </span>
                  <br />
                  <span>{product.price} DT</span>
                </p>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default RelatedProduct;
