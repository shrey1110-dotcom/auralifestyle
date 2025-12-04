import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

/* Global chrome */
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import MiniCart from "./components/MiniCart";
import MiniWishlist from "./components/MiniWishlist";

/* Storefront pages */
import Home from "./pages/Home";
import Men from "./pages/Men";
import Women from "./pages/Women";
import Shop from "./pages/Shop";
import ProductPage from "./pages/ProductPage";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Returns from "./pages/Returns";
import Shipping from "./pages/Shipping";
import Contact from "./pages/Contact";
import OrderSuccess from "./pages/OrderSuccess";

/* Admin area */
import AdminLogin from "./pages/AdminLogin.jsx";
import RequireAdmin from "./components/RequireAdmin.jsx";
import AdminLayout from "./admin/AdminLayout.jsx";
import Dashboard from "./admin/Dashboard.jsx";
import Orders from "./admin/Orders.jsx";
import Inventory from "./admin/Inventory.jsx";
import Customers from "./admin/Customers.jsx";
import Settings from "./admin/Settings.jsx";

/* Basic layout with navbar/footer + overlays */
function SiteShell() {
  return (
    <>
      <Navbar />
      <ScrollToTop />
      <Outlet />
      <Footer />
      {/* overlays */}
      <MiniCart />
      <MiniWishlist />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public storefront */}
        <Route element={<SiteShell />}>
          <Route index element={<Home />} />
          <Route path="/men" element={<Men />} />
          <Route path="/women" element={<Women />} />
          <Route path="/shop" element={<Shop />} />
          {/* product route accepts any single param name; ProductPage reads it generically */}
          <Route path="/product/:key" element={<ProductPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/order/success/:id" element={<OrderSuccess />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/contact" element={<Contact />} />
          {/* fallback: go home */}
          <Route path="*" element={<Home />} />
        </Route>

        {/* Admin auth */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin app (guarded) */}
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="customers" element={<Customers />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
