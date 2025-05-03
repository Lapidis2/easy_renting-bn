// models/Settings.js
const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  contactEmail: String,
  logoURL: String,
  footerText: String,
  termsURL: String,
  privacyURL: String,
  maintenanceMode: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Settings", settingsSchema);
