import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { addToCart } from "../../api/cartApi";
import { FaUser } from "react-icons/fa";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [weight, setWeight] = useState(250);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  useEffect(() => {
    fetchProducts();
  }, []);

const fetchProducts = async () => {
  try {
    const res = await axios.get("http://localhost:4000/api/products");

    console.log("API RESPONSE:", res.data);

    setProducts(res.data.products);
  } catch (err) {
    console.log(err);
  }
};

  const filteredProducts = category
    ? products.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase()
      )
    : products;

  const openPopup = (product) => {
    setSelectedProduct(product);
    setWeight(250);
    setShowPopup(true);
  };

  const closePopup = () => setShowPopup(false);

  const totalPrice = selectedProduct
    ? ((weight / 100) * selectedProduct.price).toFixed(2)
    : 0;

  const handleAddToCart = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  if (!userId) {
    alert("Please login first!");
    window.location.href = "/login";
    return;
  }

  if (user.role !== "user") {
    alert("Only customers can add to cart");
    return;
  }

  try {
    const res = await addToCart({
      userId,
      product: {
        productId: selectedProduct.id || selectedProduct._id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        image: selectedProduct.image,
        quantity: weight ,
        farmerId: selectedProduct.farmerId?._id || selectedProduct.farmerId,
      },
    });

    if (res.data.success) {
      alert("Added to cart successfully");
      setShowPopup(false);
    } else {
      alert(res.data.message || "Failed to add to cart");
    }
  } catch (err) {
    console.log(err);
    alert(err.response?.data?.message || "Failed to add to cart");
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0fff4] to-white px-6 py-12 md:px-20">

      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold text-secondary">
          {category ? `${category} Collection` : "Fresh Organic Products"}
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-3xl shadow-md hover:shadow-xl transition overflow-hidden"
            >
              <img
                src={p.image}
                className="w-full h-52 object-cover"
                alt={p.name}
              />

              <div className="p-5">
                <h2 className="text-lg font-bold text-secondary">
                  {p.name}
                </h2>

                <p className="text-sm text-primary">{p.category}</p>

                {/* Farmer Name */}
                <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
                  <span className="bg-green-50 text-green-700 font-medium px-2 py-0.5 rounded-full border border-green-200 flex items-center gap-1">
                    <FaUser className="text-[10px]" /> {p.farmerId?.name || "Organic Farmer"}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <p className="text-xl font-bold text-secondary">
                    Rs {p.price}
                  </p>

                  <button
                    onClick={() => openPopup(p)}
                    className="bg-secondary text-white px-4 py-2 rounded-xl text-sm"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-4 text-primary">
            No products found
          </p>
        )}
      </div>

      {showPopup && selectedProduct && (
        <div className="fixed inset-0 bg-secondary/60 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md text-secondary rounded-3xl p-6">

            <img
              src={selectedProduct.image}
              className="w-full h-48 object-contain rounded-2xl border-2 border-secondary mb-4"
              alt=""
            />

            <h2 className="text-2xl font-bold mb-2">
              {selectedProduct.name}
            </h2>

            {/* Farmer Name */}
            <div className="text-sm mb-4 flex items-center gap-1.5 bg-green-50 p-2.5 rounded-xl border border-green-100">
              <span className="font-semibold text-secondary flex items-center gap-1">
                <FaUser className="text-xs text-primary" /> Farmer:
              </span>
              <span className="font-bold text-green-700">{selectedProduct.farmerId?.name || "Organic Farmer"}</span>
            </div>

            <div className="flex justify-center gap-5 mb-3">
              <button
                onClick={() =>
                  setWeight(weight > 250 ? weight - 250 : 250)
                }
                className="w-10 h-10 bg-primary text-white rounded-lg"
              >
                -
              </button>

              <span className="text-xl font-bold">{weight}g</span>

              <button
                onClick={() => setWeight(weight < 50000 ? weight + 250 : 50000)}
                className="w-10 h-10 bg-primary text-white rounded-lg"
              >
                +
              </button>
            </div>

            <h3 className="text-2xl font-bold text-center mb-5">
              Rs {totalPrice}
            </h3>

            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-secondary text-white py-3 rounded-xl"
              >
                Add To Cart
              </button>

              <button
                onClick={closePopup}
                className="flex-1 border py-3 rounded-xl"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Products;