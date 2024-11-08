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
const stripeWebhook = require("./routes/webhook");

const corsOptions = {
  origin: [process.env.FRONTEND_URL || 'http://localhost:5173'],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

const app = express();
app.use(cors(corsOptions));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Individual JSON parsing middleware for each route
app.use("/auth", express.json(), authRoutes);
app.use("/auth", express.json(), userRoutes);
app.use("/auth", express.json(), loginRoutes);
app.use("/file", express.json(), uploadRoutes);
app.use("/api", express.json(), checkoutRoutes);
app.use("/api", express.json(), orderRoutes);

// Webhook route with raw body parser for Stripe
app.use(
  "/api/stripe",
  bodyParser.raw({ type: "application/json" }), // Raw parser for Stripe
  stripeWebhook
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});