const express = require("express");
const {
  createReservation,
  getMyReservations,
  getAllReservations,
  updateReservation,
} = require("../controllers/reservationController");
const { protect, managerOnly } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, createReservation);
router.get("/my", protect, getMyReservations);
router.get("/", protect, managerOnly, getAllReservations);
router.patch("/:id", protect, managerOnly, updateReservation);

module.exports = router;