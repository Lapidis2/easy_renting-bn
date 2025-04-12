const message = require("../models/messageModal");
const express = require("express");
const nodemailer = require("nodemailer");
const createMessage = async (req, res) => {
  try {
    const { username, email, message: userMessage } = req.body;
    if (!username || !email || !userMessage) {
      return res.status(400).json({ message: "All fields are required" });
    }


    const newMessage = new message({
      username,
      email,
      message: userMessage, 
    });
    await newMessage.save();

    // Notify the admin (yourself) via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PSWD,
      },
    });

    const adminMessage = {
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: "New Message Received",
      text: `You have received a new message:\n\nName: ${username}\nEmail: ${email}\nMessage: ${userMessage}`, // Use 'userMessage' here
    };

    await transporter.sendMail(adminMessage);

    res.status(200).json({ message: "Message sent successfully, admin notified" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = createMessage;

