import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  userId: { type: String, required: true, ref: "user" },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, requiered: true },
  offerPrice: { type: Number, required: true },
  image: { type: Array, requiered: true },
  category: { type: String, required: true },
  date: { type: Number, requiered: true },
});

const Product =
  mongoose.model.product || mongoose.model("product", productSchema);

export default Product;
