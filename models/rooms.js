const mongoose = require("mongoose");

const roomTypesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: false,
      minlength: 5,
      maxlength: 255,
    },
    isDeleted: {
      type: Boolean,
      required: false,
    },
    details: new mongoose.Schema({
      no_bed: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
      },
      no_bath: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
      },
      isAircon: {
        type: Boolean,
        required: true,
      },
      no_person: {
        type: Number,
        required: true,
        min: 1,
        max: 50,
      },
      isKitchen: {
        type: Boolean,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
    }),
    images: {
      type: Array,
    },
    room_rate: {
      type: Number,
      required: true,
      min: 1,
      max: 100000,
    },
    rooms: [
      new mongoose.Schema({
        // id: {
        //   type: String,
        //   default: mongoose.Types.ObjectId(),
        // },
        room_number: {
          type: String,
        },
        status: {
          type: String,
        },
        isDeleted: {
          type: Boolean,
          required: false,
        },
      }),
    ],
    promo: new mongoose.Schema({
      rate: {
        type: Number,
        required: false,
        min: 1,
        max: 100000,
      },
      startDate: {
        type: String,
        required: false,
      },
      endDate: {
        type: String,
        required: false,
      },
    }),
    isActivePromo: {
      type: Boolean,
      required: false,
    },
    status: {
      type: String,
      require: true,
      minlength: 1,
      maxlength: 255,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("RoomTypes", roomTypesSchema);
