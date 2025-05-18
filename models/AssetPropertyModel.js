const mongoose = require("mongoose");
const moment = require("moment");

const AssetSchema = new mongoose.Schema({

  name: { type: String, required: true },
  price: { type: String, required: true },
  type: {
    type: String,
    enum: ['Car', 'Motorcycle', 'Land', 'Clothes', 'Other'],
    required: true
  },
  status: {
    type: String,
    enum: ['Available', 'Rent', 'Sale', 'Pending'],
    required: false,
    default: 'Rent'
  },
  image: {
    type: String,
    required: [true, 'Image is required']
  },
  owner: {type: String},
  contact: {type: String },

  // Car & Motorcycle
  transmission: { type: String, enum: ['Automatic', 'Manual'], default: null },
  fuel: { type: String, enum: ['Petrol', 'Diesel', 'Hybrid', 'Electric'], default: null },
  certified: { type: Boolean, default: false },
  inspected: { type: Boolean, default: false },
  warranty: { type: String },
  rentalPrice: { type: String },
  rentDuration: { type: String },

  // Land
  location: { type: String },
  size: { type: String },

  // Clothes
  condition: { type: String, enum: ['New', 'Used'], default: "New" },
  sizeCloth: { type: String },

  // Others
  description: { type: String },
  timeAgo: { type: String, default: moment().fromNow() },
}, {
  timestamps: true
});

module.exports = mongoose.model("AssetProperty", AssetSchema);