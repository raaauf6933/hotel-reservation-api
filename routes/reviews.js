const express = require("express");
const router = express.Router();
const Reviews = require("../models/reviews");

router.get("/get_reviews", async (req, res) => {
  try {
    const result = await Reviews.find();

    res.status(200).json({ result: result.reverse() });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

router.post("/add_review", async (req, res) => {
  const { name, title, review } = req.body;
  try {
    const newReview = new Reviews({
      name,
      title,
      review,
    });

    const result = await newReview.save();

    res.status(200).json({ result });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

module.exports = router;
