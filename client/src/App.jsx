import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./components/pages/Home";
import Dashboard from "./components/admin/pages/Dashboard";
import AdminLogin from "./components/admin/auth/AdminLogin";
import Orders from "./components/admin/pages/Orders";
import Products from "./components/pages/Products";
import Users from "./components/admin/pages/Users";
import AdminProducts from "./components/admin/pages/AdminProduct";
import Overview from "./components/admin/pages/Overview";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import GuestCheckout from "./components/pages/GuestCheckout";
import { CartProvider } from "./components/contexts/CartContext";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
        {/* Public admin login route */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Protected admin routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route 
            path="orders" 
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="users" 
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="products" 
            element={
              <ProtectedRoute>
                <AdminProducts />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="overview" 
            element={
              <ProtectedRoute>
                <Overview />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* Main site routes with layout */}
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                {/* <Route path="/about" element={<About />} /> */}
                <Route path="/products" element={<Products />} />
                <Route path="/checkout" element={<GuestCheckout />} />
              </Routes>
            </Layout>
          }
        />
        </Routes>
      </Router>
    </CartProvider>
  );
}
