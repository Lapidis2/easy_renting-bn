const mongoose = require("mongoose");

const requestPropertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ['Available', 'Rent', 'Sale'],
    default: 'Rent'
  },
    location: { type: String, required: true },
  requesterName: String,
  contact: { type: String, required: true },
  description:String,
  bedrooms: { type: String, required: true },
  bathrooms: { type: String, required: true },
  toilets: { type: String, required: true },
  area: { type: String, required: true },
  type: { type: String, required: true },
  features: {
    type: [String],
    required: true,
  },

  image: { 
    type: String, 
    required: true 
  }}, 
{
  timestamps: true,
}
);
const RequestProperty = mongoose.model("RequestProperty", requestPropertySchema);
module.exports = RequestProperty;
