import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";

const FarmerAddProduct = () => {
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
  });

  const [image, setImage] = useState(null);

  const farmer = JSON.parse(localStorage.getItem("farmer"));
  const farmerId = farmer?._id;

  const fetchProducts = async () => {
    try {
      if (!farmerId) return;
      const res = await axios.get(
        `${backendUrl}/api/products/farmer/${farmerId}`
      );
      setProducts(res.data.products || []);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  useEffect(() => {
    if (farmerId) fetchProducts();
  }, [farmerId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          resolve(compressedFile);
        }, 'image/jpeg', 0.7);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

const handleImageChange = async (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      // Compress the image before setting it
      const compressedFile = await compressImage(file);
      setImage(compressedFile);
    } catch (err) {
      console.log("Image compression error:", err);
      setImage(file); // Fallback to original file
    }
  }
};
  const resetForm = () => {
    setForm({ name: "", price: "", category: "" });
    setImage(null);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('price', form.price);
    formData.append('category', form.category);
    formData.append('farmerId', farmerId);
    
    if (image) {
      formData.append("image", image);
    } else if (!editId) {
      alert("Please select an image");
      setLoading(false);
      return;
    }

    if (!farmerId) {
      alert("Farmer is not logged in. Please log in first.");
      setLoading(false);
      return;
    }

    try {
      const url = editId
        ? `${backendUrl}/api/products/${editId}`
        : `${backendUrl}/api/products`;
      console.log("Sending to:", url);
      
      const response = editId
        ? await axios.put(url, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
        : await axios.post(url, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

      console.log("Response:", response.data);
      
      if (editId) {
        alert("Product Updated Successfully");
      } else {
        alert("Product Added Successfully");
      }
      
      resetForm();
      setShowForm(false);
      fetchProducts();

    } catch (err) {
      console.log("FULL ERROR:", err);
      
      if (err.response) {
        console.log("STATUS:", err.response.status);
        console.log("DATA:", err.response.data);
        alert(err.response?.data?.message || "Server error occurred");
      } else if (err.request) {
        console.log("No response received:", err.request);
        alert("No response from server. Please check your connection.");
      } else {
        console.log("Error:", err.message);
        alert(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name,
      price: p.price,
      category: p.category,
    });
    setEditId(p._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`${backendUrl}/api/products/${id}`);
        alert("Product deleted successfully");
        fetchProducts();
      } catch (err) {
        console.log("Delete error:", err);
        alert("Failed to delete product");
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-green-50 to-green-100/50 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-secondary">
            My Products ({products.length})
          </h2>

          <button
            onClick={() => {
              setShowForm(!showForm);
              resetForm();
            }}
            className="bg-secondary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90"
          >
            {showForm ? "Cancel" : "+ Add Product"}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="p-6 space-y-3 border-b border-gray-100">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="w-full p-2 border rounded-lg"
            required
          />

          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full p-2 border rounded-lg"
            required
            min="0"
            step="0.01"
          />

          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            className="w-full p-2 border rounded-lg"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Image
            </label>
            <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;
              console.log("Size:", file.size / 1024 / 1024, "MB");
              setImage(file);
  }}
/>
            {image && (
              <p className="text-sm text-gray-500 mt-1">
                Selected: {image.name} ({(image.size / 1024).toFixed(2)} KB)
              </p>
            )}
            {editId && !image && (
              <p className="text-sm text-gray-500 mt-1">
                Keep existing image or upload a new one
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary text-white p-2 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Processing..." : (editId ? "Update Product" : "Add Product")}
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead>
            <tr className="bg-gray-50 text-sm font-bold text-secondary uppercase">
              <th className="p-4 text-center">Image</th>
              <th className="p-4 text-center">Name</th>
              <th className="p-4 text-center">Price</th>
              <th className="p-4 text-center">Category</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.length > 0 ? (
              products.map((p) => (
                <tr key={p._id} className="border-t hover:bg-green-50/30 transition">
                  <td className="p-4 text-center">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-14 h-14 mx-auto rounded-lg object-cover border"
                    />
                  </td>
                  <td className="p-4 text-center font-semibold text-gray-800">
                    {p.name}
                  </td>
                  <td className="p-4 text-center text-gray-600">
                    Rs {p.price}
                  </td>
                  <td className="p-4 text-center text-gray-600">
                    {p.category}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleEdit(p)}
                      className="text-blue-600 font-semibold mr-4 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="text-red-600 font-semibold hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-400">
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

export default FarmerAddProduct;