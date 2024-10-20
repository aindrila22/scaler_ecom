const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  otpHash: { type: String },
  isLoggedIn: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);
module.exports = User;