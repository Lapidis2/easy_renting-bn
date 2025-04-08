const mongoose = require('mongoose');

// Clothes Schema
const clothesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Clothing name is required']
  },
  price: {
    type: String,
    required: [true, 'Price is required']
  },
  size: {
    type: String,
    required: [true, 'Size is required']
  },
  condition: {
    type: String,
    enum: ['New', 'Used'],
    required: [true, 'Condition is required']
  },
  owner: {
    type: String,
    required: [true, 'Owner is required']
  },
  contact: {
    type: String,
    required: [true, 'Contact is required']
  },
  image: {
    type: String,
    required: [true, 'Image URL is required']
  }
}, { timestamps: true });

module.exports = mongoose.model('Clothes', clothesSchema);
