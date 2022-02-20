const express = require("express");
const router = express.Router();
const sendEmail = require("./../helpers/mail");

router.post("/", (req, res) => {
  sendEmail();
  res.send("test");
});

module.exports = router;
