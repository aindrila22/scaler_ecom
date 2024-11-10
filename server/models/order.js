const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  line1: String,
  line2: String,
  city: String,
  state: String,
  postal_code: String,
  country: String,
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  details: {
    finish: String,
    material: String,
    color: String,
    model: String,
    imageUrl: String,
  },
  subtotal: { type: Number, required: true },
  deliveryCharge: { type: Number, required: true },
  total: { type: Number, required: true },
  status: { type: String, default: "pending" },
  deliveryStatus: {
    type: String,
    enum: ["awaiting_shipment", "fulfilled", "shipped"],
    default: "awaiting_shipment",
  },
  billingAddress: addressSchema,
  shippingAddress: addressSchema,
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = { Order };