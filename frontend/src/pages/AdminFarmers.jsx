import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaUserTie } from "react-icons/fa";
import { backendUrl } from "../App";

function AdminFarmers() {

  const [farmers, setFarmers] = useState([]);

  const fetchFarmers = async () => {
    try {
      const res = await axios.get(
        `${backendUrl}/api/farmers`
      );

      setFarmers(res.data.farmers || []);

    } catch (err) {
      console.log(err);
    }
  };
  const updateFarmerStatus = async (farmer, status) => {

  try {

    const response = await axios.put(
      `${backendUrl}/api/farmers/status/${farmer._id}`,
      {
        status: status
      }
    );


    if(response.data.success){

      alert(
        status === "Approved"
        ? "Farmer Approved & Email Sent"
        : "Farmer Rejected & Email Sent"
      );

    }
    else{

      alert("Status Updated but Email Failed");

    }
    fetchFarmers();
  } catch(error){
    console.log("Status Update Error:",error);
    alert("Failed to update status");
  }

};
  useEffect(() => {
    fetchFarmers();

  }, []);



  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this farmer?")){
      try{
        await axios.delete(
          `${backendUrl}/api/farmers/${id}`
        );
        fetchFarmers();
      }
      catch(err){
        console.log(err);
      }
    }
  };



  return (

    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

      <div className="p-6 bg-gradient-to-r from-green-50 to-green-100/50 border-b">

        <h2 className="text-xl font-bold text-secondary flex items-center gap-2">

          <FaUserTie className="text-primary"/>

          Registered Farmers ({farmers.length})

        </h2>

      </div>

      <div className="overflow-x-auto">

        <table className="min-w-full divide-y divide-gray-100">

          <thead>

            <tr className="bg-gray-50 text-left text-sm text-secondary font-bold uppercase">
              <th className="p-4">Farmer ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Address</th>
              <th className="p-4">Email</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>

          </thead>

          <tbody className="bg-white divide-y">
          {
          farmers.length > 0 ?
          farmers.map((f)=>(

            <tr 
            key={f._id}
            className="hover:bg-green-50"
            >

              <td className="p-4">
                {f._id}
              </td>

              <td className="p-4 font-semibold">
                {f.name}
              </td>

              <td className="p-4">
                {f.phone}
              </td>

              <td className="p-4">
                {f.address}
              </td>

              <td className="p-4">
                {f.email}
              </td>
              <td className="p-4 font-semibold">

                <span
                className={
                  f.status==="Approved"
                  ? "text-green-700"
                  :
                  f.status==="Rejected"
                  ? "text-red-700"
                  :
                  "text-yellow-700"
                }
                >
                  {f.status}
                </span>
              </td>

              <td className="p-4 text-center">

                {
                f.status==="Pending" && (
                <>
                <button
                onClick={()=>updateFarmerStatus(f,"Approved")}
                className="bg-green-50 text-green-700 px-3 py-1 rounded-lg mr-2 border border-green-200">
                  Approve
                  </button>
                  
                  <button
                  onClick={()=>updateFarmerStatus(f,"Rejected")}
                  className="bg-red-50 text-red-600 px-3 py-1 rounded-lg mr-2 border border-red-200">
                    Reject
                    </button>
                    </>
                  )
                  }
                <button
                onClick={()=>handleDelete(f._id)}
                className="bg-red-50 text-red-600 px-3 py-1 rounded-lg border border-red-200">
                  <FaTrash/>
                </button>
              </td>
            </tr>
          ))
          :
          (
            <tr>
              <td 
              colSpan="7"
              className="text-center p-8 text-gray-400">
                No Farmers Found
              </td>
            </tr>
          )

          }
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminFarmers;