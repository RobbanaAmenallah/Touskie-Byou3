import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import FilterMenuLeft from "./FilterMenuLeft";
import Product from "./Product";
import ProductH from "./ProductH";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ScrollToTopOnMount from "../../components/ScrollToTopOnMount";
import "./ProductList.css";

function ProductList() {
  const [viewType, setViewType] = useState(true); // True for grid view
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategory, setFilteredCategory] = useState("All Products");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(3);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New state variables for filtering by price and date
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Token not found. Please log in.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const productResponse = await axios.get(
          "http://localhost:4000/announcement",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const announcements = productResponse.data.announcements;
        setProducts(announcements);

        // Log IDs of announcements
        console.log(
          "Annonce IDs:",
          announcements.map((product) => product.id)
        );

        const categoryResponse = await axios.get(
          "http://localhost:4000/category",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCategories([...categoryResponse.data.categories]);

        setLoading(false);
      } catch (err) {
        setError("Error fetching products or categories.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePriceFilterChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "startDate") setStartDate(value);
    else if (name === "endDate") setEndDate(value);
  };

  const filteredProducts = products.filter((product) => {
    const isCategoryMatch =
      filteredCategory === "All Products" ||
      product.category === filteredCategory;

    const isSearchMatch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    const isPriceMatch =
      product.price >= (priceRange.min || 0) &&
      product.price <= (priceRange.max || Infinity);

    const isDateMatch =
      (!startDate || new Date(product.createdAt) >= new Date(startDate)) &&
      (!endDate || new Date(product.createdAt) <= new Date(endDate));

    return isCategoryMatch && isSearchMatch && isPriceMatch && isDateMatch;
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className="container mt-5 py-4 px-xl-5">
      <ScrollToTopOnMount />
      <nav aria-label="breadcrumb" className="bg-custom-light rounded">
        <ol className="breadcrumb p-3 mb-0">
          <li className="breadcrumb-item">
            <Link
              className="text-decoration-none link-secondary"
              to="/products"
              replace
            >
              All Products
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {filteredCategory}
          </li>
        </ol>
      </nav>

      {loading ? (
        <div>Loading products...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <>
          {/* Sidebar */}
          <div className="row mb-4 mt-lg-3">
            <div className="d-none d-lg-block col-lg-3">
              <div
                className="border rounded shadow-sm bg-dark text-white p-3"
                style={{
                  background: "linear-gradient(145deg, #2c2c2c, #3c3c3c)",
                  border: "1px solid #444",
                  borderRadius: "10px",
                }}
              >
                <ul className="list-group list-group-flush mb-4">
                  <li
                    className="list-group-item bg-dark text-white border-0"
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      borderBottom: "1px solid #555",
                    }}
                  >
                    <FontAwesomeIcon icon={["fas", "tags"]} className="me-2" />
                    Categories
                  </li>
                  {categories.map((category) => (
                    <li
                      key={category.id}
                      className={`list-group-item bg-dark text-white ${
                        filteredCategory === category.name ? "active" : ""
                      }`}
                      style={{
                        cursor: "pointer",
                        padding: "10px 15px",
                        backgroundColor:
                          filteredCategory === category.name
                            ? "#555"
                            : "transparent",
                        borderRadius: "5px",
                      }}
                      onClick={() => setFilteredCategory(category.name)}
                    >
                      <FontAwesomeIcon
                        icon={["fas", "folder-open"]}
                        className="me-2 text-secondary"
                      />
                      {category.name}
                    </li>
                  ))}
                </ul>

                {/* Price Filter */}
                <div className="mb-4">
                  <h6 className="text-white mb-3">
                    <FontAwesomeIcon
                      icon={["fas", "money-bill-wave"]}
                      className="me-2"
                    />
                    Price Range
                  </h6>
                  <input
                    type="number"
                    name="min"
                    value={priceRange.min}
                    onChange={handlePriceFilterChange}
                    className="form-control mb-2 bg-dark text-white border-secondary"
                    placeholder="Min Price"
                  />
                  <input
                    type="number"
                    name="max"
                    value={priceRange.max}
                    onChange={handlePriceFilterChange}
                    className="form-control bg-dark text-white border-secondary"
                    placeholder="Max Price"
                  />
                </div>

                {/* Date Filter */}
                <div>
                  <h6 className="text-white mb-3">
                    <FontAwesomeIcon
                      icon={["fas", "calendar-alt"]}
                      className="me-2"
                    />
                    Filter by Date
                  </h6>
                  <input
                    type="date"
                    name="startDate"
                    value={startDate}
                    onChange={handleDateFilterChange}
                    className="form-control mb-2 bg-dark text-white border-secondary"
                  />
                  <input
                    type="date"
                    name="endDate"
                    value={endDate}
                    onChange={handleDateFilterChange}
                    className="form-control bg-dark text-white border-secondary"
                  />
                </div>
              </div>
            </div>

            {/* Product List */}
            <div className="col-lg-9">
              <div className="d-flex flex-column h-100">
                <div className="row mb-3">
                  <div className="col-lg-9 col-xl-5 offset-xl-4 d-flex flex-row">
                    <div className="input-group">
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <button className="btn btn-outline-dark">
                        <FontAwesomeIcon icon={["fas", "search"]} />
                      </button>
                    </div>
                    <button
                      className="btn btn-outline-dark ms-2 d-none d-lg-inline"
                      onClick={() => setViewType(!viewType)}
                    >
                      <FontAwesomeIcon
                        icon={["fas", viewType ? "th-list" : "th-large"]}
                      />
                    </button>
                  </div>
                </div>

                <div className="row g-3">
                  {currentProducts.length === 0 ? (
                    <p>No products found.</p>
                  ) : (
                    currentProducts.map((product) => {
                      console.log(product.picUrl);
                      // Updated image URL handling
                      const picURL = product.picURL
                        ? `${process.env.PUBLIC_URL}${product.picURL}` // Using process.env.PUBLIC_URL for correct image path
                        : "/uploads/default-image.jpg"; // Fallback to default image if picURL is not found
                      console.log(
                        `Product ID: ${product.id}, Product Details:`,
                        product,
                        `Image URL: ${product.picURL}`
                      );
                      // Or if you want a string output
                      console.log(
                        `Product ID: ${
                          product.id
                        }, Product Details: ${JSON.stringify(
                          product
                        )}, Image URL: ${product.picURL}`
                      );
                      console.log(product.picUrl); // Vérifiez que l'URL est valide

                      return (
                        <div key={product.id} className="col-md-6 col-lg-4">
                          <Link
                            to={`/product/${product.id}`}
                            className="text-decoration-none"
                          >
                            {viewType ? (
                              <Product
                                title={product.title}
                                description={product.description}
                                price={product.price}
                                category={product.category}
                                quantity={product.quantity}
                                picURL={product.picUrl} // Use updated picURL here
                              />
                            ) : (
                              <ProductH
                                title={product.title}
                                description={product.description}
                                price={product.price}
                                category={product.category}
                                quantity={product.quantity}
                                picURL={product.picUrl} // Use updated picURL here
                              />
                            )}
                          </Link>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Pagination */}
              <div className="d-flex justify-content-between mt-3">
                <button
                  className="btn btn-outline-dark"
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <div>
                  Page {currentPage} of {totalPages}
                </div>
                <button
                  className="btn btn-outline-dark"
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ProductList;
