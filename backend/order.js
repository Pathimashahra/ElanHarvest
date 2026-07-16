import express from "express";
import mongoose from "mongoose";

const router = express.Router();

const orderSchema = new mongoose.Schema(
{
  _id:{
    type:String
  },
  userId:{
    type:String,
    required:true
  },
  customer:{
  name:String,
  phone:String,
  email:String,
  address:String
},
  items:[
    {
      productId:String,
      farmerId:String,
      name:String,
      price:Number,
      quantity:Number,
      image:String
    }
  ],
  paymentMethod:{
    type:String,
    default:"COD"
  },
    cardData:{
    type:Object,
    default:{}
  },
  totalAmount:{
    type:Number,
    required:true
  },
  status:{
  type:String,
  enum:[
    "Pending Farmer Confirmation",
    "Confirmed",
    "Paid",
    "Processing",
    "Shipped",
    "Delivered",
    "Rejected",
    "Cancelled"
  ],
  default:"Pending Farmer Confirmation"
},
  paymentStatus:{
    type:String,
    enum:[
      "Pending",
      "Paid",
      "Failed"
    ],
    default:"Pending"
  },
  message:{
    type:String,
    default:""
  }
},
{
timestamps:true
}
);

orderSchema.pre("save",async function(){
    if(this.isNew && !this._id){
        const lastOrder =await mongoose.models.Order
        .findOne()
        .sort({createdAt:-1});
        let nextNumber=1;
        
        if(lastOrder && lastOrder._id){
            const lastNumber =
            parseInt(
                lastOrder._id.replace("or","")
            );
            nextNumber =
            lastNumber+1;
        }
        this._id =
        `or${String(nextNumber).padStart(4,"0")}`;
    }
});

const Order =
mongoose.models.Order ||
mongoose.model("Order",orderSchema);


router.post("/create",async(req,res)=>{
    try{
        const {items}=req.body;
        for(const item of items){
            if(item.quantity < 250){
                return res.json({
                    success:false,
                    message:"Minimum quantity is 250g"
                });
            }
            
            if(item.quantity > 50000){
                return res.json({
                    success:false,
                    message:"Maximum quantity is 50kg"
                });
            }
        }


const order =
new Order(req.body);
await order.save();
res.json({
    success:true,
    order
});

}catch(err){
    res.json({
        success:false,
        message:err.message
    });
}
});

router.get("/user/:userId",async(req,res)=>{
    try{
        const orders =
        await Order.find({
            userId:req.params.userId
        }).sort({
createdAt:-1
});

res.json({
    success:true,
    orders
});
}catch(err){
    res.json({
        success:false,
        message:err.message
    });
}
});

router.get("/",async(req,res)=>{
    try{
        const orders =
        await Order.find()
        .sort({
            createdAt:-1
        });
        res.json({
            success:true,
            orders
        });
    }catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        });
    }
});

router.put("/update-status/:id",async(req,res)=>{
    try{
        const {status}=req.body;
        const order =
        await Order.findByIdAndUpdate(
            req.params.id,
            {
                status
            },
            {
                new:true
            }
        );
        res.json({
            success:true,
            order
        });
    }catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        });
    }
});

router.get("/farmer/:farmerId",async(req,res)=>{
    try{
        const orders =
        await Order.find({
            "items.farmerId":
            req.params.farmerId
        });
        res.json({
            success:true,
            orders
        });
    }catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        });
}
});

router.put("/cancel/:orderId",async(req,res)=>{
    try{
        const order =await Order.findById(
            req.params.orderId
        );
if(!order){
    return res.json({
        success:false,
        message:"Order not found"
    });
}


if(order.paymentStatus==="Paid"){
    return res.json({
        success:false,
        message:"Paid order cannot be cancelled"
    });
}
order.status="Cancelled";
await order.save();
res.json({
    success:true,
    message:"Order cancelled successfully",
    order
});
}catch(err){
    res.json({
        success:false,
        message:err.message
    });
}
});

router.post("/confirm-payment",async(req,res)=>{
    try{

        const {orderId}=req.body;


        const order = await Order.findById(orderId);


        if(!order){

            return res.json({
                success:false,
                message:"Order not found"
            });

        }


        order.paymentStatus="Paid";

        order.status="Processing";


        await order.save();


        res.json({

            success:true,

            message:"Payment confirmed successfully",

            order

        });


    }catch(err){

        res.json({

            success:false,

            message:err.message

        });

    }
});
router.get("/:id",async(req,res)=>{

const order=await Order.findById(req.params.id);

res.json({
success:true,
order
});

});
router.put("/complete/:id",
async(req,res)=>{


try{


const {
customer,
paymentMethod

}=req.body;




const order =
await Order.findById(
req.params.id
);



if(!order){

return res.json({

success:false,

message:"Order not found"

});

}



order.customer = customer;


order.paymentMethod =
paymentMethod;



if(paymentMethod==="COD"){


order.status="Processing";

order.paymentStatus="Pending";

const itemsPrice = order.items.reduce((sum, item) => sum + (item.price * item.quantity) / 100, 0);
order.totalAmount = itemsPrice + 250;


}

else{

order.status="Confirmed";

order.paymentStatus="Pending";

order.paymentMethod="Online Payment";

const itemsPrice = order.items.reduce((sum, item) => sum + (item.price * item.quantity) / 100, 0);
order.totalAmount = itemsPrice;

}



await order.save();



res.json({

success:true,

order

});



}

catch(err){


res.status(500).json({

success:false,

message:err.message

});


}


});
export default router;