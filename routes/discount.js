const express = require("express");
const router = express.Router();
const Discounts = require("./../models/discounts");

router.get("/", async (req, res) => {
  try {
    const result = await Discounts.find();
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/create_discount", async (req, res) => {
  const { name, type, discount_rate } = req.body;

  try {
    let discount = new Discounts({
      name,
      type,
      discount_rate,
      status: "ACT",
    });

    const result = await discount.save();
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
