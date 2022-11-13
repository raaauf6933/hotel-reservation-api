const express = require("express");
const sendEmail = require("../helpers/sendEmail");
const router = express.Router();

router.post("/send_support_email", async (req, res) => {
  console.log(req);
  try {
    const result = await sendEmail("SUPPORT_EMAIL_ADMIN", {
      to: "villagregoriaresortph@gmail.com",
      name: req.body.name,
      subject: req.body.subject,
      email: req.body.email,
      message: req.body.message,
    });

    res.status(200).send(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
