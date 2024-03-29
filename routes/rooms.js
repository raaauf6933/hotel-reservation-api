const express = require("express");
const router = express.Router();
const RoomTypes = require("../models/rooms");
const upload = require("../helpers/uploadImage");
const multer = require("multer");
const createRoomType = require("../controller/rooms/createRoomType");
const uploadRoomImage = require("./../controller/rooms/uploadRoomImage");
const { statuses } = require("./../utils/enums");
const moment = require("moment-timezone");
const Booking = require("./../models/bookings/bookings");
const _ = require("lodash");
const uploadSingleImage = require("../controller/uploadSingleImage");
// const cloudinary = require("cloudinary");

router.get("/", async (req, res) => {
  try {
    const room_types_result = await RoomTypes.find({
      status: { $in: ["ACT", "DEACT"] },
      isDeleted: false
    });

    res.status(200).send(room_types_result);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/available_rooms", async (req, res) => {
  const { checkIn, checkOut, noGuest  } = req.body;
  const params = req.query;

  try {
    if (!moment(checkIn).isValid() || !moment(checkOut).isValid()) {
      throw Error("Invalid Dates");
    }

    const convert_check_in = moment(checkIn).tz("Asia/Manila").format();
    const convert_checkout = moment(checkOut).tz("Asia/Manila").format();

    var check_in_ = new Date(convert_check_in);
    var check_out_ = new Date(convert_checkout);

    const bookings = await Booking.find();

    const extracted_booking_fields = bookings.map((e) => {
      var new_check_in = moment(check_in_, "DD/MM/YYYY");
      var new_check_out = moment(check_out_, "DD/MM/YYYY");
      var startDate = moment(e.check_in);
      var endDate = moment(e.check_out);

      if (
        ["PENDING", "CONFIRMED", "CHECK_IN"].includes(e.status) &&
        (new_check_in.isBetween(startDate, endDate) ||
          new_check_out.isBetween(startDate, endDate) ||
          (new_check_in.isSameOrBefore(startDate) &&
            new_check_out.isSameOrAfter(endDate)))
      ) {
        return {
          check_in: e.check_in,
          check_out: e.check_out,
          rooms: e.rooms,
          status: e.status,
        };
      } else {
        return {
          check_in: "",
          check_out: "",
          rooms: [{ room_id: "" }],
          status: "",
        };
      }
    });

    let room_booking_holder = [];

    const room_types_result = await RoomTypes.find({
      status: { $in: ["ACT", "DEACT"] },
      isDeleted: false,
      ...(params?.guest || noGuest
        ? { "details.no_person": {$gte: parseInt(noGuest || params?.guest)} }
        : {}),
    });

    extracted_booking_fields.forEach((e) => {
      e.rooms.forEach((booking_room) => {
        room_booking_holder.push(booking_room);
      });
    });

    // validate rooms
    const remove_exist = (rooms) => {
      return rooms.filter(
        (room) =>
          !room_booking_holder.some(
            (room_booking) => room_booking.room_id === room._id.toString()
          )
      );
    };

    const filter_rooms = room_types_result.map((room_type) => {
      return {
        ...room_type._doc,
        rooms: remove_exist(room_type.rooms).filter(e=> e.status === "ACT"),
      };
    });

    res.send(filter_rooms);
  } catch (error) {
    res.status(400).send({
      success: "false",
      message: error.message,
    });
  }
});

router.post("/room_type", async (req, res) => {
  const { id } = req.body;


  try {
    const result = await RoomTypes.findById(id);
   
    res.send(result);
  } catch (error) {
    // not found
    if (error.kind === "ObjectId") {
      res.status(404).send({
        success: "false",
        message: error.message,
      });
    } else {
      res.status(400).send({
        success: "false",
        message: error.message,
      });
    }
  }
});

router.post("/room", async (req, res) => {
  try {
    const result = await RoomTypes.findById();
    res.send(result);
  } catch (error) {
    res.status(400).send({
      success: "false",
      message: error.message,
    });
  }
});

router.post("/create_room", async (req, res) => {
  const { id, room_number } = req.body;

  try {
    const get_room = await RoomTypes.findById(id);
    const { rooms } = get_room;
    const room_result = await RoomTypes.findByIdAndUpdate(id, {
      rooms: [
        ...rooms,
        {
          room_number,
          status: statuses.ACT,
        },
      ],
    });

    res.status(200).send(room_result);
  } catch (error) {
    res.status(400).send({
      success: "false",
      message: error.message,
    });
  }
});

// Create Room Type
router.post("/create_room_type", createRoomType);

// Update Room Type
router.post("/update_room_type", async (req, res) => {
  const { id, data } = req.body;

  try {
    const result = await RoomTypes.findByIdAndUpdate(id, {
      name: data.name,
      details: {
        no_person: data.no_person,
        no_bed: data.no_bed,
        no_bath: data.no_bath,
        isAircon: data.isAircon,
        isKitchen: data.isKitchen,
        description: data.description
      },
      images: data.images,
      room_rate: data.room_rate,
      status: data.status,
      isDeleted: false,
      promo: {
        rate: data.promo.rate,
        startDate: data.promo.startDate,
        endDate: data.promo.endDate
      },
      isActivePromo: data.isActivePromo
    });


    res.status(200).send({result});
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// Upload room image
router.post(
  "/upload_room_image",
  async (req, res, next) => {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      } else if (err) {
        return res.status(400).json({
          success: false,
          error: "Invalid file format. Please use valid image file (png/jpg)",
        });
      }
      next();
    });
  },
  uploadRoomImage
);

// Upload room image
router.post(
  "/upload_single_image",
  async (req, res, next) => {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      } else if (err) {
        return res.status(400).json({
          success: false,
          error: "Invalid file format. Please use valid image file (png/jpg)",
        });
      }
      next();
    });
  },
  uploadSingleImage
);


router.post("/delete_roomtype", async (req, res) => {
  const { id } = req.body;

  try {
    const result = await RoomTypes.findByIdAndUpdate(id, {
      isDeleted: true
    });

    res.status(200).send(result);
  } catch (error) {
    res.status(400).send({ status: "failed", message: error.message });
  }
});

router.post("/delete_room_image", async (req, res) => {
  const { id, image_id } = req.body;

  try {
    const result = await RoomTypes.findByIdAndUpdate(id, {
      $pull: {
        images: {
          _id: image_id,
        },
      },
    });

    // delete image in cloud
    // cloudinary.v2.uploader.destroy(public_id);

    res.status(200).send(result);
  } catch (error) {
    res.status(400).send({ status: "failed", message: error.message });
  }
});

router.post("/delete_room", async (req, res) => {
  const { id, room_id } = req.body;

  try {
    const result = await RoomTypes.findByIdAndUpdate(id, {
      $pull: {
        rooms: {
          _id: room_id,
        },
      },
    });

    res.status(200).send(result);
  } catch (error) {
    res.status(400).send({ status: "failed", message: error.message });
  }
});



router.post("/update_room_status", async (req,res)=> {
  try {
   
    const room_result = await RoomTypes.updateOne({_id: req.body.roomTypeId,'rooms._id': req.body.roomId}, {'$set': {
      'rooms.$.status': req.body.status,
  }});

    // console.log(room_result)
    res.status(200).send(room_result);
  } catch (error) {
    res.status(401).json({error})
  }
})
module.exports = router;
