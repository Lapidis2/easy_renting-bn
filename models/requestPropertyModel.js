const mongoose = require("mongoose");

const requestPropertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: String, required: true },
  status: String,
  location: { type: String, required: true },
  requesterName: String,
  contact: String,
  description: String,
  bedrooms: String,
  bathrooms: String,
  toilets: String,
  area: String,
  type: String,
  features: String,
  image: String, 
},
{
  timestamps: true,
});
const RequestProperty = mongoose.model("RequestProperty", requestPropertySchema);
module.exports = RequestProperty;
