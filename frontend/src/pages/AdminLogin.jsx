import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      formData.email === "admin@gmail.com" &&
      formData.password === "admin123"
    ) {
      alert("Admin Login Successful!");

      localStorage.setItem(
        "admin",
        JSON.stringify({
          email: "admin@gmail.com",
        })
      );

      navigate("/admindashboard");
    } else {
      alert("Invalid Email or Password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-200/50 font-poppins">
        <form
          onSubmit={handleSubmit}
          className="w-[420px] bg-white p-8 rounded-2xl shadow-2xl"
        >

          <h2 className="text-3xl font-bold text-secondary text-center">
            Admin Portal
          </h2>

          <input
            type="email"
            name="email"
            placeholder="Admin Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full mt-8 p-3 border rounded-lg outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full mt-4 p-3 border rounded-lg outline-none"
          />

          <div className="flex flex-col gap-3 mt-6">

            <button
              type="submit"
              className="w-full bg-secondary hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full bg-gray-200 hover:bg-green-200/50 text-gray-800 py-3 rounded-xl font-semibold transition"
            >
              Back to Home
            </button>

          </div>

        </form>

      </div>

  );
}

export default AdminLogin;