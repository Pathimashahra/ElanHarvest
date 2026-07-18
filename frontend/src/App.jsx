import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer";

import Hero from "./components/Hero/Hero";
import Login from "./components/Login/Login";
import Products from "./components/Product/Products";
import About from "./components/About/About";
import Cart from "./components/Cart/Cart";
import Checkout from "./components/Checkout/Checkout";
import Contact from "./components/Contact/Contact";
import Orders from "./components/Checkout/Orders";
import FarmerLogin from "./pages/FarmerLogin";
import FarmerDashboard from "./pages/FarmerDashboard";
import FarmerAddProduct from "./pages/FarmerAddProduct";
import FarmerOrders from "./pages/FarmerOrders";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminFarmers from "./pages/AdminFarmers";
import AdminUsers from "./pages/AdminUsers";
import AdminOrders from "./pages/AdminOrders";

import AdminLogin from "./pages/AdminLogin";
import Cancel from "./components/Checkout/Cancel";
import Success from "./components/Checkout/Success";
import CompleteOrder from "./components/Checkout/CompleteOrder";



export const backendUrl = "";

const App = () => {

  const [token, setToken] = useState(
    localStorage.getItem("token") || ""
  );

  const location = useLocation();

  const isFarmerPage =
    location.pathname === "/farmerlogin" ||
    location.pathname === "/farmerdashboard" ||
    location.pathname === "/farmeraddproduct"||
    location.pathname === "/farmerorders"||
    location.pathname === "/admindashboard"||
    location.pathname === "/adminproducts"||
    location.pathname === "/adminfarmers"||
    location.pathname === "/adminusers"||
    location.pathname === "/adminlogin"||
    location.pathname === "/adminorders";

  return (
    <>
      {!isFarmerPage && (
        <Navbar token={token} setToken={setToken} />
      )}

      <ToastContainer />

      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/products" element={<Products />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/about" element={<About />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/orders" element={<Orders/>} />
        <Route path="/farmerlogin" element={<FarmerLogin />} />
        <Route path="/farmerdashboard" element={<FarmerDashboard />} />
        <Route path="/farmeraddproduct" element={<FarmerAddProduct />} />
        <Route path="/farmerorders" element={<FarmerOrders />} />
        <Route path="/admindashboard" element={<AdminDashboard />}/>
        <Route path="/adminproduct" element={<AdminProducts />}/>
        <Route path="/adminfarmers" element={<AdminFarmers />}/>
        <Route path="/adminusers" element={<AdminUsers />}/>
        <Route path="/adminlogin" element={<AdminLogin />}/>
        <Route path="/adminorders" element={<AdminOrders />}/>
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path="/completeorder/:id" element={<CompleteOrder />}/>
      </Routes>

      {!isFarmerPage && <Footer />}
    </>
  );
};

export default App;