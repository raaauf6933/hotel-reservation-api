const express = require("express");
const router = express.Router();
const Amenities = require("./../models/amenities");

router.get("/", async (req, res) => {
  try {
    const result = await Amenities.find();
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/create_amenity", async (req, res) => {
  const { name, rate } = req.body;

  try {
    let amenity = new Amenities({
      name,
      rate,
      status: "ACT",
    });

    const result = await amenity.save();
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
