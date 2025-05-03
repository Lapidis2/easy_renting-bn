const mongoose = require("mongoose");

const supplyPropertySchema = new mongoose.Schema({
  id: String,
  title: { type: String, required: true },
  price: { type: String, required: true },
  status: { 
    type: String, 
    required: true,
    enum: ['Available', 'Rent', 'Sale', 'Pending'],
    default: 'Pending'
  },
  location: { type: String, required: true },
  owner: String,
  contact: { type: String, required: true },
  description: { type: String, required: true },
  bedrooms: { type: String, required: true },
  bathrooms: { type: String, required: true },
  toilets: { type: String, required: true },
  area: { type: String, required: true },
  type: {type:String, required: true, enum: ['House', 'Apartment', 'Hotel'], default: 'House'},
  features: { type: [String], required: true },
  timeAgo: String,
  image:{
    type:String,
     required: true 
    },
});

const supplyProperty = mongoose.model("SupplyProperty", supplyPropertySchema);
module.exports = supplyProperty;