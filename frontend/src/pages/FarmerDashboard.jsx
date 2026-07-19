import React, { useEffect, useState } from "react";
import axios from "axios";
import FarmerAddProduct from "./FarmerAddProduct";
import { useNavigate } from "react-router-dom";
import FarmerOrders from "./FarmerOrders";
import { backendUrl } from "../App";

import {
  FaHome,
  FaBox,
  FaSignOutAlt,
  FaLeaf,
  FaUser,
  FaClipboardList,
} from "react-icons/fa";

const FarmerDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [farmerName, setFarmerName] = useState("");
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();

  const farmer = JSON.parse(localStorage.getItem("farmer"));
  const farmerId = farmer?._id;

  const fetchProducts = async () => {
    try {
      if (!farmerId) return;

      const res = await axios.get(
        `${backendUrl}/api/products/farmer/${farmerId}`
      );

      setTotalProducts(res.data.products.length);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchOrders = async () => {
    try {
      if (!farmerId) return;

      const res = await axios.get(
        `${backendUrl}/api/orders/farmer/${farmerId}`
      );

      setTotalOrders(res.data.orders.length);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (farmer) {
      setFarmerName(farmer.name);
    }

    fetchProducts();
    fetchOrders();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("farmer");
    navigate("/farmerlogin");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#f0fff4] to-white">

      <div className="w-64 bg-white shadow-lg p-5">

        <h1 className="text-2xl font-bold text-secondary mb-8 flex items-center gap-2">
          <FaLeaf /> Elan Harvest
        </h1>

        <ul className="space-y-3">

          <li
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-3 p-3 rounded cursor-pointer ${
              activeTab === "dashboard"
                ? "bg-green-100 text-secondary font-bold"
                : ""
            }`}>
            <FaHome /> Dashboard
          </li>

          <li
            onClick={() => setActiveTab("add")}
            className={`flex items-center gap-3 p-3 rounded cursor-pointer ${
              activeTab === "add"
                ? "bg-green-100 text-secondary font-bold"
                : ""
            }`}>
            <FaBox /> Manage Product
          </li>

          <li
            onClick={() => setActiveTab("farmerorders")}
            className={`flex items-center gap-3 p-3 rounded cursor-pointer ${
              activeTab === "farmerorders"
                ? "bg-green-100 text-secondary font-bold"
                : ""
            }`}>
            <FaClipboardList /> Orders
          </li>

        </ul>
      </div>

      <div className="flex-1">

        <div className="flex justify-between items-center bg-white p-4 shadow">

          <h2 className="text-secondary font-bold text-xl flex items-center gap-2">
            <FaUser /> Farmer Panel
          </h2>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded">
            <FaSignOutAlt />
            Logout
          </button>

        </div>

        {activeTab === "dashboard" && (
          <div className="p-6">

            <h2 className="text-3xl font-bold text-secondary flex items-center gap-2">
              <FaUser /> Welcome, {farmerName}
            </h2>

            <p className="text-gray-500 mt-2">
              Manage your farm products easily
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">

              <div className="bg-white shadow-lg rounded-xl p-5">
                <p className="text-gray-500">Total Products</p>
                <h2 className="text-3xl font-bold text-secondary">
                  {totalProducts}
                </h2>
              </div>

              <div className="bg-white shadow-lg rounded-xl p-5">
                <p className="text-gray-500">Total Orders</p>
                <h2 className="text-3xl font-bold text-blue-600">
                  {totalOrders}
                </h2>
              </div>

              <div className="bg-white shadow-lg rounded-xl p-5">
                <p className="text-gray-500">Farmer</p>
                <h2 className="text-xl font-bold text-yellow-600">
                  {farmerName}
                </h2>
              </div>

            </div>

          </div>
        )}

        {activeTab === "add" && <FarmerAddProduct />}

        {activeTab === "farmerorders" && (
          <div className="p-6">
            <FarmerOrders />
          </div>
        )}

      </div>
    </div>
  );
};

export default FarmerDashboard;