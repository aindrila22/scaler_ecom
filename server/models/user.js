const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String },
  email: { type: String, required: true, unique: true },
  otpHash: { type: String },
});

const User = mongoose.model("User", userSchema);
module.exports = User;