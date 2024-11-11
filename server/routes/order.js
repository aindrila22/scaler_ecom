const express = require("express");
const { Order } = require("../models/order");
const mongoose = require("mongoose");
const router = express.Router();

// Get all orders
router.get("/orders", async (req, res) => {
  try {
      const orders = await Order.find()
          .populate("user")
          .sort({ createdAt: -1 }); // Sorts by `createdAt` in descending order

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
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order ID format" });
    }
  
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


  router.patch("/orders/:id/status", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    // Check if the provided status is valid
    const validStatuses = ["awaiting_shipment", "fulfilled", "shipped"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
  
    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { deliveryStatus : status },
        { new: true }
      );
  
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      res.json({ message: "Order status updated successfully", order: updatedOrder });
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Failed to update order status" });
    }
  });
  
  router.get("/orders/user/:userId", async (req, res) => {
    const { userId } = req.params;
  
    try {
      const userOrders = await Order.find({ user: userId }).sort({ createdAt: -1 });
  
      if (!userOrders || userOrders.length === 0) {
        return res.status(404).json({ message: "No orders found for this user" });
      }
  
      res.json(userOrders);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      res.status(500).json({ message: "Failed to retrieve user orders" });
    }
  });
  
module.exports = router;