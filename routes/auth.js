const express = require("express");
const router = express.Router();
const Bookings = require("./../models/bookings/bookings");
const User = require("./../models/users");
const { generateAuthToken } = require("./../utils/misc");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const {
  bookingStatus: { PENDING, CONFIRMED },
} = require("./../utils/enums");

// Client Auth
router.post("/client", async (req, res) => {
  const { body } = req;
  const { booking_reference, email } = body;

  try {
    const result = await Bookings.findOne({
      booking_reference,
      "guest.email": email,
    });
    if (!result || ![PENDING, CONFIRMED].includes(result.status))
      throw { message: "invalid credentials" };

    const token = generateAuthToken(_.pick(result, ["_id"]));

    res.status(200).send({ token });
  } catch (error) {
    res.status(400).send({ status: "failed", message: error.message });
  }
});

// Admin Auth
router.post("/admin", async (req, res) => {
  const { username, password } = req.body;

  let user = await User.findOne({ username });
  if (!user)
    return res
      .status(400)
      .send({ status: "failed", message: "Invalid email or password." });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    return res
      .status(400)
      .send({ status: "failed", message: "Invalid email or password." });

  const token = generateAuthToken({
    _id: user._id,
    username: user.username,
    first_name: user.first_name,
    last_name: user.last_name,
  });
  res.status(200).send({ status: "success", token });
});

module.exports = router;
