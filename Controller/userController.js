const express = require("express");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();

    res.json({ token: generateToken(user), user: { id: user._id, username, email } });
  } catch (error) {
    res.status(400).json({ message: "Error creating user" });
  }
});

module.exports = router;
