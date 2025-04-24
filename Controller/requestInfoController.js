const Query = require("../models/requestInfoModal");
const express = require("express");
const nodemailer = require("nodemailer");
const createInformation = async (req, res) => {
  try {
	const { name, email, phone,role,message } = req.body;
	if (!name || !email || !phone || !role || !message) {
	  return res.status(400).json({ message: "All fields are required" });
	}


	const newQuery = new Query({
	  name,
	  email,
	  message, 
	  role,
	  phone,
	  agree: true,
	});
	await newQuery.save();

	
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
	  subject: "New Request information Received",
	  text: `You have received a new message:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`, // Use 'userMessage' here
	};

	await transporter.sendMail(adminMessage);

	res.status(200).json({ message: "Message sent successfully, admin notified",newQuery});
  } catch (error) {
	console.error("Error sending message:", error);
	res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = createInformation;

