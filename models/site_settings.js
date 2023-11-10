const mongoose = require("mongoose");

const SiteSettingsSchema = new mongoose.Schema(
  {
    
    carousel: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("site_settings", SiteSettingsSchema);
