const express = require("express");
const router = express.Router();
const RoomTypes = require("../models/rooms");
const upload = require("../helpers/uploadImage");
const multer = require("multer");
const createRoomType = require("../controller/rooms/createRoomType");
const uploadRoomImage = require("./../controller/rooms/uploadRoomImage");
const { statuses } = require("./../utils/enums");

router.get("/", async (req, res) => {
  try {
    const room_types_result = await RoomTypes.find();
    res.status(200).send(room_types_result);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/available_rooms", async (req, res) => {
  try {
    const room_types_result = await RoomTypes.find();
    res.send(room_types_result);
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
router.post(
  "/create_room_type",
  // async (req, res, next) => {
  //   //Validate File Type
  //   upload(req, res, function (err) {
  //     if (err instanceof multer.MulterError) {
  //       return res.status(500).json({
  //         success: false,
  //         message: "Internal server error",
  //       });
  //     } else if (err) {
  //       return res.status(400).json({
  //         success: false,
  //         error: "Invalid file format. Please use valid image file (png/jpg)",
  //       });
  //     }
  //     next();
  //   });
  // },
  createRoomType
);

// Update Room Type
router.post("/update_room_type", async (req, res) => {
  const { id, data } = req.body;

  try {
    const result = await RoomTypes.findByIdAndUpdate(id, {
      name: data.name,
      details: {
        no_person: data.no_bed,
        no_bed: data.no_bed,
        no_bath: data.no_bath,
        isAircon: data.isAircon,
        isKitchen: data.isKitchen,
      },
      room_rate: data.room_rate,
      status: data.status,
    });
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send({ message: "error" });
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

module.exports = router;
