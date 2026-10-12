const mongoose = require("mongoose");
const Order = require("../models/Order");
const MenuItem = require("../models/MenuItem");

// Which statuses an order may move to from its current status
const NEXT_STATUS = {
  Pending: ["Preparing", "Cancelled"],
  Preparing: ["Ready"],
  Ready: ["Served"],
  Served: [],
  Cancelled: [],
};

// POST /api/orders  body: { items: [{ menuItem: "<id>", quantity: 2 }] }
const createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order must contain items" });
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const entry of items) {
      if (!mongoose.isValidObjectId(entry.menuItem)) {
        return res.status(400).json({ message: "Invalid menu item ID" });
      }

      if (
        !Number.isInteger(entry.quantity) ||
        entry.quantity < 1 ||
        entry.quantity > 50
      ) {
        return res
          .status(400)
          .json({ message: "Quantity must be a whole number from 1 to 50" });
      }

      const menuItem = await MenuItem.findById(entry.menuItem);

      if (!menuItem) {
        return res.status(400).json({ message: "A menu item was not found" });
      }

      // The server rejects items the manager marked unavailable
      if (!menuItem.available) {
        return res
          .status(400)
          .json({ message: `${menuItem.name} is currently unavailable` });
      }

      // The total is calculated here from database prices. We never trust a
      // total or price sent by the app, because anyone can edit a request
      // and send a fake low price.
      totalAmount += menuItem.price * entry.quantity;

      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        quantity: entry.quantity,
        price: menuItem.price,
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
    });

    res.status(201).json(order);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({ message: "Failed to place order" });
  }
};

// GET /api/orders/my  (the logged-in customer's own orders)
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch your orders" });
  }
};

// GET /api/orders  (manager sees all orders)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// PATCH /api/orders/:id/status  body: { status: "Preparing" }
const updateOrderStatus = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const { status } = req.body;

    if (!Object.keys(NEXT_STATUS).includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // A customer may only cancel their own order; everything else is manager only
    if (req.user.role !== "manager") {
      const isOwner = order.user.toString() === req.user._id.toString();
      if (!isOwner || status !== "Cancelled") {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    if (!NEXT_STATUS[order.status].includes(status)) {
      return res.status(400).json({
        message: `Cannot change status from ${order.status} to ${status}`,
      });
    }

    order.status = status;
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update order status" });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};