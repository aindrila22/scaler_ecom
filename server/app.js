require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const Stripe = require("stripe");

const authRoutes = require("./routes/auth/register");
const loginRoutes = require("./routes/auth/login");
const userRoutes = require("./routes/auth/user");
const uploadRoutes = require("./routes/upload");
const checkoutRoutes = require("./routes/checkout");
const orderRoutes = require("./routes/order");
//const stripeWebhook = require("./routes/webhook");
const { Order } = require("./models/order");

const corsOptions = {
  origin: [process.env.FRONTEND_URL || "http://localhost:5173"],
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

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// Webhook route with raw body parser for Stripe
app.use(
  "/api/stripe/webhooks",
  express.raw({ type: "application/json" }), // Raw parser for Stripe
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
      // Stripe requires the raw body for signature verification
      console.log("webhook body", req.body);
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.metadata.order_id;
      console.log("session", session);
      console.log("orderId", orderId);

      try {
        await Order.findByIdAndUpdate(orderId, {
          status: "completed",
          billingAddress: session.customer_details.address,
          shippingAddress: session.shipping.address,
        });
        console.log("Order marked as completed:", orderId);
      } catch (err) {
        console.error("Error updating order:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }

    res.status(200).json({ received: true });
  }
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
