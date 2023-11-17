const express = require("express");
const router = express.Router();
const Bookings = require("../models/bookings/bookings");
const {
  createBookingReference,
  getNewStatus,
  IsJsonString,
} = require("../utils/misc");
const { bookingStatus, bookingType } = require("../utils/enums");
const { createEvent, eventType } = require("../helpers/events");
const sendEmail = require("./../helpers/mail");
const upload = require("../helpers/uploadImage");
const uploadReceiptImage = require("../controller/uploadReceiptImage");
const multer = require("multer");
const getPaymentAmount = require("../controller/bookings/getPaymentAmount");
const {
  updatePending,
  updateConfirmed,
  updateCheckIn,
  cancelBooking,
} = require("./../controller/bookings/updateBookingStatus");
const moment = require("moment-timezone");
const addDiscount = require("./../controller/bookings/addDiscount");
const addAmenity = require("./../controller/bookings/addAmenity");
const deleteAmenity = require("./../controller/bookings/deleteAmenity")
const auth = require("./../middleware/auth");
const {
  createOnlineBooking,
  createWalkinBooking,
} = require("./../controller/bookings/createBooking");
const {
  guestModifyBooking,
} = require("./../controller/bookings/guestModifyBooking");
const validateBooking = require("./../controller/bookings/validateBooking");

// Get Bookings
router.post("/bookings", async (req, res) => {
  const { status } = req.body;

  const booking_status = status === "ALL" ? {} : { status };

  try {
    const booking_results = await Bookings.find(booking_status).sort({
      createdAt: -1,
    });
    res.status(200).send(booking_results);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/guess_booking", async (req, res) => {
  
  try {
    const booking = await Bookings.find({
      "guest.customer_id": req.query.id,
    });

    console.log(booking)

    res.json(booking);
  } catch (error) {
    res.json(error);
  }
});

// Get Booking
router.post("/booking", async (req, res) => {
  const { body } = req;
  try {
    const booking = await Bookings.findById(body.id);
    const payment_amount = await getPaymentAmount(body.id);
    const total_balance =
      parseFloat(booking?.billing.total_amount) - parseFloat(payment_amount);

    res.status(200).send({
      ...booking._doc,
      payment_amount: payment_amount,
      total_balance: total_balance,
    });
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

router.post("/create_booking", validateBooking, createOnlineBooking);

router.post("/guest_modify_booking", validateBooking, guestModifyBooking);

router.post("/create_booking_walkin", createWalkinBooking);

router.post("/update_booking_status", auth, async (req, res) => {
  const { body, user } = req;
  const { id, status, paymentAmount, remarks } = body;

  const user_name = `${user.first_name} ${user.last_name}`;

  try {
    let result;
    switch (status) {
      case bookingStatus.PENDING:
        result = await updatePending({ id, status, paymentAmount, user_name });
        break;
      case bookingStatus.CONFIRMED:
        result = await updateConfirmed({
          id,
          status,
          paymentAmount,
          user_name,
        });
        break;
      case bookingStatus.CHECK_IN:
        result = await updateCheckIn({ id, status, paymentAmount, user_name, remarks });
        break;
      case bookingStatus.CANCELLED:
        result = await cancelBooking({ id, status, user_name });
        break;
      default:
        break;
    }
    res.status(200).send(result);
  } catch (error) {
    if (IsJsonString(error.message)) {
      res.status(400).send({ status: "failed", ...JSON.parse(error.message) });
    } else {
      res.status(400).send({ status: "failed", message: error.message });
    }
  }
});

router.post(
  "/upload_receipt",
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
  uploadReceiptImage
);

router.post("/add_amenity", auth, addAmenity);

router.post("/delete_amenity", auth, deleteAmenity);

router.post("/add_discount", auth, addDiscount);


router.post("/change_room", async (req, res)=> {
  const {id, oldRoom, newRoom } = req.body;
  try {
   await Bookings.findByIdAndUpdate(id, {
      $pull: {
        rooms: {
          room_id: oldRoom?.room_id
        }
      },
    })
    await Bookings.findByIdAndUpdate(id, {
      $push: {
        rooms: newRoom
      }
    })

    return res.json({message: "success"})
  } catch (error) {
    return res.status(400).json({error})
  }
})


router.post("/feedback",async(req,res)=> {
  const {id, feedback, rate} = req.body;
  const result = await Bookings.findByIdAndUpdate(id, {
    feedback: {
      feedback,
      rate
    },
    $push: {
      events: createEvent(eventType.FEEDBACK, {
        message: feedback
      }),
    },
  })

  return res.json(result)
})

router.get("/feedbacks", async(req,res)=> {


  const result = await Bookings.find({
    $or: [{ feedback: { $exists: true } }] 
  })

  return res.json(result);
})

module.exports = router;
