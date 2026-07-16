import React, { useEffect, useState } from "react";
import axios from "axios";

const FarmerAddProduct = () => {
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);

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
      const res = await axios.get(
        `http://localhost:4000/api/products/farmer/${farmerId}`
      );
      setProducts(res.data.products || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
  if (farmerId) fetchProducts();
}, [farmerId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ name: "", price: "", category: "" });
    setImage(null);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("name", form.name);
  formData.append("price", form.price);
  formData.append("category", form.category);
  formData.append("farmerId", farmerId);

  if (image) formData.append("image", image);

  try {
    if (editId) {
      await axios.put(
        `http://localhost:4000/api/products/${editId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Product Updated Successfully");
    } else {
      await axios.post(
        "http://localhost:4000/api/products",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Product Added Successfully");
    }

    resetForm();
    setShowForm(false);
    fetchProducts();
  } catch (err) {
    console.log(err.response?.data || err.message);
    alert("Error occurred");
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
    try {
      await axios.delete(`http://localhost:4000/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-secondary">
          My Products
        </h2>

        <button
          onClick={() => {
            setShowForm(!showForm);
            resetForm();
          }}
          className="text-secondary text-sm font-semibold hover:underline">
          + Add Product
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-3 mb-6 border p-4 rounded-lg ">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="w-full p-2 border rounded"/>

          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full p-2 border rounded"/>

          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            className="w-full p-2 border rounded"/>

          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}/>

          <button className="w-full bg-secondary text-white p-2 rounded">
            {editId ? "Update Product" : "Add Product"}
          </button>
        </form>
      )}

      <table className="w-full border">
        <thead>
          <tr className=" bg-secondary text-white">
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-t text-center">

              <td>
                <img
                  src={p.image}
                  className="w-12 h-12 object-cover rounded mx-auto"/>
              </td>

              <td>{p.name}</td>
              <td>Rs {p.price}</td>
              <td>{p.category}</td>

              <td className="space-x-2">

                <button
                  onClick={() => handleEdit(p)}
                  className="text-blue-600">
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(p._id)}
                  className="text-red-600">
                  Delete
                </button>

              </td>

            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default FarmerAddProduct;