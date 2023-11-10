const express = require("express");
const router = express.Router();
const Settings = require("../models/site_settings");

router.get("/carousels", async (req, res) => {
  try {
    let result = await Settings.find();

    return res.send(result[0]["carousel"]);
  } catch (error) {
    return res.status(400).json(error);
  }
});

router.post(
  "/carousel",
  async (req, res) => {
    try {
      const settings = await Settings.find();
      const settingsId = settings[0]._id;

      await Settings.findByIdAndUpdate(settingsId, {
        carousel: req.body,
      });

      return res.json({ message: "success" });
    } catch (error) {
      return res.json();
    }
  },

  router.post("/carousel/delete", async (req, res) => {
    try {
      const result = await Settings.findByIdAndDelete(req.body.id);

      return res.json(result);
    } catch (error) {
      return res.status(400).json(error);
    }
  })
);

module.exports = router;
