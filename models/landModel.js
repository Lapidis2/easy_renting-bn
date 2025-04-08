const mongoose = require('mongoose');
const landSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Land name is required'],
    trim: true
  },
  price: {
    type: String,
    required: [true, 'Price is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  size: {
    type: String,
    required: [true, 'Size is required']
  },
  status: {
    type: String,
    enum: ['available', 'sold', 'reserved'],
    default: 'available'
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
    required: [true, 'Image is required']
  }
}, { timestamps: true });  

module.exports = mongoose.model('Land', landSchema);