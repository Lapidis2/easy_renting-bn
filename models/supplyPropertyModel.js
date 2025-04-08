const mongoose = require("mongoose");

const supplyPropertySchema = new mongoose.Schema({
  id: String,
  title: String,
  price: String,
  status: String,
  location: String,
  owner: String,
  contact: String,
  description: String,
  bedrooms: String,
  bathrooms: String,
  toilets: String,
  area: String,
  type: String,
  features: String,
  timeAgo: String,
  image:  String
});

const supplyProperty = mongoose.model("SupplyProperty", supplyPropertySchema);
module.exports = supplyProperty;