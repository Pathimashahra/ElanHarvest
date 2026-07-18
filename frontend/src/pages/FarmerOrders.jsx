import React, { useEffect, useState } from "react";
import axios from "axios";

import { backendUrl } from "../App";

function FarmerOrders() {

  const [orders, setOrders] = useState([]);

 const farmer = JSON.parse(
  localStorage.getItem("farmer")
);

const farmerId = farmer?._id;
console.log("Farmer:", farmer);
console.log("Farmer ID:", farmerId);

useEffect(() => {

  if (farmerId) {
    fetchOrders();
  }

}, [farmerId]);
 const fetchOrders = async () => {
  try {
    const res = await axios.get(
      `${backendUrl}/api/orders/farmer/${farmerId}`
    );

    console.log("API Response:", res.data);

    if (res.data.success) {
      console.log("Orders:", res.data.orders);
      setOrders(res.data.orders);
    }

  } catch (err) {
    console.log(err);
  }
};
const updateStatus = async(orderId, status) => {

  try {

    const res = await axios.put(
      `${backendUrl}/api/orders/update-status/${orderId}`,
      {
        status
      }
    );


    if(res.data.success){

      alert(`Order ${status}`);

      fetchOrders();

    }


  } catch(err){
    console.log(err);
    alert("Status update failed");
  }

};
const updateOrderStatus = async(orderId,status)=>{
  try{
    const res = await axios.put(
      `${backendUrl}/api/orders/update-status/${orderId}`,
      {
        status
      }
    );


    if(res.data.success){

      alert(
        `Order ${status}`
      );
      fetchOrders();
    }

  }catch(err){
    console.log(err);
  }
};

const getStatusColor = (status) => {

  switch(status){

    case "Pending":
      return "bg-yellow-500";

    case "Processing":
      return "bg-blue-500";

    case "Shipped":
      return "bg-purple-500";

    case "Delivered":
      return "bg-green-500";

    case "Cancelled":
      return "bg-red-500";

    default:
      return "bg-gray-500";
  }
};

 return (
 <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

    <div className="p-6 bg-gradient-to-r from-green-50 to-green-100/50 border-b border-gray-100">

      <div className="flex justify-between items-center">

        <h2 className="text-xl font-bold text-secondary">
          My Orders ({orders.length})
        </h2>

      </div>

    </div>

    {
      orders.length === 0 ? (

        <p className="text-center p-8 text-gray-400">
          No Orders Found
        </p>

      ) : (

      <div className="overflow-x-auto">

        <table className="min-w-full divide-y divide-gray-100">

          <thead>

            <tr className="bg-gray-50 text-sm font-bold text-secondary uppercase">

              <th className="p-4 text-center">
                Order ID
              </th>

              <th className="p-4 text-center">
                Customer
              </th>

              <th className="p-4 text-center">
                Phone
              </th>

              <th className="p-4 text-center">
                Products
              </th>

              <th className="p-4 text-center">
                Total
              </th>

              <th className="p-4 text-center">
                Payment
              </th>

              <th className="p-4 text-center">
                Status
              </th>

              <th className="p-4 text-center">
                Action
              </th>

            </tr>

          </thead>

          <tbody className="divide-y divide-gray-50">

          {
          orders.map((order)=>{

          const farmerItems = order.items.filter(
            (item)=>item.farmerId === farmerId
          );

          const total = farmerItems.reduce(
            (sum,item)=>sum + item.price * item.quantity,
            0
          );

          return (

          <tr  key={order._id}
          className=" hover:bg-green-50/30 transition">
            <td className="p-4 text-center text-sm font-semibold text-gray-600">

              {order._id}

            </td>

            <td className="p-4 text-center">

              <p className="font-bold text-gray-800">
                {order.customer?.name}
              </p>

              {
              order.message && (

              <div className=" mt-2 text-xs bg-blue-50 border border-blue-200 text-blue-700 p-2 rounded">

              Note: {order.message}

              </div>

              )
              }

            </td>

            <td className="p-4 text-center text-gray-600">
              {order.customer?.phone}
            </td>

            <td className="p-4">

            {
            farmerItems.map((item,index)=>(

              <div
              key={index}
              className=" flex items-center justify-center gap-3 border-b py-2">


                <img
                src={item.image}
                className=" w-14 h-14 rounded-lg object-cover border"/>
                <div className="text-left">

                  <p className="font-semibold">
                    {item.name}
                  </p>

                  <p className="text-sm">
                    Qty : {item.quantity}
                  </p>

                  <p className="text-sm">
                    Rs {item.price}
                  </p>

                </div>

              </div>

            ))
            }

            </td>

            <td className="p-4 text-center font-bold">
              Rs {total/100}
            </td>

            <td className="p-4 text-center text-gray-600">
              {order.paymentMethod}
            </td>

            <td className="p-4 text-center">

              <span
              className={`
              ${getStatusColor(order.status)} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                {order.status}
              </span>
            </td>

            <td className="p-4 text-center">
            {
            order.status === "Pending Farmer Confirmation" && (

            <div className="flex justify-center gap-2">

              <button
              onClick={()=>updateOrderStatus(order._id,"Confirmed")}
              className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm">
              Accept
             </button>

              <button
              onClick={()=>updateOrderStatus(order._id,"Rejected")}
              className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm">
              Reject
              </button>

            </div>
            )
            }

            {
            order.status === "Processing" && (

            <button
            onClick={()=>updateStatus(order._id,"Shipped")}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg">
            Ship
            </button>
            )
            }

            {
            order.status === "Shipped" && (

            <button
            onClick={()=>updateStatus(order._id,"Delivered")}
            className="bg-green-500 text-white px-4 py-2 rounded-lg">
            Deliver
            </button>
            )
            }

            {
            order.status === "Delivered" && (
            <span className="text-green-600 font-semibold">
              Completed
            </span>

            )
            }

            {
            order.status === "Cancelled" && (

            <span className="text-red-600 font-semibold">
              Cancelled
            </span>

            )
            }
            </td>
          </tr>

          )


          })
          }
          </tbody>

        </table>

      </div>
      )

    }

  </div>
);

}

export default FarmerOrders;