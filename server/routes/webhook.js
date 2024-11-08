require("dotenv").config();
const express = require("express");
const Stripe = require("stripe");
const { Order } = require("../models/order");
const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;
  try {
    // Use `request.body` directly because `express.raw()` provides the exact raw payload Stripe needs
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
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

module.exports = router;


