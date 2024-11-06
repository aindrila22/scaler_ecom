const express = require("express");
const { Order } = require("../models/order");
const router = express.Router();

router.get("/order/:orderId", async (req, res) => {
    const { orderId } = req.params;
  
    try {
      const order = await Order.findById(orderId).populate("user");
  
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to retrieve order" });
    }
  });

module.exports = router;