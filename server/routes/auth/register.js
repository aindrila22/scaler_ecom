// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const sendOTPEmail = require("../../utils/sendEmail");
const router = express.Router();

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// Temporary store for unverified users (can use Redis in production)
let pendingUsers = {};

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";


// Signup route
router.post("/signup", async (req, res) => {
  const { fullName, email } = req.body;
  console.log(fullName, email);

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const otp = generateOTP();
  const otpHash = await bcrypt.hash(otp, 10);

  pendingUsers[email] = {
    fullName,
    email,
    otpHash,
  };

  try {
    await sendOTPEmail(email, otp);
    res
      .status(200)
      .json({ message: "OTP sent to email, please verify to complete signup" });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP", error });
  }
});

// Verify OTP route
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  // Check if the user is in the pendingUsers store
  const pendingUser = pendingUsers[email];
  if (!pendingUser) {
    return res
      .status(400)
      .json({ message: "No signup found, please sign up again." });
  }

  const isMatch = await bcrypt.compare(otp, pendingUser.otpHash);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  const newUser = new User({
    fullName: pendingUser.fullName,
    email: pendingUser.email,
  });

  try {
    await newUser.save();
    delete pendingUsers[email];

    // Create JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Send back the user data and token
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error saving user", error });
  }
});

module.exports = router;
