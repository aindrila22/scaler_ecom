const express = require("express");
const { Order } = require("../models/order");
const router = express.Router();

// Get all orders
router.get("/orders", async (req, res) => {
  try {
      const orders = await Order.find().populate("user");

      if (!orders || orders.length === 0) {
          return res.status(404).json({ message: "No orders found" });
      }

      res.json(orders);
  } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to retrieve orders" });
  }
});

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

  const getOrderSums = async (req, res) => {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
  
      // Calculate total of paid orders from the past week
      const lastWeekSum = await Order.aggregate([
        {
          $match: {
            status: "completed", // Adjust status filter based on your data
            createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 7)) },
          },
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$total" },
          },
        },
      ]);
      //console.log("Last Week Sum Result:", lastWeekSum);
  
      // Calculate total of paid orders from the past month
      const lastMonthSum = await Order.aggregate([
        {
          $match: {
            status: "completed", // Adjust status filter based on your data
            createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) },
          },
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$total" },
          },
        },
      ]);
      //console.log("Last Month Sum Result:", lastMonthSum);
  
      // Calculate total of paid orders from today
      const todaySum = await Order.aggregate([
        {
          $match: {
            status: "completed", // Adjust status filter based on your data
            createdAt: { $gte: startOfDay },
          },
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$total" },
          },
        },
      ]);
      //console.log("Today Sum Result:", todaySum);
  
      res.json({
        lastWeekSum: lastWeekSum[0]?.totalAmount || 0,
        lastMonthSum: lastMonthSum[0]?.totalAmount || 0,
        todaySum: todaySum[0]?.totalAmount || 0,
      });
    } catch (error) {
      console.error("Error calculating order sums:", error);
      res.status(500).json({ message: "Failed to calculate order sums" });
    }
  };

  
  
  // Define the route
  router.get("/order-sums", getOrderSums);

module.exports = router;