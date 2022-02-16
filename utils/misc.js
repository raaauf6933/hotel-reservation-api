const crypto = require("crypto");
const { bookingStatus } = require("./enums");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.createBookingReference = () => {
  const date_today = new Date();
  const hash_date_today = crypto
    .createHash("md5")
    .update(date_today.toString())
    .digest("hex");
  return hash_date_today.substring(1, 7).toUpperCase();
};

exports.generateAuthToken = (data) => {
  const token = jwt.sign(data, process.env.jwtPrivateKey);

  return token;
};

exports.getNewStatus = (status) => {
  switch (status) {
    case bookingStatus.PENDING:
      return bookingStatus.CONFIRMED;
    case bookingStatus.CONFIRMED:
      return bookingStatus.CHECK_IN;
    case bookingStatus.CHECK_IN:
      return bookingStatus.CHECK_OUT;
    default:
      break;
  }
};
