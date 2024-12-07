import { Route, Routes } from "react-router-dom";
import Template from "./templates/Template";
import ProductDetail from "./pages/Products/detail/ProductDetail";
import ProductList from "./pages/Products/ProductList";
import ProductForm from "./components/ProductForm";
import Landing from "./pages/Landing/Landing";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import GestAnnoun from "./components/GestAnnoun";
import UpdateAnnoun from "./components/UpdateAnnoun";
import Cart from "./components/Cart";
import UserStatistics from "./components/UserStatistics";
import ContactUs from "./components/ContactUs";
import NotFound from "./components/NotFound";
import CartPayment from "./components/CartPayment";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

function App() {
  // Vérifie si l'utilisateur est authentifié
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Template>
      <Routes>
        {/* Routes accessibles à tous */}
        <Route path="/" element={<Landing />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Routes protégées accessibles uniquement si authentifié */}
        {isAuthenticated ? (
          <>
            <Route path="/products" element={<ProductList />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/products/add" element={<ProductForm />} />
            <Route path="/announcements" element={<GestAnnoun />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/cartpayment" element={<CartPayment />} />
            <Route path="/statistics" element={<UserStatistics />} />
            <Route
              path="/announcements/update/:announcementId"
              element={<UpdateAnnoun />}
            />
          </>
        ) : (
          // Redirection vers la page de connexion si non authentifié
          <Route path="*" element={<NotFound />} />
        )}

        {/* Page 404 pour les routes inexistantes */}
      </Routes>
    </Template>
  );
}

export default App;
