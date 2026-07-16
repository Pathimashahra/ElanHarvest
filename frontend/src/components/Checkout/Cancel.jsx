import React from "react";
import { useNavigate } from "react-router-dom";

const Cancel = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-red-600">
        Payment Cancelled
      </h1>

      <button
        onClick={() => navigate("/checkout")}
        className="mt-5 bg-secondary text-white px-5 py-2 rounded"
      >
        Try Again
      </button>
    </div>
  );
};

export default Cancel;