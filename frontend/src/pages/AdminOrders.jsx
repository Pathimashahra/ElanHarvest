import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaShoppingCart } from "react-icons/fa";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/orders");
      setOrders(res.data.orders || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

      <div className="p-6 bg-gradient-to-r from-green-50 to-green-100/50 border-b border-gray-100">
        <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
          <FaShoppingCart className="text-primary" />
          Customer Orders ({orders.length})
        </h2>
      </div>

      <div className="overflow-x-auto">

        <table className="min-w-full divide-y divide-gray-100">

          <thead>
            <tr className="bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              <th className="p-4">Order ID</th>
              <th className="p-4">Farmer ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Products</th>
              <th className="p-4">Total</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-50">

            {orders.length > 0 ? (

              orders.map((order) => (

                <tr
                  key={order._id}
                  className="hover:bg-green-50/20 transition duration-150"
                >

                  <td className="p-4 text-sm font-semibold text-gray-500">
                    {order._id}
                  </td>

                  <td className="p-4 text-sm text-gray-600">
                    {order.items?.map((item, index) => (
                      <div key={index}>{item.farmerId}</div>
                    ))}
                  </td>

                  <td className="p-4">
                    <div className="font-bold text-gray-800">
                      {order.customer?.name}
                    </div>

                    {order.message && (
                      <div className="mt-2 text-xs bg-blue-50 border border-blue-200 text-blue-700 rounded-lg p-2">
                        {order.message}
                      </div>
                    )}
                  </td>

                  <td className="p-4 text-sm text-gray-600">
                    {order.customer?.phone}
                  </td>

                  <td className="p-4 text-sm text-gray-600">
                    {order.items?.map((item, index) => (
                      <div key={index}>
                        {item.name} × {item.quantity}g
                      </div>
                    ))}
                  </td>

                  <td className="p-4 font-semibold text-green-600">
                    Rs. {order.totalAmount}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.paymentMethod === "Stripe"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {order.paymentMethod}
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Processing"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : order.status === "Pending Farmer Confirmation"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                </tr>

              ))

            ) : (

              <tr>
                <td
                  colSpan="8"
                  className="text-center p-8 text-gray-400 text-sm"
                >
                  No Orders Found
                </td>
              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default AdminOrders;