const express = require("express");
const router = express.Router();
const Amenities = require("./../models/amenities");
const validateAmenity = require("./../controller/amenities/validateAmenity");

router.get("/", async (req, res) => {
  try {
    const result = await Amenities.find();
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/", async (req, res) => {
  const { id } = req.body;
  try {
    const result = await Amenities.findById(id);
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/create_amenity", async (req, res) => {
  const { name, rate, status } = req.body;

  try {
    await validateAmenity(name);

    let amenity = new Amenities({
      name,
      rate,
      status,
    });

    const result = await amenity.save();
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send({ status: "failed", message: error.message });
  }
});

router.post("/edit_amenity", async (req, res) => {
  const { id, name, rate, status } = req.body;

  try {
    const result = await Amenities.findByIdAndUpdate(id, {
      rate,
      status,
    });

    res.status(200).send(result);
  } catch (error) {
    res.status(400).send({ status: "failed", message: error.message });
  }
});

module.exports = router;
