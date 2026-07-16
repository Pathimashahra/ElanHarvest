import React, { useEffect, useState } from "react";
import {
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../../api/cartApi";

import { useNavigate } from "react-router-dom";

import {
  FaTrash,
  FaMinus,
  FaPlus,
  FaShoppingCart,
  FaFileAlt,
} from "react-icons/fa";

const Cart = () => {

  const [cart, setCart] = useState([]);
  const [orderMessage, setOrderMessage] = useState(
    localStorage.getItem("orderMessage") || ""
  );

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const navigate = useNavigate();

const quantityOptions = [
250,500,1000,2000,5000,10000,25000,50000];
  useEffect(() => {
    if (userId) {
      fetchCart();
    }
  }, [userId]);

  const fetchCart = async () => {
    const res = await getCart(userId);

    setCart(res.data.items || []);
  };

  const updateQty = async (
    productId,
    currentQty,
    action
  ) => {

    let index = quantityOptions.indexOf(currentQty);
    if (index === -1) index = 0;
    if (
      action === "plus" &&
      index < quantityOptions.length - 1
    ) {
      index++;
    }
    if (
      action === "minus" &&
      index > 0
    ) {
      index--;
    }

    await updateCartItem({
      userId,
      productId,
      quantity: quantityOptions[index],
    });

    fetchCart();
  };

  const removeItem = async (productId) => {

    await removeFromCart({
      userId,
      productId,
    });

    fetchCart();
  };

  const handleClearCart = async () => {
    await clearCart(userId);
    setCart([]);
    setOrderMessage("");
    localStorage.removeItem("orderMessage");
  };

  const total = cart.reduce((acc, item) => {
  return acc + (item.price * item.quantity) / 100;
}, 0);

  return (

    <div className="min-h-screen bg-green-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <FaShoppingCart className="text-3xl text-secondary" />
          <h1 className="text-3xl font-bold text-secondary">
            My Cart
          </h1>
        </div>

        {cart.length === 0 ? (

          <div className="bg-white rounded-2xl shadow-md p-10 text-center">
            <h2 className="text-2xl font-semibold text-primary mb-2">
              Your Cart is Empty
            </h2>
            <p className="text-gray-500 mb-5">
              Add some fresh organic products
            </p>

            <button
              onClick={() => navigate("/products")}
              className="bg-secondary hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition">
              Shop Now
            </button>
          </div>

        ) : (

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-5">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="bg-white rounded-2xl shadow-md p-4 flex flex-col md:flex-row items-center justify-between gap-5">

                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <img
                      src={
                        item.image ||
                        "https://via.placeholder.com/120"
                      }
                      alt={item.name}
                      className="w-28 h-28 object-cover rounded-xl border"/>
                    <div>
                      <h2 className="text-xl font-bold text-secondary">
                        {item.name}
                      </h2>

                      <p className="text-secondary font-semibold mt-1">
                        Rs {item.price}
                      </p>

                      <p className="text-secondary font-semibold mt-1">
                        Rs {item.price * item.quantity/100}
                      </p>

                    </div>
                  </div>


                  <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-xl">

                    <button
                      onClick={() =>
                        updateQty(
                          item.productId,
                          item.quantity,
                          "minus"
                        )
                      }
                      className="bg-white shadow p-2 rounded-lg hover:bg-gray-200">
                      <FaMinus />
                    </button>

                    <span className="font-bold text-lg min-w-[70px] text-center">
                      {item.quantity >= 1000
                      ? `${item.quantity / 1000}kg`
                      : `${item.quantity}g`}
                    </span>

                    <button
                      onClick={() =>
                        updateQty(
                          item.productId,
                          item.quantity,
                          "plus"
                        )
                      }
                      className="bg-white shadow p-2 rounded-lg hover:bg-gray-200">

                      <FaPlus />
                    </button>

                  </div>


                  <button
                    onClick={() =>
                      removeItem(item.productId)
                    }
                    className="text-red-500">
                    <FaTrash />
                  </button>
                  
                </div>
              ))}

              {/* Message Box */}
              <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
                <h2 className="text-xl font-bold text-secondary mb-3 flex items-center gap-2">
                  <FaFileAlt className="text-primary" /> Special Instructions / Note
                </h2>
                <textarea
                  className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows="3"
                  placeholder="Add any special instructions or note for the farmer/delivery (optional)..."
                  value={orderMessage}
                  onChange={(e) => {
                    setOrderMessage(e.target.value);
                    localStorage.setItem("orderMessage", e.target.value);
                  }}
                />
              </div>

            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 h-fit">

              <h2 className="text-2xl font-bold text-secondary mb-5">
                Order Summary
              </h2>

              <div className="flex justify-between mb-3 text-secondary">
                <span>Items</span>
                <span>{cart.length}</span>
              </div>

              <div className="flex justify-between mb-3 text-secondary">
                <span>Delivery</span>
                <span>Rs 250</span>
              </div>

              <hr className="my-4" />

              <div className="flex justify-between text-xl font-bold text-secondary">
                <span>Total</span>
                <span>
                  Rs {(total + 250).toFixed(2)}
                </span>
              </div>

              <button
                onClick={() =>
                  navigate("/checkout")
                }
                className="w-full bg-green-600 hover:bg-secondary text-white py-3 rounded-xl font-semibold mt-6 transition">
                Proceed to Checkout
              </button>

              <button
                onClick={handleClearCart}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold mt-3 transition">
                Clear Cart
              </button>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;