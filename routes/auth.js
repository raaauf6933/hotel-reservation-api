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
const sendEmail = require("./../helpers/sendEmail");

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

router.post("/admin/request-reset-password", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).send({
      status: "failed",
      code: "USER_NO_FOUND",
      message: "user with given email doesn't exist",
    });

  const token = generateAuthToken({
    _id: user._id,
    username: user.username,
    email: email,
    first_name: user.first_name,
    last_name: user.last_name,
  });

  try {
    sendEmail("RESET_PASSWORD", {
      email,
      user,
      token,
    });
    res.status(200).send({ status: "success", email });
  } catch (error) {
    res.status(400).send({
      status: "failed",
      message: error.message,
    });
  }
});

router.post("/admin/reset-password", async (req, res) => {
  const { id, password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash(password, salt);

  try {
    const result = await User.findByIdAndUpdate(
      id,
      {
        password: newPassword,
      },
      {
        new: true,
      }
    );
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send({
      status: "failed",
      message: error.message,
    });
  }
});

module.exports = router;
