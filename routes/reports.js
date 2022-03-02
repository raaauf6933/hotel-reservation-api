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

router.post("/extract_report", async (req, res) => {
  const { status, sort_by, from, to } = req.body;

  const format_from = new Date(
    moment(from).tz("Asia/Manila").startOf("day").format()
  );

  var startFrom = new Date(
    format_from.getFullYear(),
    format_from.getMonth(),
    format_from.getDate(),
    format_from.getHours(),
    format_from.getMinutes(),
    format_from.getSeconds()
  );

  const format_to = new Date(
    moment(to).tz("Asia/Manila").endOf("day").format()
  );
  var startTo = new Date(
    format_to.getFullYear(),
    format_to.getMonth(),
    format_to.getDate(),
    format_to.getHours(),
    format_to.getMinutes(),
    format_to.getSeconds()
  );

  const getStatus = () => {
    switch (status) {
      case "PENDING":
        return {
          status: "PENDING",
          createdAt: {
            $gte: startFrom,
            $lt: startTo,
          },
        };
        break;
      case "CONFIRMED":
        return {
          status: "CONFIRMED",
          createdAt: {
            $gte: startFrom,
            $lt: startTo,
          },
        };
      case "CHECK_IN":
        return {
          status: "CHECK_IN",
          createdAt: {
            $gte: startFrom,
            $lt: startTo,
          },
        };
      case "CHECK_OUT":
        return {
          status: "CHECK_OUT",
          createdAt: {
            $gte: startFrom,
            $lt: startTo,
          },
        };
      default:
        return {
          createdAt: {
            $gte: startFrom,
            $lt: startTo,
          },
        };
    }
  };

  const getSort = () => {
    switch (sort_by) {
      case "BOOKING_DATE":
        return {
          createdAt: 1,
        };
      case "CHECK_IN":
        return {
          check_in: 1,
        };
      case "CHECK_OUT":
        return {
          check_out: 1,
        };
      default:
        return {};
    }
  };

  try {
    const result = await Bookings.find(getStatus()).sort(getSort());
    res.send(result);
  } catch (error) {
    res.status(400).send({ status: "failed", message: error.message });
  }
});

module.exports = router;
