import React, { useEffect, useState } from "react";
import axios from "axios";

const backendUrl = "http://localhost:4000";

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
  <div className="p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-5 text-secondary">Farmer Orders</h1>

    {orders.length === 0 ? (
      <p className="text-center text-gray-500">
        No Orders Found
      </p>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">

          <thead>
            <tr className="bg-secondary text-white">
              <th>Order ID</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Products</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => {
              console.log("Order:", order);
              console.log("Items:", order.items);
              const farmerItems = order.items.filter(
                (item) => item.farmerId === farmerId
              );
              
              console.log("Farmer Items:", farmerItems)
              const total = farmerItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              );
              
            return (
                <tr
                  key={order._id}
                  className="border hover:bg-gray-50 align-top">

                  <td className="border p-3 font-semibold">
                    {order._id}
                  </td>

                  <td className="border p-3">
                    <div>{order.customer?.name}</div>
                    {order.message && (
                      <div className="mt-2 text-xs bg-blue-50 border border-blue-200 text-blue-700 p-2 rounded">
                        <strong>Note:</strong> {order.message}
                      </div>
                    )}
                  </td>

                  <td className="border p-3">
                    {order.customer?.phone}
                  </td>

                  <td className="border p-3">
                    {farmerItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 border-b py-2 last:border-0" >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 rounded object-cover border"/>

                        <div>
                          <p className="font-semibold">
                            {item.name}
                          </p>

                          <p>Qty : {item.quantity}</p>

                          <p>Price : Rs. {item.price}</p>
                        </div>
                      </div>
                    ))}
                  </td>

                  <td className="border p-3 font-bold">
                    Rs. {total/100}
                  </td>
                  
                  <td className="border p-3">
                    {order.paymentMethod}
                  </td>

                  <td className="border p-3">
                    <span
                      className={`${getStatusColor(
                        order.status
                      )} text-white px-3 py-1 rounded-full`}>
                      {order.status}
                    </span>
                  </td>

                  <td className="border p-3">
                    {
order.status === "Pending Farmer Confirmation" && (

<div className="flex gap-3 mt-4">


<button

onClick={()=>updateOrderStatus(
order._id,
"Confirmed"
)}

className="bg-green-600 text-white px-4 py-2 rounded-lg">

Accept

</button>



<button

onClick={()=>updateOrderStatus(
order._id,
"Rejected"
)}

className="bg-red-600 text-white px-4 py-2 rounded-lg">

Reject

</button>


</div>

)
}
                      
                      {order.status === "Processing" && (
                        <button
                        onClick={() =>
                          updateStatus(order._id, "Shipped")}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded w-full">
                          Ship
                        </button>
                      )}
                      
                      {order.status === "Shipped" && (
                        
                        <button
                        onClick={() =>
                          updateStatus(order._id, "Delivered")
                        }
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded w-full" >
                          Deliver
                        </button> 
                      )}
                      
                      {order.status === "Delivered" && ( 
                        <span className="text-green-600 font-semibold">
                          Completed
                        </span>
                    )}
                    
                    {order.status === "Cancelled" && (
                      <span className="text-red-600 font-semibold">
                        Cancelled
                      </span>
                    )}
                    </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

}

export default FarmerOrders;