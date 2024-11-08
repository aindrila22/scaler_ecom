require("dotenv").config();
const express = require("express");
const Stripe = require("stripe");
const { Order } = require("../models/order");
const sendOrderEmail = require("../utils/sendOrderEmail");
const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`);
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const orderDate = new Date(event.created * 1000).toLocaleDateString();
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

        try {
          await sendOrderEmail(session, orderId, orderDate);
          res
            .status(200)
            .json({ message: "Order Confirmation send to your email" });
        } catch (emailError) {
          console.error("Error sending email:", emailError);
          return res.status(500).send("Failed to send email");
        }

        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
        break;
    }

    response.status(200).send();
  }
);

module.exports = router;
