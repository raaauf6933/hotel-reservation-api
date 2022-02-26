const express = require("express");
const router = express.Router();
const Bookings = require("../models/bookings/bookings");
const {
  createBookingReference,
  getNewStatus,
  IsJsonString,
} = require("../utils/misc");
const { bookingStatus, bookingType } = require("../utils/enums");
const { createEvent, eventType } = require("../helpers/events");
const sendEmail = require("./../helpers/mail");
const upload = require("../helpers/uploadImage");
const uploadReceiptImage = require("../controller/uploadReceiptImage");
const multer = require("multer");
const moment = require("moment");
const getPaymentAmount = require("../controller/bookings/getPaymentAmount");
const {
  updatePending,
  updateConfirmed,
  updateCheckIn,
} = require("./../controller/bookings/updateBookingStatus");

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
    const payment_amount = await getPaymentAmount(body.id);
    const total_balance =
      parseFloat(booking?.billing.total_amount) - parseFloat(payment_amount);

    res.status(200).send({
      ...booking._doc,
      payment_amount: payment_amount,
      total_balance: total_balance,
    });
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
    payment: [],
    createdAt: moment.tz("Asia/Manila").format(),
    updatedAt: moment.tz("Asia/Manila").format(),
  });

  try {
    let result = await newBookings.save();
    sendEmail(result, { type: bookingStatus.PENDING });
    res.status(200).send(newBookings);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

router.post("/update_booking_status", async (req, res) => {
  const { body } = req;
  const { id, status, paymentAmount } = body;

  try {
    let result;
    switch (status) {
      case bookingStatus.PENDING:
        result = await updatePending({ id, status, paymentAmount });
        break;
      case bookingStatus.CONFIRMED:
        result = await updateConfirmed({ id, status, paymentAmount });
        break;
      case bookingStatus.CHECK_IN:
        result = await updateCheckIn({ id, status, paymentAmount });
        break;
      default:
        break;
    }

    res.status(200).send(result);
  } catch (error) {
    if (IsJsonString(error.message)) {
      res.status(400).send({ status: "failed", ...JSON.parse(error.message) });
    } else {
      res.status(400).send({ status: "failed", message: error.message });
    }
  }
});

router.post(
  "/upload_receipt",
  async (req, res, next) => {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      } else if (err) {
        return res.status(400).json({
          success: false,
          error: "Invalid file format. Please use valid image file (png/jpg)",
        });
      }
      next();
    });
  },

  uploadReceiptImage
);

module.exports = router;
