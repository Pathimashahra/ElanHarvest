import React, { useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../../App";
import { useNavigate, useSearchParams } from "react-router-dom";
import { clearCart } from "../../api/cartApi";

const Success = () => {

  const navigate = useNavigate();
  const [params] = useSearchParams();

  const sessionId = params.get("session_id");

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;


  useEffect(() => {

    const verifyPayment = async () => {

      try {

        const res = await axios.post(
          `${backendUrl}/api/payment/verify-session`,
          {
            sessionId
          }
        );


        if(res.data.success){
          await clearCart(userId);
          alert(
            "Payment Successful"
          );
          navigate("/orders");
        }
        else{
          alert("Payment verification failed");
          navigate("/checkout");
        }
      } catch(err){
        console.log("VERIFY ERROR:", err);
      }
    };

    if(sessionId){
      verifyPayment();
    }

  }, [sessionId, navigate]);


  return (
    <div className="h-screen flex items-center bg-green-100/50 justify-center">

      <h1 className="text-secondary text-2xl font-bold">
        Payment Successful... Redirecting
      </h1>

    </div>
  );
};


export default Success;