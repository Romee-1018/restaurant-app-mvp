const mongoose = require("mongoose");
const Reservation = require("../models/Reservation");
const Table = require("../models/Table");

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/; // HH:mm (24 hour)

// POST /api/reservations  body: { table: "<tableId>", date, time, guests }
const createReservation = async (req, res) => {
  try {
    const { table, date, time, guests } = req.body;

    if (!table || !date || !time || guests === undefined) {
      return res
        .status(400)
        .json({ message: "Table, date, time and guests are required" });
    }

    if (!mongoose.isValidObjectId(table)) {
      return res.status(400).json({ message: "Invalid table ID" });
    }

    if (!DATE_PATTERN.test(date) || !TIME_PATTERN.test(time)) {
      return res
        .status(400)
        .json({ message: "Date must be YYYY-MM-DD and time must be HH:mm" });
    }

    if (!Number.isInteger(guests) || guests < 1) {
      return res
        .status(400)
        .json({ message: "Guests must be a whole number of at least 1" });
    }

    const tableDoc = await Table.findById(table);
    if (!tableDoc) {
      return res.status(404).json({ message: "Table not found" });
    }

    // Seating capacity check
    if (guests > tableDoc.seats) {
      return res.status(400).json({
        message: `Table ${tableDoc.tableNumber} seats only ${tableDoc.seats} guests`,
      });
    }

    // Availability check: same table, same date and time (declined ones do not block)
    const clash = await Reservation.findOne({
      table,
      date,
      time,
      status: { $ne: "Declined" },
    });

    if (clash) {
      return res
        .status(409)
        .json({ message: "This table is already booked for that date and time" });
    }

    const reservation = await Reservation.create({
      user: req.user._id,
      table,
      date,
      time,
      guests,
    });

    res.status(201).json(reservation);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({ message: "Failed to create reservation" });
  }
};

// GET /api/reservations/my  (the logged-in customer's own reservations)
const getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate("table", "tableNumber seats")
      .sort({ date: 1, time: 1 });
    res.status(200).json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch your reservations" });
  }
};

// GET /api/reservations  (manager sees all reservations)
const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("user", "name email")
      .populate("table", "tableNumber seats")
      .sort({ date: 1, time: 1 });
    res.status(200).json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch reservations" });
  }
};

// PATCH /api/reservations/:id  body: { status: "Accepted" | "Declined" }  (manager only)
const updateReservation = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid reservation ID" });
    }

    const { status } = req.body;

    if (!["Accepted", "Declined"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Status must be Accepted or Declined" });
    }

    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    reservation.status = status;
    await reservation.save();

    res.status(200).json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update reservation" });
  }
};

module.exports = {
  createReservation,
  getMyReservations,
  getAllReservations,
  updateReservation,
};