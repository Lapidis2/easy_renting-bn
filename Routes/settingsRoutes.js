// routes/settingsRoutes.js
const express = require("express");
const Settings = require("../models/SettingsModal");
const router = express.Router();
const verifyUserRole = require("../middleware/verifyUserRole");

router.use(verifyUserRole(["admin"]));
// Get current settings
router.get("/", async (req, res) => {
  const settings = await Settings.findOne();
  res.json(settings);
});

// Update settings
router.put("/", async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = new Settings(req.body);
  } else {
    Object.assign(settings, req.body);
  }
  await settings.save();
  res.json(settings);
});

module.exports = router;
