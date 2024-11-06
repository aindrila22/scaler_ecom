const express = require("express");
const Stripe = require("stripe");
const { Order } = require("../models/order");
const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Webhook to handle Stripe events
router.post(
  `/api/webhooks`,
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the successful checkout session completion event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.metadata.order_id;

      try {
        // Update the order status in MongoDB
        await Order.findByIdAndUpdate(orderId, {
          status: "completed",
          billingAddress: session.customer_details.address,
          shippingAddress: session.shipping.address,
        });
        console.log("Order marked as completed:", orderId);
      } catch (err) {
        console.error("Error updating order:", err);
        return res.status(500).send("Internal Server Error");
      }
    }

    res.status(200).send("Received");
  }
);

module.exports = router;
