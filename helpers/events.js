const moment = require("moment-timezone");

const BOOKING_CREATED = "BOOKING_CREATED";
const UPDATE_STATUS = "UPDATE_STATUS";

exports.createEvent = (type, params) => {
  switch (type) {
    case BOOKING_CREATED:
      return {
        type: "BOOKING_CREATED",
        message: "",
        images: [],
        user: "",
        amount: 0,
        quantity: 0,
        additional_type: "",
        created: moment.tz("Asia/Manila").format(),
      };
    case UPDATE_STATUS:
      return {
        type: "UPDATE_STATUS",
        message: `Booking Status Updated to ${params.status}`,
        images: [],
        user: "",
        amount: 0,
        quantity: 0,
        additional_type: "",
        created: moment.tz("Asia/Manila").format(),
      };
    default:
      break;
  }
};

exports.eventType = {
  BOOKING_CREATED,
  UPDATE_STATUS,
};
