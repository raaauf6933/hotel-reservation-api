const moment = require("moment-timezone");

const BOOKING_CREATED = "BOOKING_CREATED";
const UPDATE_STATUS = "UPDATE_STATUS";
const GUEST_IMAGE_UPLOAD = "GUEST_IMAGE_UPLOAD";
const PAYMENT_CAPTURED = "PAYMENT_CAPTURED";
const UPDATE_EXPIRED = "UPDATE_EXPIRED";
const ADD_AMENITY = "ADD_AMENITY";

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
    case GUEST_IMAGE_UPLOAD:
      return {
        type: "GUEST_IMAGE_UPLOAD",
        message: "",
        images: params.images,
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
    case PAYMENT_CAPTURED:
      return {
        type: "PAYMENT_CAPTURED",
        message: `Guest Paid`,
        images: [],
        user: "",
        amount: params.amount,
        quantity: 0,
        additional_type: "",
        created: moment.tz("Asia/Manila").format(),
      };
    case UPDATE_EXPIRED:
      return {
        type: "UPDATE_EXPIRED",
        message: `Booking Expired`,
        images: [],
        user: "",
        amount: 0,
        quantity: 0,
        additional_type: "",
        created: moment.tz("Asia/Manila").format(),
      };
    case ADD_AMENITY:
      return {
        type: "ADD_AMENITY",
        message: "",
        images: [],
        user: "",
        amount: 0,
        quantity: params.qty,
        additional_type: params.type,
        created: moment.tz("Asia/Manila").format(),
      };
    default:
      break;
  }
};

exports.eventType = {
  BOOKING_CREATED,
  UPDATE_STATUS,
  GUEST_IMAGE_UPLOAD,
  PAYMENT_CAPTURED,
  UPDATE_EXPIRED,
  ADD_AMENITY,
};
