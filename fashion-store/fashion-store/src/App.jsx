// src/App.jsx
import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import MiniCart from "./components/MiniCart";
import MiniWishlist from "./components/MiniWishlist";

// pages
import Home from "./pages/Home";
import Men from "./pages/Men";
import Women from "./pages/Women";
import ProductPage from "./pages/ProductPage";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import OrderSuccess from "./pages/OrderSuccess";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Returns from "./pages/Returns";
import Shipping from "./pages/Shipping";
import Contact from "./pages/Contact";

// Admin
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminProducts from "./pages/Admin/AdminProducts";
import AdminInventory from "./pages/Admin/AdminInventory";
import AdminOrders from "./pages/Admin/AdminOrders";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminSettings from "./pages/Admin/AdminSettings";
import RequireAdmin from "./components/RequireAdmin";
import ProductForm from "./pages/Admin/ProductForm";

export default function App() {
  return (
    <>
      <ScrollToTop behavior="auto" />
      <Navbar />
      <MiniCart />
      <MiniWishlist />

      <Suspense fallback={<div className="p-8">Loading…</div>}>
        <Routes>
          {/* Shop routes */}
          <Route path="/" element={<Home />} />
          <Route path="/men" element={<Men />} />
          <Route path="/women" element={<Women />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/order-success/:id" element={<OrderSuccess />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/help/shipping" element={<Shipping />} />
          <Route path="/help/contact" element={<Contact />} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/*"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </Suspense>

      <Footer />
    </>
  );
}
