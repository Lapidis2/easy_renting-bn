const mongoose =require("mongoose");

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["buyer", "seller", "guest"],
    default: "guest",
  },
  message: {
    type: String,
    required: true,
  },
  agree: {
    type: Boolean,
    default: false,
  },
  createdAt: {
	type: Date,
	default: Date.now,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Query", ContactSchema);