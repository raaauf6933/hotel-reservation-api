const express = require("express");
const router = express.Router();
const Bookings = require("./../models/bookings/bookings");
const { generateAuthToken } = require("./../utils/misc");
const _ = require("lodash");

// Client Auth
router.post("/client", async (req, res) => {
  const { body } = req;
  const { booking_reference, email } = body;

  try {
    const result = await Bookings.findOne({
      booking_reference,
      "guest.email": email,
    });
    if (!result) throw { message: "invalid credentials" };

    const token = generateAuthToken(
      _.pick(result, [
        "_id",
        "booking_reference",
        "check_in",
        "check_out",
        "guest",
        "rooms",
        "status",
        "createdAt",
        "billing",
        "expiration_date",
      ])
    );

    res.status(200).send({ token });
  } catch (error) {
    res.status(400).send({ status: "failed", message: error.message });
  }
});

// Admin Auth
router.post("/admin", async (req, res) => {});

module.exports = router;
