const express = require("express");
const messageController = require("../Controller/messageController");
const verifyUserRole = require("../middleware/verifyUserRole");

const router = express.Router();

router.post("/", messageController.createMessage);

// Admin-only routes
router.use(verifyUserRole(["admin"])); // Protects all routes below

router.get("/", messageController.getAllMessages);
router.get("/:id", messageController.getMessageById);
router.delete("/:id", messageController.deleteMessage);
router.put("/:id", messageController.updateMessage);
router.post("/reply/:id", messageController.replyToMessage);

module.exports = router;
