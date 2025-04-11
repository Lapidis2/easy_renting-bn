// models/Motor.js

const mongoose = require("mongoose");

const MotorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  price: { type: String }, 
  rentalPrice: { type: String },
  rentDuration: { type: String },
  transmission: { type: String },
  fuel: { type: String },
  status: { type: String, default: "available" }, 
  type: { type: String, enum: ["buy", "rent"], required: true },
  certified: { type: Boolean, default: false },
  inspected: { type: Boolean, default: false },
  warranty: { type: String },
}, {
  timestamps: true
});

module.exports = mongoose.model("Motor", MotorSchema);