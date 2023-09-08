const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      trim: false,
      minlength: 1,
      maxlength: 255,
    },
    last_name: {
      type: String,
      required: true,
      trim: false,
      minlength: 1,
      maxlength: 255,
    },
    email: {
      type: String,
      required: true,
      trim: false,
      minlength: 1,
      maxlength: 255,
    },
    contact_number: {
      type: String,
      required: true,
      trim: false,
      minlength: 1,
      maxlength: 255,
    },
    address: new mongoose.Schema({
      address: {
        type: String,
        required: true,
        trim: false,
        minlength: 1,
        maxlength: 255,
      },
      city: {
        type: String,
        required: true,
        trim: false,
        minlength: 1,
        maxlength: 255,
      },
    }),
    is_verified:{
      required:true,
      type: Boolean
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 1024,
    },
    status: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("customer", CustomerSchema);
