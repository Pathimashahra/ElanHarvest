import express from "express";
import mongoose from "mongoose";

const cartRouter = express.Router();

const cartItemSchema = new mongoose.Schema({
  productId: String,
  name: String,
  image: String,
  price: Number,
  quantity: Number,
  farmerId: String,
});


const cartSchema = new mongoose.Schema({
   _id: String,
  userId: String,
  items: [
    cartItemSchema
  ]
},
{
  timestamps:true
});


cartSchema.pre("save", async function () {
  if (this.isNew && !this._id) {
    const Cart = mongoose.models.Cart;
    const carts = await Cart.find({}, "_id");
    let maxNum = 0;
    carts.forEach((cart)=>{
      if(cart._id?.startsWith("ca")){
        const num = parseInt(
          cart._id.substring(2)
        );

        if(num > maxNum){
          maxNum = num;
        }
      }
    });

    this._id =
      `ca${String(maxNum + 1).padStart(4,"0")}`;
  }

});


const Cart =
mongoose.models.Cart ||
mongoose.model(
  "Cart",
  cartSchema
);


cartRouter.get("/:userId", async(req,res)=>{
  try{
    const cart =
    await Cart.findOne({
      userId:req.params.userId
});


res.json(
  cart || {items:[]}
);


}catch(error){

res.status(500).json({
 success:false,
 message:error.message
});
}
});


cartRouter.post("/add", async(req,res)=>{
  try{
    const {
      userId,
      product
}=req.body;


let cart =
await Cart.findOne({
 userId
});

if(!cart){
 cart = new Cart({
  userId,
  items:[]
 });
}

if (cart.items.length > 0) {
  const existingFarmerId = cart.items[0].farmerId;
  if (existingFarmerId && product.farmerId && existingFarmerId !== product.farmerId) {
    return res.json({
      success: false,
      message: "You can only add products from one farmer to the cart at a time. Please clear your cart or complete the current order before adding products from another farmer."
    });
  }
}


cart.items.push(product);
await cart.save();
res.json({
  success:true,
  cart
});

}catch(error){
  res.status(500).json({
    success:false,
    message:error.message
  });
}

});


cartRouter.put("/update",async(req,res)=>{
  try{
    const {
      userId,
      productId,
      quantity
    }=req.body;

const cart =
await Cart.findOne({
userId
});


cart.items =
cart.items.map((item)=>

item.productId === productId ?
{
...item._doc,
quantity
}
:
item
);

await cart.save();
res.json(cart);
}catch(error){
  res.status(500).json({
    success:false,
    message:error.message
  });
}

});

cartRouter.delete("/remove",async(req,res)=>{
  try{
    const {
      userId,
      productId
    }=req.body;

const cart =
await Cart.findOne({
userId
});


cart.items =
cart.items.filter(
(item)=>
item.productId !== productId
);

await cart.save();
res.json(cart);
}catch(error){
  res.status(500).json({
    success:false,
    message:error.message
});

}

});

cartRouter.delete("/clear",async(req,res)=>{
  try{
    const {
      userId
    }=req.body;

await Cart.findOneAndDelete({
userId
});

res.json({
  success:true,
  message:"Cart cleared successfully"
});

}catch(error){
  res.status(500).json({
    success:false,
    message:error.message
  });
}

});


export default cartRouter;