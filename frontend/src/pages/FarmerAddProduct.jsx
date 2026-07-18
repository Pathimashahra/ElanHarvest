import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";

const FarmerAddProduct = () => {
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
  });
console.log("FORM DATA");

for (let pair of formData.entries()) {
  console.log(pair[0], pair[1]);
}
  const [image, setImage] = useState(null);

  const farmer = JSON.parse(localStorage.getItem("farmer"));
  const farmerId = farmer?._id;

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${backendUrl}/api/products/farmer/${farmerId}`
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
        `${backendUrl}/api/products/${editId}`,
        formData
      );

      alert("Product Updated Successfully");
    } else {
      await axios.post(
        `${backendUrl}/api/products`,
        formData
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
      await axios.delete(`${backendUrl}/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.log(err);
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
          className=" bg-secondary text-white px-4 py-2 rounded-lg text-sm font-semiboldhover:opacity-90">
          + Add Product
        </button>

      </div>

    </div>

    {showForm && (

      <form onSubmit={handleSubmit}className="p-6 space-y-3 border-b border-gray-100">

        <input name="name" 
        value={form.name} 
        onChange={handleChange} 
        placeholder="Product Name" 
        className="w-full p-2 border rounded-lg"/>

        <input name="price" 
        value={form.price} 
        onChange={handleChange} 
        placeholder="Price" 
        className="w-full p-2 border rounded-lg"/>

        <input name="category" 
        value={form.category} 
        onChange={handleChange} 
        placeholder="Category" 
        className="w-full p-2 border rounded-lg"/>


        <input
          type="file"
          onChange={(e)=>setImage(e.target.files[0])}
          className="block mx-auto"/>


        <button
          className="w-full bg-secondary text-white p-2 rounded-lg font-semibold">

          {editId ? "Update Product" : "Add Product"}
        </button>
      </form>
    )}

    <div className="overflow-x-auto">

        <table className="min-w-full divide-y divide-gray-100">

          <thead>

            <tr className="bg-gray-50 text-sm font-bold text-secondary uppercase">

            <th className="p-4 text-center">
              Image
            </th>

            <th className="p-4 text-center">
              Name
            </th>

            <th className="p-4 text-center">
              Price
            </th>

            <th className="p-4 text-center">
              Category
            </th>

            <th className="p-4 text-center">
              Action
            </th>

          </tr>

        </thead>
        <tbody className="divide-y divide-gray-50">
        {
          products.length > 0 ? (
            products.map((p)=>(

              <tr
              key={p._id}
              className=" border-t hover:bg-green-50/30 transition">

                <td className="p-4 text-center">

                  <img
                    src={p.image}
                    className="w-14 h-14 mx-auto rounded-lg object-cover border"/>
                </td>
                <td className=" p-4 text-center font-semibold text-gray-800">
                  {p.name}
                </td>

                <td className=" p-4 text-center text-gray-600">
                  Rs {p.price}
                </td>

                <td className=" p-4 text-center text-gray-600">
                  {p.category}
                </td>

                <td className="p-4 text-center">
                  <button
                    onClick={()=>handleEdit(p)}
                    className="text-blue-600 font-semibold mr-4 hover:underline">
                    Edit
                  </button>

                  <button
                    onClick={()=>handleDelete(p._id)}
                    className="text-red-600 font-semibold hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
              colSpan="5"
              className=" p-8 text-center text-gray-400">
                No Products Found

              </td>

            </tr>
          )
        }
        </tbody>
      </table>
    </div>
  </div>
);
};

export default FarmerAddProduct;