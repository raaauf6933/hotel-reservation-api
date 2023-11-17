const Bookings = require("./../../models/bookings/bookings");
const SiteSettings = require("./../../models/site_settings");
const { createEvent, eventType } = require("./../../helpers/events");
const moment = require("moment-timezone");

module.exports = async (req, res) => {
    const {id, additionalId } = req.body;

    const booking = await Bookings.findById(id)

    const additional = booking?.additionals?.find((e) => e._id?.toJSON() === additionalId);
    const newAdditionalTotal= booking?.billing?.additional_total - (additional?.rate * additional?.qty);
    const newTotal = booking?.billing?.total_amount -  - (additional?.rate * additional?.qty);


    const updateResult = await Bookings.findByIdAndUpdate(id, {
        "billing.additional_total": parseFloat(newAdditionalTotal),
        "billing.total_amount": parseFloat(newTotal),
        $pull: {
            additionals: {
              _id: additionalId,
            },
          },
    })

    
    // console.log(booking.toJSON())

    res.json({message: "success"})
}