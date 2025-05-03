const express = require("express");
const messageController = require("../Controller/messageController");
const verifyUserRole = require("../middleware/verifyUserRole");

const router = express.Router();

router.post("/create-message", messageController.createMessage);

// Admin-only routes
router.use(verifyUserRole(["admin"])); 

router.get("/messages", messageController.getAllMessages);
router.get("/message/:id", messageController.getMessageById);
router.delete("/message/:id", messageController.deleteMessage);
router.put("/message/:id", messageController.updateMessage);
router.post("/message/reply/:id", messageController.replyToMessage);

module.exports = router;
