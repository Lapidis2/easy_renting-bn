// routes/notificationRoutes.js
const express = require("express");
const router = express.Router();
// const verifyUserRole = require("../middleware/verifyUserRole");
const notificationController = require("../Controller/bulkNotficationsController");

// router.use(verifyUserRole(["admin"])); 

router.post("/notification", notificationController.sendBulkNotification);
router.get("/notifications", notificationController.getAllNotifications);
router.get("/notification/:id", notificationController.getNotificationById);
router.delete("/notification/:id", notificationController.deleteNotification);
router.put("/notification/:id", notificationController.updateNotification);


module.exports = router;
