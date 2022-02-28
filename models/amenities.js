const mongoose = require("mongoose");

const AmenitiesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: false,
      minlength: 1,
      maxlength: 255,
    },
    rate: {
      type: Number,
      required: true,
      min: 1,
      max: 100000,
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

module.exports = mongoose.model("Amenities", AmenitiesSchema);
