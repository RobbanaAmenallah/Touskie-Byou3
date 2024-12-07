import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./FeatureProduct.css";

function FeatureProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiCalled, setApiCalled] = useState(false);

  useEffect(() => {
    if (apiCalled) return;

    const fetchProducts = async () => {
      setApiCalled(true);
      try {
        console.log("Appel API");
        const response = await axios.get(
          "https://middleware-dynp.onrender.com/announcement/filter/today"
        );

        console.log("Réponse de l'API :", response.data);

        const uniqueProducts = response.data.announcements.filter(
          (product, index, self) =>
            index === self.findIndex((p) => p.id === product.id)
        );

        setProducts(uniqueProducts);
      } catch (err) {
        console.error("Erreur lors de la récupération des produits :", err);
        setError("Impossible de charger les produits. Réessayez plus tard.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [apiCalled]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement des produits...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="feature-products-container">
      {products.length > 0 ? (
        products.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="card-inner">
              <img
                className="product-image"
                alt={product.title}
                src={
                  product.picUrl
                    ? `${process.env.PUBLIC_URL}${product.picUrl}`
                    : "/uploads/default-image.jpg"
                }
              />
              <div className="product-details">
                <h5 className="product-title">{product.title}</h5>
                <p className="product-price">{product.price} Ks</p>
                <Link
                  to={`/product/${product.id}`}
                  className="detail-button"
                  replace
                >
                  Voir Détail
                </Link>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="no-products">Aucun produit trouvé aujourd'hui.</div>
      )}
    </div>
  );
}

export default FeatureProduct;
