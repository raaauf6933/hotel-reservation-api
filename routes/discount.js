const express = require("express");
const router = express.Router();
const Discounts = require("./../models/discounts");
const validateDiscount = require("./../controller/discount/validateDiscount");

router.get("/", async (req, res) => {
  try {
    const result = await Discounts.find();
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/", async (req, res) => {
  const { id } = req.body;
  try {
    const result = await Discounts.findById(id);
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/create_discount", async (req, res) => {
  const { name, type, discount_rate } = req.body;

  try {
    await validateDiscount(name);

    let discount = new Discounts({
      name,
      type,
      discount_rate,
      status: "ACT",
    });

    const result = await discount.save();
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send({ status: "failed", message: error.message });
  }
});

router.post("/edit_discount", async (req, res) => {
  const { id, name, type, discount_rate, status } = req.body;

  try {
    const result = await Discounts.findByIdAndUpdate(id, {
      name,
      type,
      discount_rate,
      status
    });

    res.status(200).send(result);
  } catch (error) {
    res.status(400).send({ status: "failed", message: error.message });
  }
});

router.post("/update_status", async (req, res) => {
  const { id, status } = req.body;

  try {
    const result = await Discounts.findByIdAndUpdate(id, {
      status,
    });

    res.status(200).send(result);
  } catch (error) {
    res.status(400).send({ status: "failed", message: error.message });
  }
});

module.exports = router;
