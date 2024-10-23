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
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error("Error deleting local file:", err);
      }
    });
    const newImage = new Image({ url: result.secure_url });
    await newImage.save();

    res.json({
      success: true,
      message: "File uploaded successfully",
      url: result.secure_url,
      configId: newImage._id,
    });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
});

module.exports = router;
