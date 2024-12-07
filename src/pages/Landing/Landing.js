import Banner from "./Banner";
import FeatureProduct from "./FeatureProduct";
import ScrollToTopOnMount from "../../components/ScrollToTopOnMount";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
function Landing() {
  return (
    <>
      <ScrollToTopOnMount />
      <Banner />
      <div className="d-flex flex-column bg-white py-4">
        <p className="text-center px-5">
          Touskié-Byou3 est une plateforme de e-commerce innovante et
          polyvalente qui permet aux utilisateurs d'acheter et de vendre une
          large gamme de produits, incluant des articles neufs et de bonne
          occasion. Le site propose des produits dans diverses catégories telles
          que l'informatique, la mode, les accessoires, les articles bio, et
          bien plus encore. Que ce soit pour acheter des articles neufs, ou
          trouver des bons plans pour des produits d'occasion en excellent état,
          Touskié-Byou3 répond à tous les besoins des consommateurs modernes.
        </p>
        <div className="d-flex justify-content-center">
          <Link to="/products" className="btn btn-primary" replace>
            Browse products
          </Link>
        </div>
      </div>
      <h2 className="text-muted text-center mt-4 mb-3">New Arrival</h2>
      <div className="container pb-5 px-lg-5">
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 px-md-5">
          {Array.from({ length: 1 }, (_, i) => {
            return <FeatureProduct key={i} />;
          })}
        </div>
      </div>
      <div className="d-flex flex-column bg-white py-4">
        <h5 className="text-center mb-3">Follow us on</h5>
        <div className="d-flex justify-content-center">
          <a href="!#" className="me-3">
            <FontAwesomeIcon icon={["fab", "facebook"]} size="2x" />
          </a>
          <a href="!#">
            <FontAwesomeIcon icon={["fab", "instagram"]} size="2x" />
          </a>
          <a href="!#" className="ms-3">
            <FontAwesomeIcon icon={["fab", "twitter"]} size="2x" />
          </a>
        </div>
      </div>
    </>
  );
}

export default Landing;
