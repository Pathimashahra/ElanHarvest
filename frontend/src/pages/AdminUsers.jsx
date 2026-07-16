import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaUsers } from "react-icons/fa";

function AdminUsers() {
    const [users, setUsers] = useState([]);
        
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/users");
        setUsers(res.data.users || []);
      } catch (err) {
        console.log(err);
      }
    };
  
    useEffect(() => {
      fetchUsers();
    }, []);

    const handleDelete = async (id) => {
      if (window.confirm("Are you sure you want to delete this customer?")) {
        try {
          await axios.delete(`http://localhost:4000/api/users/${id}`);
          fetchUsers();
        } catch (err) {
          console.log(err);
        }
      }
    };

    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-green-50 to-green-100/50 border-b border-gray-100">
          <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
            <FaUsers className="text-primary" /> Registered Customers ({users.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="p-4">User ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Address</th>
                <th className="p-4">E-mail</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {users.length > 0 ? (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-green-50/20 transition duration-150">
                    <td className="p-4 text-sm font-semibold text-gray-500">{u._id}</td>
                    <td className="p-4 text-sm font-bold text-gray-800">{u.name}</td>
                    <td className="p-4 text-sm text-gray-600">{u.phone}</td>
                    <td className="p-4 text-sm text-gray-600">{u.address}</td>
                    <td className="p-4 text-sm text-gray-600">{u.email}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="mx-auto bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-3 py-1.5 rounded-lg border border-red-200 hover:border-red-300 transition duration-150 flex items-center justify-center gap-1.5 text-xs"
                      >
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-8 text-gray-400 text-sm">
                    No Customers Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
}

export default AdminUsers;