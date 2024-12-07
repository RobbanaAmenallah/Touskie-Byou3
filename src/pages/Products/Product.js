import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

function Product({
  title,
  description,
  price,
  category,
  quantity,
  picURL,
  percentOff,
}) {
  let offPrice = `${price}Ks`;

  if (percentOff && percentOff > 0) {
    offPrice = (
      <>
        <del>{price}DT</del> {price - (percentOff * price) / 100}Ks
      </>
    );
  }

  return (
    <div className="col">
      <div className="card shadow-sm">
        <Link to="/products/1" href="!#" replace>
          {percentOff > 0 && (
            <div
              className="badge bg-dim py-2 text-white position-absolute"
              style={{ top: "0.5rem", right: "0.5rem" }}
            >
              {percentOff}% OFF
            </div>
          )}
          <img
            className="card-img-top bg-dark cover"
            height="200"
            alt=""
            src={
              picURL
                ? `${process.env.PUBLIC_URL}${picURL}`
                : "/uploads/default-image.jpg"
            }
          />
        </Link>
        <div className="card-body">
          <h5 className="card-title text-center text-dark text-truncate">
            {title}
          </h5>
          <p className="card-text text-center text-muted mb-0">{offPrice}</p>
          <div className="d-grid d-block">
            <button className="btn btn-outline-dark mt-3">
              <FontAwesomeIcon icon={["fas", "cart-plus"]} /> View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
