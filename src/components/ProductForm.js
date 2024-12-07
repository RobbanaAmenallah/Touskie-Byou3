import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FaTag, FaListAlt, FaDollarSign, FaBox, FaImage } from "react-icons/fa"; // Import icons

const ProductForm = () => {
  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    quantity: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Token is required");
          return;
        }

        const response = await fetch("http://localhost:4000/category", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 403) {
          setError("Accès interdit. Vérifiez votre token.");
          return;
        }

        const data = await response.json();

        if (data && Array.isArray(data.categories)) {
          setCategories(data.categories);
        } else {
          setError("Les catégories ne sont pas au format attendu.");
        }
      } catch (err) {
        setError("Erreur lors de la récupération des catégories.");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (success) {
      setProduct({
        title: "",
        description: "",
        price: "",
        category: "",
        quantity: "",
      });
      setSelectedFile(null);
      setError(null);
    }
  }, [success]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate fields
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.category ||
      !product.quantity ||
      !selectedFile
    ) {
      setError("Tous les champs et une image sont requis.");
      return;
    }

    if (isNaN(product.quantity) || parseInt(product.quantity) <= 0) {
      setError("Veuillez entrer une quantité valide.");
      return;
    }

    if (isNaN(product.price) || parseFloat(product.price) <= 0) {
      setError("Veuillez entrer un prix valide.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Aucun token trouvé, veuillez vous connecter.");
      return;
    }

    let decodedToken;
    try {
      decodedToken = jwtDecode(token);
    } catch (err) {
      setError("Erreur lors de la décodification du token.");
      return;
    }

    const userEmail = decodedToken?.email;
    if (!userEmail) {
      setError("Impossible de récupérer l'email de l'utilisateur.");
      return;
    }

    const formData = new FormData();
    formData.append("title", product.title);
    formData.append("description", product.description);
    formData.append("price", parseFloat(product.price));
    formData.append("category", product.category);
    formData.append("quantity", parseInt(product.quantity));
    formData.append("image", selectedFile);
    formData.append("userEmail", userEmail);

    try {
      const response = await fetch(
        "http://localhost:4000/announcement/create",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erreur lors de l'ajout de l'annonce"
        );
      }

      setSuccess(true);
      navigate("/products");
    } catch (err) {
      setError(`Erreur : ${err.message}`);
    }
  };

  return (
    <div className="container mt-5 py-4 px-xl-5">
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
          <li className="breadcrumb-item active" aria-current="page">
            Ajouter une annonce
          </li>
        </ol>
      </nav>

      <div className="row mb-4">
        <div className="col-lg-6">
          <h2>Ajouter une nouvelle annonce</h2>

          {error && <p className="text-danger">{error}</p>}
          {success && (
            <p className="text-success">Annonce ajoutée avec succès!</p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-12">
                <label className="form-label">
                  <FaTag /> Titre de l'annonce
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={product.title}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="row g-3 mt-3">
              <div className="col-md-12">
                <label className="form-label">
                  <FaListAlt /> Description
                </label>
                <textarea
                  className="form-control"
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                  rows="4"
                  required
                ></textarea>
              </div>
            </div>

            <div className="row g-3 mt-3">
              <div className="col-md-6">
                <label className="form-label">
                  <FaBox /> Catégorie
                </label>
                <select
                  className="form-control"
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories &&
                    Array.isArray(categories) &&
                    categories.map((category) => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">
                  <FaDollarSign /> Prix
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </div>
            </div>

            <div className="row g-3 mt-3">
              <div className="col-md-6">
                <label className="form-label">
                  <FaBox /> Quantité
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="quantity"
                  value={product.quantity}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">
                  <FaImage /> Image
                </label>
                <input
                  type="file"
                  className="form-control"
                  onChange={handleFileChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary mt-4">
              Ajouter l'annonce
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
