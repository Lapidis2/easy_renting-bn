const express = require("express");
const router = express.Router();
const createMessage = require("../Controller/messageController");


router.post("/create-message", createMessage);

module.exports = router;