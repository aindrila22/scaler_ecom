const express = require("express");
const Stripe = require("stripe");
const { Order } = require("../models/order");
const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/checkout", async (req, res) => {
  const { finish, material, color, totalPrice, model, user, imageUrl } = req.body;
  console.log(user);
  if (!user || !user._id) {
    return res.status(400).json({ message: "User information is missing" });
  }

  try {
    const deliveryCharge = 100;
    const subtotal = totalPrice;
    const total = totalPrice + deliveryCharge;

    const order = new Order({
      user: user._id,
      details: { finish, material, color, model, imageUrl },
      subtotal,
      deliveryCharge,
      total,
      status: "pending",
    });
    await order.save();

    let customer;
    const existingCustomers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      // Create a new customer if none exists
      customer = await stripe.customers.create({
        email: user.email,
        name: user.fullName,
      });
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer: customer.id,
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `${model} - ${finish} - ${material}`,
              images: [imageUrl],
            },
            unit_amount: subtotal,
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
            fixed_amount: { amount: deliveryCharge, currency: "inr" },
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
