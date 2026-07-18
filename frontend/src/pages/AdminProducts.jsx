import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBoxOpen, FaTrash } from "react-icons/fa";
import { backendUrl } from "../App";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/products`);
      setProducts(res.data.products || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`${backendUrl}/api/products/${id}`);
        fetchProducts();
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

      <div className="p-6 bg-gradient-to-r from-green-50 to-green-100/50 border-b border-gray-100">
        <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
          <FaBoxOpen className="text-primary" />
          Products List ({products.length})
        </h2>
      </div>

      <div className="overflow-x-auto">

        <table className="min-w-full divide-y divide-gray-100">

          <thead>
            <tr className="bg-gray-50 text-left text-sm font-bold text-secondary uppercase tracking-wider">
              <th className="p-4">Farmer</th>
              <th className="p-4">Image</th>
              <th className="p-4">Product</th>
              <th className="p-4">Price</th>
              <th className="p-4">Category</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-50">

            {products.length > 0 ? (

              products.map((p) => (
                <tr
                  key={p._id}
                  className="hover:bg-green-50/20 transition duration-150">

                  <td className="p-4">
                    {p.farmerId?.name ? (

                      <div>
                        <div className="font-bold text-gray-800">
                          {p.farmerId.name}
                        </div>

                        <div className="text-xs text-gray-600">
                          ID : {p.farmerId._id}
                        </div>
                      </div>

                    ) : (

                      <div className="font-semibold text-gray-700">
                        {typeof p.farmerId === "string"
                          ? p.farmerId
                          : "No Farmer"}
                      </div>

                    )}

                  </td>

                  <td className="p-4">

                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-14 h-14 rounded-xl object-cover border shadow-sm"/>

                  </td>

                  <td className="p-4 font-semibold text-gray-800">
                    {p.name}
                  </td>

                  <td className="p-4">
                    <span className="font-bold text-secondary">
                      Rs. {p.price}
                    </span>
                  </td>

                  <td className="p-4">

                    <span className="px-3 py-1 rounded-full bg-green-100 text-secondary text-xs font-semibold">
                      {p.category}
                    </span>

                  </td>

                  <td className="p-4 text-center">

                    <button
                      onClick={() => handleDelete(p._id)}
                      className="mx-auto bg-red-50 hover:bg-red-100 text-red-700 font-semibold px-3 py-1.5 rounded-lg border border-red-200 hover:border-red-300 transition duration-150 flex items-center justify-center gap-2 text-xs"
                    >
                      <FaTrash />
                      Delete
                    </button>

                  </td>
                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="6"
                  className="text-center p-8 text-gray-400 text-sm"
                >
                  No Products Found
                </td>

              </tr>

            )}

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;