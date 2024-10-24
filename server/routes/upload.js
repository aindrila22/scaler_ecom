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

router.post("/preview/:configId", upload.single("file"), async (req, res) => {
  try {
    const { configId } = req.params;
    const { color, finish, material, model } = req.body;

    const image = await Image.findById(configId);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "uploads",
    });

    if (!result || !result.secure_url) {
      throw new Error("Failed to upload to Cloudinary");
    }

    await fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error("Error deleting local file:", err);
      }
    });

 
    image.resizedUrl = result.secure_url; 
    image.color = color;  
    image.finish = finish;
    image.material = material;
    image.model = model; 
    await image.save();

    
    return res.json({
      success: true,
      message: "Resized image and configuration saved successfully",
      originalUrl: image.url,
      resizedUrl: image.resizedUrl,
      color: image.color,
      finish: image.finish,
      material: image.material,
      model: image.model,
    });
  } catch (error) {
    console.error("Error saving resized image or config:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

router.get("/preview/:configId", async (req, res) => {
  try {
    const { configId } = req.params;
    
    // Find the image by configId
    const image = await Image.findById(configId);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    // Return the image configuration data
    return res.json({
      success: true,
      message: "Image configuration retrieved successfully",
      originalUrl: image.url,
      resizedUrl: image.resizedUrl,
      color: image.color,
      finish: image.finish,
      material: image.material,
      model: image.model,
    });
  } catch (error) {
    console.error("Error retrieving image configuration:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;
