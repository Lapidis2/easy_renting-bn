// Controller/notificationController.js
const Notification = require("../models/bulkNotficationsModel"); 

exports.sendBulkNotification = async (req, res) => {
    try {
      const { title, message } = req.body;
      if (!title || !message) {
        return res.status(400).json({ error: "Title and message are required" });
      }
      const newNotification = new Notification({ title, message });
      await newNotification.save();
      res.status(200).json({ message: "Notification sent", data: newNotification });
    } catch (err) {
      res.status(500).json({ error: "Failed to send notification" });
    }
  };
  
  exports.getAllNotifications = async (req, res) => {
    try {
      const notifications = await Notification.find().sort({ createdAt: -1 });
      res.status(200).json(notifications);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  };
  
  exports.getNotificationById = async (req, res) => {
    try {
      const notification = await Notification.findById(req.params.id);
      if (!notification) return res.status(404).json({ error: "Not found" });
      res.status(200).json(notification);
    } catch (err) {
      res.status(500).json({ error: "Error fetching notification" });
    }
  };
  
  exports.updateNotification = async (req, res) => {
    try {
      const { title, message } = req.body;
      const updated = await Notification.findByIdAndUpdate(
        req.params.id,
        { title, message },
        { new: true }
      );
      if (!updated) return res.status(404).json({ error: "Not found" });
      res.status(200).json({ message: "Updated successfully", data: updated });
    } catch (err) {
      res.status(500).json({ error: "Update failed" });
    }
  };
  
  exports.deleteNotification = async (req, res) => {
    try {
      const deleted = await Notification.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Not found" });
      res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Deletion failed" });
    }
  };
