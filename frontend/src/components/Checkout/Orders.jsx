import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../../App";
import { useNavigate } from "react-router-dom";
const Orders = () => {
  const user =
    JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;
  const [orders,setOrders] = useState([]);

  useEffect(()=>{
    fetchOrders();
  },[]);

const navigate = useNavigate();
  const fetchOrders = async()=>{
    try{
      const res = await axios.get(
        `${backendUrl}/api/orders/user/${userId}`
      );


      if(res.data.success){
        setOrders(res.data.orders);
      }

    }catch(err){
      console.log(err);
    }
  };


  const payOrder = async(order)=>{
    try{


      const res = await axios.post(

        `${backendUrl}/api/payment/create-checkout-session`,

        {

          userId:order.userId,

          orderId:order._id,

          customer:order.customer,

          items:order.items,

          totalAmount:order.totalAmount

        }

      );



      if(res.data.success){


        window.location.href =
        res.data.url;


      }


    }catch(err){

      console.log(err);

      alert(
        "Payment failed"
      );

    }


  };





return (

<div className="min-h-screen bg-gray-100 p-6">


<div className="max-w-6xl mx-auto">


<h1 className="text-3xl font-bold text-green-700 mb-6">

My Orders

</h1>




{
orders.length===0 ?


(
<p className="text-gray-600">
No orders found
</p>
)


:

(

<div className="space-y-6">


{

orders.map((order)=>(


<div

key={order._id}

className="bg-white rounded-2xl shadow p-6"



>


<div className="flex justify-between items-center mb-4">


<div>

<h2 className="font-bold text-xl">

Order ID :
{order._id}

</h2>


<p className="text-gray-600">

Date :
{
new Date(
order.createdAt
)
.toLocaleDateString()

}

</p>


</div>




<div>


<span

className="bg-green-100 text-green-700 px-4 py-2 rounded-full"

>

{order.status}

</span>


</div>


</div>





{/* Products */}


<div className="border-t pt-4">


<h3 className="font-semibold mb-3">

Products

</h3>



{

order.items.map((item)=>(


<div

key={item.productId}

className="flex justify-between border-b py-3"


>


<div className="flex gap-3">


<img

src={item.image}

className="w-16 h-16 rounded-lg object-cover"

/>


<div>


<p className="font-semibold">

{item.name}

</p>


<p className="text-gray-500">

Qty :

{
item.quantity>=1000

?

`${item.quantity/1000}kg`

:

`${item.quantity}g`

}

</p>


</div>


</div>




<p className="font-bold text-green-700">

Rs {item.price * item.quantity /100}

</p>



</div>


))


}



</div>






{/* Amount */}


<div className="mt-4 space-y-2">


<div className="flex justify-between">

<p>Total Amount</p>

<p className="font-bold">

Rs {order.totalAmount}

</p>

</div>



<div className="flex justify-between">

<p>Payment Status</p>

<p className="font-semibold">

{
order.paymentStatus === "Paid"

?

"Paid"

:

order.paymentMethod === "COD"

?

"Cash on Delivery"

:

"Payment Pending"

}

</p>

</div>



</div>

{order.message && (
  <div className="bg-blue-50 border border-blue-200 text-blue-700 p-3 rounded-xl text-sm mt-3">
    <strong>My Note:</strong> {order.message}
  </div>
)}







{/* Pay Button */}
{
order.status==="Confirmed"
&&
order.paymentStatus==="Pending"
&&
(
<button

onClick={()=>navigate(
`/completeorder/${order._id}`
)}

className="w-full mt-5 bg-green-600 text-white py-3 rounded-xl"

>

Pay Now

</button>

)
}







{

order.status==="Pending Farmer Confirmation"

&&

(


<div className="mt-5 bg-yellow-100 p-3 rounded-xl text-center">


Waiting for farmer confirmation...


</div>


)


}






{

order.status==="Rejected"

&&

(


<div className="mt-5 bg-red-100 text-red-700 p-3 rounded-xl text-center">


Farmer rejected this order


</div>


)


}






</div>


))


}


</div>


)


}


</div>


</div>

);


};


export default Orders;