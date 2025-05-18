const Message = require("../models/messageModal");
const User = require("../models/userModel");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_PSWD,
  },
  tls: {
    rejectUnauthorized: false, // ⚠️ Use only in development (self-signed certs)
  },
});

exports.createMessage = async (req, res) => {
  try {
    const { username, email, message: userMessage } = req.body;

    if (!username || !email || !userMessage) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newMessage = new Message({ username, email, message: userMessage });
    await newMessage.save();

    const adminEmail = {
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: "New Message Received",
      text: `You have received a new message:\n\nName: ${username}\nEmail: ${email}\nMessage: ${userMessage}`,
    };

    await transporter.sendMail(adminEmail);

    res.status(200).json({ message: "Message sent successfully, admin notified" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.replyToMessage = async (req, res) => {
  try {
    const { replyMessage } = req.body;

    if (!replyMessage || replyMessage.trim() === "") {
      return res.status(400).json({ message: "Reply message is required" });
    }

    const original = await Message.findById(req.params.id);
    if (!original) return res.status(404).json({ message: "Original message not found" });

    const user = await User.findOne({ email: original.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const reply = new Message({
      username: "Admin",
      email: process.env.ADMIN_EMAIL,
      message: replyMessage,
    });

    await reply.save();

    const replyEmail = {
      from: `"Support Team" <${process.env.ADMIN_EMAIL}>`,
      to: user.email,
      subject: "Reply from Admin",
      text: `Hello ${user.name || user.username || "user"},\n\n${replyMessage}\n\nBest regards,\nAdmin`,
    };

    await transporter.sendMail(replyEmail);
   console.log(`Admin with email: ${process.env.ADMIN_EMAIL} ,Message sent to User with email: `, user.email);
    res.json({ message: "Reply sent successfully", reply });
  } catch (err) {
    console.error("Reply error:", err);
    res.status(500).json({ message: "Failed to send reply", error: err.message });
  }
};

exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to load messages" });
  }
};

exports.getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found" });
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch message" });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete message" });
  }
};

exports.updateMessage = async (req, res) => {
  try {
    const updated = await Message.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Message not found" });
    res.json({ message: "Message updated", data: updated });
  } catch (err) {
    res.status(500).json({ message: "Failed to update message" });
  }
};
