import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { backendUrl } from "../App";

function FarmerLogin() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const res = await axios.post(
          `${backendUrl}/api/farmers/login`,
          {
            email: formData.email,
            password: formData.password,
          }
        );

        if (res.data.success) {
          alert(res.data.message || "Login Successful!");

          localStorage.setItem("token", res.data.token);
          localStorage.setItem(
            "farmer",
            JSON.stringify(res.data.farmer)
          );

          navigate("/farmerdashboard");
        } else {
          alert(res.data.message);
        }
      } else {
        const res = await axios.post(
          `${backendUrl}/api/farmers/register`,
          formData
        );

        if (res.data.success) {
          alert(res.data.message || "Farmer Registered Successfully!");

          setIsLogin(true);
        } else {
          alert(res.data.message);
        }
      }
    } catch (err) {
      console.log(err);
      alert(
        err.response?.data?.message || "Server Error"
      );
    }
  };

  return (
    <div className="flex h-screen w-full">
      <div className="hidden md:block md:w-1/2">
        <img
          src="/images/img1.jpeg"
          alt="Farmer"
          className="h-full w-full object-cover"/>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center bg-green-200/50">
        <form
          onSubmit={handleSubmit}
          className="w-[420px] bg-white p-8 rounded-2xl shadow-2xl">
          <h2 className="text-3xl font-bold text-secondary text-center">
            Farmer Portal
          </h2>

          {!isLogin && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full mt-4 p-3 border rounded-lg"/>

              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full mt-3 p-3 border rounded-lg"/>

              <textarea
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full mt-3 p-3 border rounded-lg h-24"/>
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full mt-4 p-3 border rounded-lg"/>

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full mt-3 p-3 border rounded-lg"/>

            <div className="flex justify-between text-sm text-gray-500 font-bold mt-3">
              <p
                onClick={() => {
                  setIsLogin(!isLogin);
                  clearForm();
                }}
                className="cursor-pointer text-secondary hover:underline"
              >
                {isLogin ? "Create Account" : "Login Here"}
              </p>
            </div>
          <div className="flex flex-col gap-3 mt-5">
            <button
              type="submit"
              className="w-full bg-secondary hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition">
              {isLogin ? "Login" : "Register"}
            </button>


            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-xl font-semibold transition">
              Back to Home
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FarmerLogin;