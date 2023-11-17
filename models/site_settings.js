const mongoose = require("mongoose");

const SiteSettingsSchema = new mongoose.Schema(
  {
    
    carousel: {
      type: Array,
    },
    isViewedNotif: {
      type: Boolean
    },
    noNotif: {
      type: Number
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("site_settings", SiteSettingsSchema);
