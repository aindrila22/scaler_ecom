const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  resizedUrl: String,
  color: String,
  finish: String,
  material: String,
  model: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Image", ImageSchema);
