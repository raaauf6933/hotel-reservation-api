const Bookings = require("./../../models/bookings/bookings");
const SiteSettings = require("./../../models/site_settings");
const { createEvent, eventType } = require("./../../helpers/events");
const moment = require("moment-timezone");

module.exports = async (req, res) => {
  const { id: bookingId, amenity_id, qty, type } = req.body;

  const { id, rate, name } = JSON.parse(amenity_id);

  const user_name = `${req.user.first_name} ${req.user.last_name}`;

  try {
    const booking = await Bookings.findById(bookingId);

    const computedNewItem = rate * qty;
    const newTotalAmount = booking.billing.total_amount + computedNewItem;

    const newAdditional = computedNewItem + booking.billing.additional_total;

    const result = await Bookings.findByIdAndUpdate(bookingId, {
      $set: {
        "billing.additional_total": parseFloat(newAdditional),
        "billing.total_amount": parseFloat(newTotalAmount),
      },
      $push: {
        additionals: {
          amenity_id: id,
          name,
          rate,
          qty,
          created: moment.tz("Asia/Manila").format(),
        },
        events: createEvent(eventType.ADD_AMENITY, {
          qty,
          type: name,
          user: user_name,
        }),
      },
    });

    if(type && type === "guest"){
      const settings = await SiteSettings.find();
      const settingsId = settings[0]._id;
      const noNotif =  settings[0].noNotif

      await SiteSettings.findByIdAndUpdate(settingsId, {
        isViewedNotif: false,
        noNotif: noNotif + 1
      });
    }

    res.status(200).send(result);
  } catch (error) {
    res.status(400).send({ status: "failed", message: error.message });
  }
};
