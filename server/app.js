require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
//const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth/register");
const loginRoutes = require("./routes/auth/login");
const userRoutes = require("./routes/auth/user");
const uploadRoutes = require("./routes/upload");
const checkoutRoutes = require("./routes/checkout");
const orderRoutes = require("./routes/order");
const Stripe = require("stripe");
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

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_a3fd07db77a4b2131be4d42c95594b8529cf453d79698746f24e4ff7bfde3d35";

app.post('/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(request.rawBody, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const orderId = session.metadata.order_id;
      console.log("Session:", session);
      console.log("Order ID:", orderId);

      try {
        await Order.findByIdAndUpdate(orderId, {
          status: "completed",
          billingAddress: session.customer_details.address,
          shippingAddress: session.shipping.address,
        });
        console.log("Order marked as completed:", orderId);
      } catch (err) {
        console.error("Error updating order:", err);
        return response.status(500).json({ error: "Internal Server Error" });
      }
      break;

    // Handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
      break;
  }

  // Acknowledge receipt of the event
  response.status(200).send();
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
