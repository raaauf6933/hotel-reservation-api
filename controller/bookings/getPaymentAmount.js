const Bookings = require("../../models/bookings/bookings");

module.exports = async (id) => {
  const booking = await Bookings.findById(id);

  const payment_amount =
    +booking?.payment?.length === 0
      ? 0
      : booking?.payment?.map((e) => e.payment_amount)[0];

  return payment_amount;
};
