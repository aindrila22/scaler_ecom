const express = require("express");
const Stripe = require("stripe");
const { Order } = require("../models/order");
const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Updated checkout route to include billing and shipping addresses
router.post("/checkout", async (req, res) => {
  const { finish, material, color, totalPrice, model, user } = req.body;
  console.log(user);

  try {
    // 1. Create the order in MongoDB
    const order = new Order({
      user: user._id,
      details: { finish, material, color, model },
      amount: totalPrice,
      status: "pending",
    });
    await order.save();

    // 2. Create the Stripe checkout session with billing and shipping address collection
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `${model} - ${finish} - ${material}`,
            },
            unit_amount: totalPrice,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/success?order_id=${order._id}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel?order_id=${order._id}`,
      metadata: {
        order_id: order._id.toString(),
      },
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["IN"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 1000, currency: "inr" },
            display_name: "Standard shipping",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 5 },
              maximum: { unit: "business_day", value: 7 },
            },
          },
        },
      ],
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ message: "Failed to initiate checkout" });
  }
});



module.exports = router;