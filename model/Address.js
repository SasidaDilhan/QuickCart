import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  userId: { type: String, requiered: true },
  fullName: { type: String, requiered: true },
  phoneNumber: { type: String, requiered: true },
  pinCode: { type: String, requiered: true },
  area: { type: String, requiered: true },
  city: { type: String, required: true },
  state: { type: String, requiered: true },
});

const Address =
  mongoose.models.address || mongoose.model("address", addressSchema);

export default Address;
