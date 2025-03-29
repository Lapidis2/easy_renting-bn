const mongoose = require("mongoose");

const subscribeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const Subscribe = mongoose.model("subscribe", subscribeSchema);

module.exports = Subscribe;
