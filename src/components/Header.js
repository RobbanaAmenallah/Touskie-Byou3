import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  faHome,
  faPlus,
  faList,
  faShoppingCart,
  faSignInAlt,
  faSignOutAlt,
  faUserAlt,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/images/Logo.png"; // Import the logo image

function Header() {
  const [openedDrawer, setOpenedDrawer] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  function toggleDrawer() {
    setOpenedDrawer(!openedDrawer);
  }

  function changeNav(event) {
    if (openedDrawer) {
      setOpenedDrawer(false);
    }
  }

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/signup");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const currentPath = window.location.pathname;
      if (currentPath === "/contactus" || currentPath === "/") {
        navigate("/products");
      }
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated === null) {
    return null;
  }

  return (
    <header>
      <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-white border-bottom">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/" onClick={changeNav}>
            <img
              src={logo} // Use the logo image
              alt="Touskié-Informatique"
              style={{ width: "50px", height: "auto" }} // Adjust size if necessary
            />
            <span className="ms-2 h5">Touskié-Informatique</span>
          </Link>

          <div
            className={
              "navbar-collapse offcanvas-collapse " +
              (openedDrawer ? "open" : "")
            }
          >
            <ul className="navbar-nav me-auto mb-lg-0">
              {isAuthenticated ? (
                <>
                  <li className="nav-item">
                    <Link
                      to="/products"
                      className="nav-link"
                      replace
                      onClick={changeNav}
                    >
                      <FontAwesomeIcon icon={faHome} className="me-2" />
                      Explore
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/products/add"
                      className="nav-link"
                      replace
                      onClick={changeNav}
                    >
                      <FontAwesomeIcon icon={faPlus} className="me-2" />
                      Ajouter Annonce
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/announcements"
                      className="nav-link"
                      replace
                      onClick={changeNav}
                    >
                      <FontAwesomeIcon icon={faList} className="me-2" />
                      My announcements
                    </Link>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <Link
                    to="/contactus"
                    className="nav-link"
                    replace
                    onClick={changeNav}
                  >
                    Contact Us
                  </Link>
                </li>
              )}
            </ul>

            <Link to="/cart">
              <button
                type="button"
                className="btn btn-outline-dark me-3 d-none d-lg-inline"
              >
                <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                <span className="ms-3 badge rounded-pill bg-dark">DT</span>
              </button>
            </Link>

            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item dropdown">
                <a
                  href="!#"
                  className="nav-link dropdown-toggle"
                  data-toggle="dropdown"
                  id="userDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <FontAwesomeIcon icon={faUserAlt} />
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="userDropdown"
                >
                  {!isAuthenticated ? (
                    <>
                      <li>
                        <Link
                          to="/SignIn"
                          className="dropdown-item"
                          onClick={changeNav}
                        >
                          <FontAwesomeIcon
                            icon={faSignInAlt}
                            className="me-2"
                          />
                          Login
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/SignUp"
                          className="dropdown-item"
                          onClick={changeNav}
                        >
                          <FontAwesomeIcon
                            icon={faSignInAlt}
                            className="me-2"
                          />
                          Sign Up
                        </Link>
                      </li>
                    </>
                  ) : (
                    <li>
                      <button className="dropdown-item" onClick={logout}>
                        <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                        Logout
                      </button>
                    </li>
                  )}
                </ul>
              </li>
            </ul>
          </div>

          <div className="d-inline-block d-lg-none">
            <Link to="/cart">
              <button type="button" className="btn btn-outline-dark">
                <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                <span className="ms-3 badge rounded-pill bg-dark">0</span>
              </button>
            </Link>
            <button
              className="navbar-toggler p-0 border-0 ms-3"
              type="button"
              onClick={toggleDrawer}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
