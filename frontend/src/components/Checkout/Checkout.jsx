import React, { useEffect, useState } from "react";
import { getCart, clearCart } from "../../api/cartApi";
import axios from "axios";
import { backendUrl } from "../../App";
import { useNavigate } from "react-router-dom";

const Checkout = () => {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchCart();
  }, []);


  const fetchCart = async () => {
    try {
      const res = await getCart(userId);
      setCart(res.data.items || []);
    } catch(err){
      console.log(err);
    }
  };

  const subtotal = cart.reduce((acc,item)=>{
    return acc + (item.price * item.quantity / 100);
  },0);

  const shipping = 250;
  const total = subtotal + shipping;

  const sendOrderRequest = async()=>{
    try{
      if(!cart.length){
        alert("Cart is empty");
        return;
      }

      for(const item of cart){
        if(item.quantity < 250){
          alert(
            `${item.name} minimum quantity is 250g`
          );
          return;
        }


        if(item.quantity > 50000){
          alert(
            `${item.name} maximum quantity is 50kg`
          );
          return;
        }

      }



      const res = await axios.post(
        `${backendUrl}/api/orders/create`,
        {
          userId,
          items:cart,
          totalAmount:total,
          status:
          "Pending Farmer Confirmation",
          paymentStatus:
          "Pending",
          paymentMethod:"Not Selected",
          message: localStorage.getItem("orderMessage") || ""
        }
      );

      if(res.data.success){

        alert(
          "Order request sent to farmer. Please wait for confirmation."
        );


        await clearCart(userId);
        localStorage.removeItem("orderMessage");

        navigate("/orders");

      }
      else{

        alert(res.data.message);

      }

    }catch(err){

      console.log(err);

      alert(
        "Order request failed"
      );

    }

  };

  return (

    <div className="min-h-screen bg-green-100/50 py-8 px-5">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow">

          <h2 className="text-2xl font-bold text-secondary mb-5">
            Order Details
          </h2>

          {
            cart.map((item)=>(

              <div
              key={item.productId}
              className="flex justify-between items-center border-b pb-4 mb-4">

                <div className="flex gap-4">

                  <img
                  src={item.image}
                  className="w-20 h-20 rounded-lg object-cover"
                  />

                  <div>

                    <h3 className="font-semibold">
                      {item.name}
                    </h3>

                    <p className="text-gray-500">

                    Qty :
                    {
                      item.quantity >=1000
                      ?
                      `${item.quantity/1000}kg`
                      :
                      `${item.quantity}g`
                    }

                    </p>
                  </div>

                </div>

                <p className="font-bold text-secondary">
                Rs {item.price * item.quantity /100}
                </p>

              </div>

            ))
          }


        </div>
        <div className="bg-white p-6 rounded-2xl shadow">

          <h2 className="text-2xl font-bold text-secondary mb-5">
            Order Summary
          </h2>
          <div className="space-y-3">

            <div className="flex justify-between">
              <p>Subtotal</p>
              <p>Rs {subtotal}</p>
            </div>

            <div className="flex justify-between">
              <p>Delivery Charge</p>
              <p>Rs {shipping}</p>
            </div>

            <hr/>

            <div className="flex justify-between text-xl font-bold text-secondary">
              <p>Total</p>
              <p>
                Rs {total}
              </p>
            </div>
          </div>

          <div className="mt-6 bg-yellow-100 p-4 rounded-xl">
            <p className="text-sm text-gray-700">

              Your order will be sent to the farmer first.
              Payment and delivery details can be completed
              after farmer confirmation.
            </p>

          </div>

          <button
          onClick={sendOrderRequest}
          className="w-full mt-6 bg-secondary hover:bg-green-700 text-white py-3 rounded-xl font-semibold">
            Send Order Request
          </button>

          <button
          onClick={()=>navigate("/products")}
          className="w-full mt-3 bg-gray-300 hover:bg-gray-400 py-3 rounded-xl font-semibold">
            Continue Shopping
          </button>

        </div>


      </div>


    </div>

  );
};


export default Checkout;