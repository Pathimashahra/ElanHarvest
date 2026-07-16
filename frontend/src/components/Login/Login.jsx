import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../../App";
import { useNavigate } from "react-router-dom";

const Login = ({ setToken }) => {
  const [currentState, setCurrentState] = useState("Login");
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const clearForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setPhone("");
    setAddress("");
  };

  const formSubmission = async (event) => {
    event.preventDefault();

    try {
      if (currentState === "Sign Up") {
        const response = await axios.post(
          `${backendUrl}/api/users/register`,
          {
            name,
            email,
            password,
            phone,
            address,
          }
        );

        if (response.data.success) {
          setToken(response.data.token);

          localStorage.setItem("token", response.data.token);
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...response.data.user,
              role: "user",
            })
          );

          alert(response.data.message || "Account Successfully Created!");
          clearForm();
          setTimeout(() => navigate("/login"), 500);
        } else {
          alert(response.data.message);
        }
      }

      else {
        const response = await axios.post(
          `${backendUrl}/api/users/login`,
          {
            email,
            password,
          }
        );

        if (response.data.success) {
          setToken(response.data.token);

          localStorage.setItem("token", response.data.token);

          localStorage.setItem(
            "user",
            JSON.stringify({
              ...response.data.user,
              role: "user",
            })
          );

          alert(response.data.message || "Successfully Login!");
          clearForm();
          setTimeout(() => navigate("/"), 500);
        } else {
          alert(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      alert("Server not reachable");
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-poppins">

      <form
        onSubmit={formSubmission}
        className="w-full max-w-md mt-10 mx-auto bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl 
        transition-all duration-300 space-y-6 border-t-4 border-secondary">

        <div className="text-center">
          <p className="text-2xl font-bold text-secondary font-averia">
            {currentState}
          </p>
        </div>

        {currentState === "Sign Up" && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md"/>
        )}

        {currentState === "Sign Up" && (
          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md"/>
        )}

        {currentState === "Sign Up" && (
          <textarea
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md h-24"/>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-md"/>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-md"/>

        <div className="flex justify-between text-sm text-gray-500 font-bold">
          <p
            onClick={() => {
              setCurrentState(currentState === "Login" ? "Sign Up" : "Login");
              clearForm();
            }}
            className="cursor-pointer text-secondary hover:underline">
            {currentState === "Login" ? "Create Account" : "Login Here"}
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-secondary text-white font-semibold py-3 rounded-md">
          {currentState === "Login" ? "Sign In" : "Sign Up"}
        </button>

        <button
          type="button"
          onClick={clearForm}
          className="w-full bg-gray-300 text-black font-semibold py-3 rounded-md">
          Clear
        </button>

      </form>
    </div>
  );
};

export default Login;