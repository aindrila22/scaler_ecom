const express = require("express");
const cloudinary = require("../config/cloudinaryConfig");
const upload = require("../middlewares/upload");
const Image = require("../models/image");
const fs = require("fs");

const router = express.Router();

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "uploads",
    });
    const { width, height } = result;
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error("Error deleting local file:", err);
      }
    });
    const newImage = new Image({ url: result.secure_url, width, height });
    await newImage.save();

    res.json({
      success: true,
      message: "File uploaded successfully",
      url: result.secure_url,
      configId: newImage._id,
      width,
      height,
    });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
});

router.get("/image/:configId", async (req, res) => {
  try {
    const { configId } = req.params;
    const image = await Image.findById(configId);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }
    res.json({
      success: true,
      message: "Image retrieved successfully",
      url: image.url, 
      width: image.width,
      height: image.height,
      createdAt: image.createdAt,
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


module.exports = router;
