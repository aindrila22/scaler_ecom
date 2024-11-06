require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth/register");
const loginRoutes = require("./routes/auth/login");
const userRoutes = require("./routes/auth/user");
const uploadRoutes = require("./routes/upload");
const checkoutRoutes = require("./routes/checkout");
const orderRoutes = require("./routes/order");
const stripeWebhook = require("./routes/webhook");  // Adjusted name for clarity

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());  // Apply globally for non-webhook routes

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Non-webhook routes
app.use("/auth", authRoutes);
app.use("/auth", userRoutes);
app.use("/auth", loginRoutes);
app.use("/file", uploadRoutes);
app.use("/api", checkoutRoutes);
app.use("/api", orderRoutes);

// Webhook route with raw body parser for Stripe
app.use("/api/stripe", stripeWebhook);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
