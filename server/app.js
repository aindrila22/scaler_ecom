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
const webhook = require("./routes/webhook");

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Routes
app.use("/auth", authRoutes);
app.use("/auth", userRoutes);
app.use("/auth", loginRoutes);
app.use("/file", uploadRoutes);
app.use("/api", checkoutRoutes);
app.use("/api", orderRoutes);

// Apply the raw body parser only to the webhook route
app.use("/api/webhooks", express.raw({ type: "application/json" }));
app.use("/api/webhooks", webhook);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
