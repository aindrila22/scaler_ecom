const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const sendOTPEmail = require("../../utils/sendEmail");
const router = express.Router();

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

let pendingLogins = {}; // Store for login OTPs
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Login route to request OTP
router.post("/login", async (req, res) => {
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
    otpExpiration: Date.now() + 10 * 60 * 1000 // OTP expires in 10 minutes
  };

  try {
    await sendOTPEmail(email, otp); // Send OTP to user's email
    res.status(200).json({ message: "OTP sent to email, please verify to log in." });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP", error });
  }
});

// Verify OTP route
router.post("/verify-login-otp", async (req, res) => {
  const { email, otp } = req.body;
console.log(email, otp);
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
  console.log(isMatch);

  try {
    // Retrieve user and generate new token
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found. Please sign up first." });
    }
    console.log(user)
    delete pendingLogins[email]; // Remove OTP record

    // Generate a new token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "30d" });
    console.log(token)
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
    // Optionally clear the token on the client-side or in cookies
    res.clearCookie("token"); // If token is stored in a cookie
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error logging out", error });
  }
});

module.exports = router;