const Table = require("../models/Table");
const Reservation = require("../models/Reservation");

// GET /api/tables  or  GET /api/tables?date=2026-10-20&time=19:30
// With date and time, each table also says whether it is free at that slot.
const getTables = async (req, res) => {
  try {
    const { date, time } = req.query;

    const tables = await Table.find().sort({ tableNumber: 1 });

    let bookedIds = [];
    if (date && time) {
      const booked = await Reservation.find({
        date,
        time,
        status: { $in: ["Pending", "Accepted"] },
      }).select("table");
      bookedIds = booked.map((r) => r.table.toString());
    }

    const result = tables.map((t) => ({
      _id: t._id,
      tableNumber: t.tableNumber,
      seats: t.seats,
      available: !bookedIds.includes(t._id.toString()),
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch tables" });
  }
};

module.exports = { getTables };