const mongoose = require('mongoose');
const carListingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Car name is required'],
    trim: true
  },
  price: {
    type: String,
    required: [true, 'Price is required']
  },
  transmission: {
    type: String,
    enum: ['Automatic', 'Manual'],
    required: true
  },
  fuel: {
    type: String,
    enum: ['Petrol', 'Diesel', 'Hybrid', 'Electric'],
    required: true
  },
  status: {
    type: String,
    enum: ['Available', 'Sold', 'Reserved'],
    default: 'Available'
  },
  certified: {
    type: Boolean,
    default: false
  },
  inspected: {
    type: Boolean,
    default: false
  },
  warranty: {
    type: String
  },
  image: {
    type: String 
  }
}, { timestamps: true }); 

module.exports = mongoose.model('CarListing', carListingSchema);
