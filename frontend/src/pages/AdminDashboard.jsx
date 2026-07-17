import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import AdminFarmers from "./AdminFarmers";
import AdminUsers from "./AdminUsers";
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";

import {
  FaHome,
  FaBox,
  FaLeaf,
  FaUser,
  FaSignOutAlt,
  FaClipboardList
} from "react-icons/fa";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const backendUrl = "http://localhost:4000";

      const userRes = await axios.get(`${backendUrl}/api/users`);
      const farmerRes = await axios.get(`${backendUrl}/api/farmers`);
      const productRes = await axios.get(`${backendUrl}/api/products`);
      const orderRes = await axios.get(`${backendUrl}/api/orders`);

      setUsers(userRes.data.users || userRes.data || []);
      setFarmers(farmerRes.data.farmers || farmerRes.data || []);
      setProducts(productRes.data.products || productRes.data || []);
      setOrders(orderRes.data.orders || orderRes.data || []);

    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    localStorage.removeItem("user");
    localStorage.removeItem("farmer");
    localStorage.removeItem("order");

    navigate("/adminlogin");
  };

  const CircleStat = ({ value, label, color }) => {
    const radius = 45;
    const stroke = 10;
    const circumference = 2 * Math.PI * radius;

    const progress = value > 100 ? 100 : value;

    const offset =
      circumference - (progress / 100) * circumference;

    return (
      <div className="flex flex-col items-center bg-white p-5 rounded-xl shadow-lg">
        <svg width="120" height="120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={stroke}
            fill="none"
          />

          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke={color}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 60 60)"
          />

          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dy=".3em"
            fontSize="18"
            fontWeight="bold"
          >
            {value}
          </text>
        </svg>

        <p className="mt-2 font-semibold text-gray-700">
          {label}
        </p>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#f0fff4] to-white">

      <div className="w-64 bg-white shadow-lg p-5">

        <h1 className="text-2xl font-bold text-secondary mb-8 flex items-center gap-2">
          <FaLeaf />
          Elan Harvest
        </h1>

        <ul className="space-y-3">

          <li
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-3 p-3 rounded cursor-pointer transition ${
              activeTab === "dashboard"
                ? "bg-green-100 text-secondary font-bold"
                : "hover:bg-gray-100"
            }`}
          >
            <FaHome />
            Dashboard
          </li>

          <li
            onClick={() => setActiveTab("farmers")}
            className={`flex items-center gap-3 p-3 rounded cursor-pointer transition ${
              activeTab === "farmers"
                ? "bg-green-100 text-secondary font-bold"
                : "hover:bg-gray-100"
            }`}
          >
            <FaUser />
            Farmers
          </li>

          <li
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-3 p-3 rounded cursor-pointer transition ${
              activeTab === "users"
                ? "bg-green-100 text-secondary font-bold"
                : "hover:bg-gray-100"
            }`}>
            <FaUser />
            Users
          </li>

          <li
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-3 p-3 rounded cursor-pointer transition ${
              activeTab === "products"
                ? "bg-green-100 text-secondary font-bold"
                : "hover:bg-gray-100"
            }`}>
            <FaBox />
            Products
          </li>

          <li
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-3 p-3 rounded cursor-pointer transition ${
              activeTab === "orders"
                ? "bg-green-100 text-secondary font-bold"
                : "hover:bg-gray-100"
            }`}>
            <FaClipboardList />
            Orders
          </li>
        </ul>

      </div>

      <div className="flex-1">

        <div className="flex justify-between items-center bg-white p-4 shadow">

          <h2 className="text-secondary font-bold text-xl flex items-center gap-2">
            <FaUser />
            Admin Panel
          </h2>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            <FaSignOutAlt />
            Logout
          </button>

        </div>

        <div className="p-6">

          {activeTab === "dashboard" && (
            <>
              <h2 className="text-3xl font-bold text-secondary flex items-center gap-2">
                 <FaUser /> Welcome Admin
              </h2>

              <p className="text-gray-500 mb-8">
                Manage users, farmers, and products from one place.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <CircleStat
                  value={farmers.length}
                  label="Farmers"
                  color="#15803d"/>

                <CircleStat
                  value={users.length}
                  label="Users"
                  color="#1d4ed8"/>

                <CircleStat
                  value={products.length}
                  label="Products"
                  color="#b91c1c"/>

                  <CircleStat
                  value={orders.length}
                  label="Orders"
                  color="#c2410c"/>

              </div>
            </>
          )}

          {activeTab === "farmers" && <AdminFarmers />}

          {activeTab === "users" && <AdminUsers />}

          {activeTab === "products" && <AdminProducts />}
          {activeTab === "orders" && <AdminOrders />}

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;