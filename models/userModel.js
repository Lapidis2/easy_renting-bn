
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: {
    type: String,
    enum: ['Active', 'Blocked'],
    default: 'Active'
  },
  role: { type: String, enum: ["admin", "buyer","seller","guest"], default: "guest" },
  isConfirmed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
}
, {
  timestamps: true,
});

module.exports = mongoose.model("User", userSchema);
