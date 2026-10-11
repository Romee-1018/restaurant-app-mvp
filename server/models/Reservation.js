const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      required: true,
    },

    // Stored as text so "same table, same date and time" is easy to compare
    date: {
      type: String, // format: YYYY-MM-DD
      required: true,
    },

    time: {
      type: String, // format: HH:mm (24 hour)
      required: true,
    },

    guests: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: ["Pending", "Accepted", "Declined"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Reservation", reservationSchema);