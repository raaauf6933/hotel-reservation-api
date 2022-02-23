const express = require("express");
const router = express.Router();
const Bookings = require("../models/bookings/bookings");
const { bookingStatus } = require("./../utils/enums");
const moment = require("moment-timezone");

router.get("/dashboard", async (req, res) => {
  var today = new Date(moment.tz("Asia/Manila").format());
  var startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  try {
    const new_booking = await Bookings.find({
      createdAt: { $gte: startOfToday },
    });
    const pending_booking = await Bookings.find({
      status: bookingStatus.PENDING,
    });
    const confirmed_booking = await Bookings.find({
      status: bookingStatus.CONFIRMED,
    });

    res.status(200).send({
      new_booking: new_booking.length,
      pending_booking: pending_booking.length,
      confirmed_booking: confirmed_booking.length,
      sales_today: 5600.53,
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
