const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const sendOTPEmail = require("../../utils/sendEmail");
const rateLimit = require("express-rate-limit");
const router = express.Router();

// Rate limit configuration
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    message: "Too many login attempts from this IP, please try again later.",
  },
});

const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    message: "Too many OTP requests from this IP, please try again later.",
  },
});

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

let pendingLogins = {}; // Store for login OTPs
const JWT_SECRET = process.env.JWT_SECRET; // Ensure this is set in your environment

// Login route to request OTP with rate limiting
router.post("/login", loginLimiter, async (req, res) => {
  const { email } = req.body;

  // Check if the user exists
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    return res.status(400).json({ message: "User not found. Please sign up first." });
  }

  const otp = generateOTP();
  const otpHash = await bcrypt.hash(otp, 10);

  // Save OTP details for verification
  pendingLogins[email] = {
    email,
    otpHash,
    otpExpiration: Date.now() + 10 * 60 * 1000, // OTP expires in 10 minutes
  };

  try {
    await sendOTPEmail(email, otp); // Send OTP to user's email
    res.status(200).json({ message: "OTP sent to email, please verify to log in." });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP", error });
  }
});

// Verify OTP route with rate limiting
router.post("/verify-login-otp", otpLimiter, async (req, res) => {
  const { email, otp } = req.body;
  const pendingUser = pendingLogins[email];

  if (!pendingUser) {
    return res.status(400).json({ message: "No OTP request found. Please request login OTP again." });
  }

  // Check OTP expiration
  if (Date.now() > pendingUser.otpExpiration) {
    delete pendingLogins[email]; // Clean up expired OTP
    return res.status(400).json({ message: "OTP has expired. Please request a new one." });
  }

  // Verify OTP
  const isMatch = await bcrypt.compare(otp, pendingUser.otpHash);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  try {
    // Retrieve user and generate new token
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found. Please sign up first." });
    }
    
    delete pendingLogins[email]; // Remove OTP record

    // Generate a new token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "30d" });
    
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});

// Logout route
router.post("/logout", (req, res) => {
  try {
    // Clear the token on the client-side or in cookies
    res.clearCookie("token"); // If token is stored in a cookie
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error logging out", error });
  }
});

module.exports = router;