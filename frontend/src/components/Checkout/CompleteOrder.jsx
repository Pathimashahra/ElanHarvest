import React, {useEffect,useState} from "react";
import axios from "axios";
import {backendUrl} from "../../App";
import {useParams,useNavigate} from "react-router-dom";


const CompleteOrder =()=>{
const {id}=useParams();
const navigate=useNavigate();
const [order,setOrder]=useState(null);

const user = JSON.parse(
  localStorage.getItem("user")
);

const [address,setAddress]=useState({
name:user?.name || "",
phone:user?.phone || "",
address:user?.address || ""
});

const [payment,setPayment]=useState("COD");
useEffect(()=>{

fetchOrder();

},[]);

const fetchOrder=async()=>{

try{

const res=await axios.get(
`${backendUrl}/api/orders/${id}`
);
setOrder(res.data.order);

}catch(err){
  console.log(err);

}

};


const completeOrder = async()=>{
  try{
    if(!order){
      alert("Order loading...");
      return;
    }

    if(!address.name || !address.phone || !address.address){
      alert("Please enter delivery details");
      return;
    }
const updateRes = await axios.put(
  `${backendUrl}/api/orders/complete/${id}`,
  {
    customer:address,
    paymentMethod:payment
  }
);
if(!updateRes.data.success){
  alert("Order update failed");
  return;

}
if(payment==="Stripe"){
  const itemsPrice = order.items.reduce((sum, item) => sum + (item.price * item.quantity) / 100, 0);
  console.log("SEND STRIPE DATA:",{
    orderId:id,
    userId:order.userId,
    customer:address,
    items:order.items,
    totalAmount:itemsPrice
});
const stripeRes = await axios.post(
  `${backendUrl}/api/payment/create-checkout-session`,
  {
    orderId:id,
    userId:order.userId,
    customer:address,
    items:order.items,
    totalAmount:itemsPrice
  }
);
if(stripeRes.data.success){
  window.location.href =
  stripeRes.data.url;
}
else{
  alert(stripeRes.data.message);
}


}
else{
  alert(
    "Order confirmed with COD"
  );
  navigate("/orders");
}
}catch(err){
  console.log(
    "COMPLETE ORDER ERROR:",
    err.response?.data || err.message
);

alert(
err.response?.data?.message || err.message || "Order completion failed"
);


}

};

if(!order){
  return(
  <div className="text-center p-10">
    Loading...
    </div>
)

}

const itemsPrice = order.items.reduce((sum, item) => sum + (item.price * item.quantity) / 100, 0);
const deliveryCharge = 250;
const totalToPay = payment === "Stripe" ? itemsPrice : (itemsPrice + deliveryCharge);

return(
<div className="min-h-screen bg-green-100/50 p-6">
  <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
    <h1 className="text-2xl font-bold text-green-700 mb-5">
      Delivery Details
    </h1>
    
    <input
    className="border p-3 w-full mb-3"
    placeholder="Name"
    value={address.name}
    onChange={(e)=>
      setAddress({
        ...address,
        name:e.target.value
      })
    }/>
    
    <input
    className="border p-3 w-full mb-3"
    placeholder="Phone"
    value={address.phone}
    onChange={(e)=>
      setAddress({
        ...address,
        phone:e.target.value
      })
    }/>
    
    <textarea
    className="border p-3 w-full mb-3"
    placeholder="Delivery Address"
    value={address.address}
    onChange={(e)=>
      setAddress({
        ...address,
        address:e.target.value
      })
    }/>

<div className="border-t border-b py-4 my-4">
  <h2 className="font-bold text-lg text-secondary mb-2">Order Summary</h2>
  <div className="space-y-1.5 text-sm text-gray-700">
    <div className="flex justify-between">
      <span>Items Price:</span>
      <span className="font-semibold">Rs {itemsPrice.toFixed(2)}</span>
    </div>
    <div className="flex justify-between">
      <span>Delivery Charge:</span>
      <span>{payment === "Stripe" ? <span className="line-through text-red-500">Rs 250</span> : "Rs 250"}</span>
    </div>
    {payment === "Stripe" && (
      <div className="text-xs text-secondary font-semibold italic">
        * Delivery charge waived for Online Payment!
      </div>
    )}
    <hr className="my-2" />
    <div className="flex justify-between text-base font-bold text-secondary">
      <span>Total Amount to Pay:</span>
      <span>Rs {totalToPay.toFixed(2)}</span>
    </div>
  </div>
</div>
<h2 className="font-bold text-xl mb-3">
  Payment Method
</h2>
<label className="flex gap-2">
  <input
  type="radio"
  checked={payment==="COD"}
  onChange={()=>setPayment("COD")}
  />
  Cash On Delivery

</label>

<br/>
<label className="flex gap-2">
  <input
  type="radio"
  checked={payment==="Stripe"}
  onChange={()=>setPayment("Stripe")}
  />
  Online Payment
</label>
<button
onClick={completeOrder}
className="w-full bg-secondary hover:bg-green-700 text-white py-3 rounded-xl mt-5">
  Confirm Order
</button>

</div>
</div>
)

}


export default CompleteOrder;