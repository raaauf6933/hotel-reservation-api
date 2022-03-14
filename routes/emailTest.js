const express = require("express");
const router = express.Router();
const sendEmail = require("./../helpers/mail");

router.post("/", (req, res) => {
  sendEmail(req.body, { type: "CONFIRMED" });
});

module.exports = router;
