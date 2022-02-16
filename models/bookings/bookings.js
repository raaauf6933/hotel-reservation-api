const mongoose = require("mongoose");
const { guest, events, rooms, billing, additionals } = require("./types");

const BookingsSchema = new mongoose.Schema(
  {
    booking_reference: {
      type: String,
      required: true,
    },
    check_in: {
      type: String,
      required: true,
    },
    check_out: {
      type: String,
      required: true,
    },
    expiration_date: {
      type: String,
      default: new Date().toString(),
    },
    booking_type: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    guest: guest(),
    events: {
      type: Array,
      default: [events()],
    },
    rooms: rooms(),
    additionals: additionals(),
    billing: {
      type: billing(),
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Bookings", BookingsSchema);
