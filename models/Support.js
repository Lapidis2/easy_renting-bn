// models/Support.js
const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema({
  contactEmail: {
    type: String,
    required: true,
    trim: true,
  },
  supportPhone: {
    type: String,
    required: true,
    trim: true,
  },
  userGuideURL: {
    type: String,
    required: true,
    trim: true,
  },
  termsURL: {
    type: String,
    required: true,
    trim: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Support', supportSchema);
