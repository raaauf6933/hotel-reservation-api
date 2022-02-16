const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      trim: false,
      minlength: 5,
      maxlength: 255,
    },
    last_name: {
      type: String,
      required: true,
      trim: false,
      minlength: 5,
      maxlength: 255,
    },
    username: {
      type: String,
      required: true,
      trim: false,
      minlength: 5,
      maxlength: 255,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
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

module.exports = mongoose.model("user", UserSchema);
