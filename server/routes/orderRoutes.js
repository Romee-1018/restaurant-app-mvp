
const express = require("express");
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect, managerOnly } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);
router.get("/", protect, managerOnly, getAllOrders);
router.patch("/:id/status", protect, updateOrderStatus);

module.exports = router;
