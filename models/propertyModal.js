
const e = require("express");
const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },  
  owner: { type: String, required: true },
  contact: { type: String, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  toilets: { type: Number, required: true },
  area: { type: String, required: true },
  type: { 
    type: String, 
    required: true ,
    enum: ['House', 'Apartment', 'Hotel'] ,
    default: 'House'
  },
  features: { type: [String], required: true },  
  timeAgo: { type: String, required: false ,default:""},  
      
},
 { timestamps: true }
);  

module.exports = mongoose.model("Property", PropertySchema);
