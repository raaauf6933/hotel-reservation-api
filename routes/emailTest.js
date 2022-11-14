const express = require("express");
const router = express.Router();
const sendEmail = require("./../helpers/sendEmail");
const Bookings = require("../models/bookings/bookings");

router.post("/notify_guest", async (req, res) => {
  try {
    const result = await Bookings.findById(req.body.id);
    console.log(result);
    await sendEmail("PAYMENT_INSUFFICIENT", result);

    res.status(200).json({ result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
