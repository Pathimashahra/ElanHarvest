import express from "express";
import mongoose from "mongoose";
import { stripe } from "./server.js";

const router = express.Router();


// ================= ORDER MODEL =================

const Order =
mongoose.models.Order ||
mongoose.model(
"Order",
new mongoose.Schema(
{
_id:String,

userId:String,

customer:Object,

items:Array,

totalAmount:Number,

paymentMethod:String,

paymentStatus:String,

status:String

},
{
timestamps:true
}
)
);




// ================= CREATE STRIPE SESSION =================


router.post(
"/create-checkout-session",
async(req,res)=>{


try{


const {

userId,

orderId,

items

}=req.body;



console.log(
"STRIPE REQUEST:",
req.body
);




if(!orderId){

return res.json({

success:false,

message:"Order ID missing"

});

}



if(!userId){

return res.json({

success:false,

message:"User ID missing"

});

}




if(!items || items.length===0){

return res.json({

success:false,

message:"Items empty"

});

}




// ================= CALCULATE TOTAL =================


// price is per 100g
// quantity is grams

let totalAmount = 0;


items.forEach((item)=>{


totalAmount += 
(item.price * item.quantity) / 100;


});




// Stripe minimum amount
// LKR 500 minimum for testing

if(totalAmount < 500){

totalAmount = 500;

}




console.log(
"STRIPE TOTAL:",
totalAmount
);





const line_items=[

{

price_data:{

currency:"lkr",


product_data:{

name:"Organic Vegetable Order"

},


// smallest currency unit

unit_amount:
Math.round(totalAmount * 100)

},


quantity:1


}

];





const session =

await stripe.checkout.sessions.create({


payment_method_types:[

"card"

],


mode:"payment",


line_items,



success_url:

`${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,



cancel_url:

`${process.env.CLIENT_URL}/orders`,



metadata:{


orderId:String(orderId),


userId:String(userId)


}



});






res.json({

success:true,

url:session.url

});





}

catch(err){


console.log(
"STRIPE CREATE ERROR:",
err.message
);



res.status(500).json({

success:false,

message:err.message

});


}



});









// ================= VERIFY PAYMENT =================


router.post(
"/verify-session",
async(req,res)=>{


try{


const {

sessionId

}=req.body;




if(!sessionId){

return res.json({

success:false,

message:"Session ID missing"

});

}




const session =

await stripe.checkout.sessions.retrieve(
sessionId
);





if(session.payment_status !== "paid"){


return res.json({

success:false,

message:"Payment not completed"

});

}



const order =

await Order.findById(
session.metadata.orderId
);




if(!order){

return res.json({

success:false,

message:"Order not found"

});

}




order.paymentStatus="Paid";

order.paymentMethod="Online Payment";

order.status="Processing";



await order.save();





res.json({

success:true,

order

});





}

catch(err){


console.log(
"VERIFY ERROR:",
err.message
);



res.status(500).json({

success:false,

message:err.message

});


}



});





export default router;