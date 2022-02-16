const express = require("express");
const router = express.Router();
const Bookings = require("../models/bookings/bookings");
const { createBookingReference, getNewStatus } = require("../utils/misc");
const { bookingStatus, bookingType } = require("../utils/enums");
const { createEvent, eventType } = require("../helpers/events");
const { listenerCount } = require("../models/bookings/bookings");

// Get Bookings
router.get("/", async (req, res) => {
  try {
    const booking_results = await Bookings.find();
    res.status(200).send(booking_results);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Get Booking
router.post("/", async (req, res) => {
  const { body } = req;
  try {
    const booking = await Bookings.findById(body.id);
    res.status(200).send(booking);
  } catch (error) {
    // not found
    if (error.kind === "ObjectId") {
      res.status(404).send({
        success: "false",
        message: error.message,
      });
    } else {
      res.status(400).send({
        success: "false",
        message: error.message,
      });
    }
  }
});

router.post("/create_booking", async (req, res) => {
  const { body } = req;

  const booking_reference = createBookingReference();

  // Create Billing

  const createNewBilling = () => {
    const { rooms } = body;
    let total_amount = 0;
    rooms.forEach((room) => {
      total_amount += room.room_amount;
    });

    return total_amount;
  };

  const newBookings = new Bookings({
    ...body,
    booking_reference,
    status: bookingStatus.PENDING,
    booking_type: bookingType.ONLINE,
    billing: {
      sub_total: createNewBilling(),
      total_amount: body.totalAmount,
    },
    events: [createEvent(eventType.BOOKING_CREATED)],
  });

  try {
    await newBookings.save();
    res.status(200).send(newBookings);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/update_booking_status", async (req, res) => {
  const { body } = req;
  const { id, status } = body;

  try {
    const result = await Bookings.findByIdAndUpdate(id, {
      status: getNewStatus(status),
      $push: {
        events: createEvent(eventType.UPDATE_STATUS, {
          status: getNewStatus(status),
          user: "",
        }),
      },
    });

    res.status(200).send(result);
  } catch (error) {
    res.status(400).send({ status: "failed", message: error.message });
  }
});

module.exports = router;
