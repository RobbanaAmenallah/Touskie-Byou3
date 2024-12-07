import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

function ProductH({
  title,
  description,
  price,
  category,
  quantity,
  picURL, // URL de l'image
  percentOff,
}) {
  // Calculer le prix avec réduction si applicable
  let offPrice = `${price} DT`;
  if (percentOff && percentOff > 0) {
    offPrice = (
      <>
        <del>{price} DT</del> {price - (percentOff * price) / 100} DT
      </>
    );
  }

  return (
    <div className="d-flex flex-column flex-lg-row border rounded shadow-sm mb-4">
      {/* Section de l'image */}
      <div className="col-12 col-lg-4 d-flex justify-content-center">
        <Link to="/products/1">
          <img
            src={
              picURL
                ? `${process.env.PUBLIC_URL}${picURL}`
                : "/uploads/default-image.jpg"
            }
            className="w-100 h-100"
            alt={title}
          />
        </Link>
      </div>

      {/* Section des détails */}
      <div className="col-12 col-lg-8 d-flex flex-column">
        <div className="d-flex flex-column flex-xl-row p-3">
          {/* Détails du produit */}
          <div className="col-xl-8">
            <h5 className="card-title text-dark text-truncate">{title}</h5>
            <p className="text-muted text-truncate mb-0">{description}</p>
            <span className="text-muted small">Category: {category}</span>
          </div>

          {/* Prix */}
          <div className="col-xl-4 d-flex align-items-center justify-content-end">
            <p className="text-dark mb-0">{offPrice}</p>
          </div>
        </div>

        {/* Quantité et bouton Ajouter au panier */}
        <div className="d-flex justify-content-between p-3">
          <button className="btn btn-outline-dark">
            <FontAwesomeIcon icon={["fas", "cart-plus"]} /> View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductH;
