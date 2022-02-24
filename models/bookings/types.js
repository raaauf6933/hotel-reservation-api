const mongoose = require("mongoose");

exports.guest = () => {
  return new mongoose.Schema({
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    contact_number: {
      type: String,
    },
    email: {
      type: String,
    },
    no_guest: {
      type: Number,
    },
    street_address: {
      type: String,
    },
    city: {
      type: String,
    },
    province: {
      type: String,
    },
  });
};

exports.events = () => {
  return new mongoose.Schema({
    type: {
      type: String,
    },
    message: {
      type: String,
    },
    images: {
      type: Array,
      default: [],
    },
    user: {
      type: String,
    },
    amount: {
      type: Number,
    },
    quantity: {
      type: Number,
    },
    additional_type: {
      type: String,
    },
    created: {
      type: Date,
    },
  });
};

exports.rooms = () => {
  return {
    type: Array,
    default: [
      new mongoose.Schema({
        room_number: {
          type: String,
        },
        room_amount: {
          type: Number,
        },
      }),
    ],
  };
};

exports.additionals = () => {
  return new mongoose.Schema({
    type: {
      type: String,
    },
    amount: {
      type: Number,
    },
  });
};

exports.billing = () => {
  return new mongoose.Schema({
    discount: {
      type: new mongoose.Schema({
        type: {
          type: String,
        },
        amount: {
          type: Number,
        },
      }),
      default: null,
    },
    total_amount: {
      type: Number,
      required: true,
    },
    sub_total: {
      type: Number,
      required: true,
    },
  });
};

exports.payment = () => {
  return new mongoose.Schema({
    type: Array,

    default: [
      new mongoose.Schema({
        payment_amount: {
          type: String,
        },
        created: {
          type: Number,
        },
      }),
    ],
  });
};
