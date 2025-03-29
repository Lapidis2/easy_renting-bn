const subscribeModal = require("../models/subscribeModal");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_PSWD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existSub = await subscribeModal.findOne({ email });
    if (existSub) {
      return res.status(409).json({ message: "The email already has subscribed before" });
    }

    const newSubscriber = await subscribeModal.create({ email });
    await newSubscriber.save();

    await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to: email,
      replyTo: process.env.ADMIN_EMAIL,
      subject: "Welcome to my renting website",
      html: `
      <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
          <div style="text-align: center;">
              <h1 style="color: green;">GREAT CONNECTION GROUP</h1>
          </div>
          <div style="text-align: center; margin-top: 7px;">
              <svg width="200px" height="200px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z" fill="green"/>
              </svg> 
              <p style="font-size: 16px;">Your subscription was successfully added.</p>
              <p style="font-size: 16px; line-height: 1.5;">Thank you for subscribing! You'll now receive notifications whenever I post new properties, updates, and other exciting content. Stay tuned for valuable insights and exclusive offers.</p>
              <p style="font-size: 16px;">Visit site <a href="https://paccy-easy-renting-fn.netlify.app/" target="_blank" style="color: green; text-decoration: underline;">Here</a></p>
          </div>
          <div style="text-align: center; margin-top: 20px;">
              <p style="color: #ffffff; background-color: #221F2F; padding: 10px; font-size: 14px;">&copy; Copyright 2024 All rights reserved</p>
          </div>
      </div>
      `
    });

    return res.status(201).json({ message: 'The subscription added successfully', newSubscriber });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to send email" ,err:err.message });
  }
};



const deleteSub = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existSub = await subscribeModal.findOneAndDelete({ email });

    if (existSub) {
      return res.status(200).json({
        message: "Your subscription has been removed. Feel free to subscribe again anytime!"
      });
    } else {
      return res.status(404).json({ message: "Email not found. Please check the email again." });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to remove email" });
  }
};

module.exports ={deleteSub ,subscribe}
