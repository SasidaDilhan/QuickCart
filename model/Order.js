import mongoose from "mongoose";
import { tree } from "next/dist/build/templates/app-page";

const orderSchema = new mongoose.Schema({
  userId: { type: String, requiered: true, ref: "user" },
  items: [
    {
      product: { type: String, required: true, ref: "produc" },
      quantity: { type: Number, requiered: true },
    },
  ],
  ammount: { type: Number, requiered: true },
  address: { type: String, requiered: true },
  status: { type: String, requiered: true, default: "Order Placed" },
  date: { type: Number, requiered: true },
});

const Order = mongoose.model.order || mongoose.model("order", orderSchema);

export default Order;
