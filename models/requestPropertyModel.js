const mongoose = require("mongoose");

// Define the schema
const requestPropertySchema = new mongoose.Schema({
  id: String,
  title: String,
  price: String,
  status: String,
  location: String,
  requesterName: String,
  contact: String,
  description: String,
  bedrooms: String,
  bathrooms: String,
  toilets: String,
  area: String,
  type: String,
  features: String,
  timeAgo: String,
  image: {
    public_id: String, 
    secure_url: String, 
  },
});

const RequestProperty = mongoose.model("RequestProperty", requestPropertySchema);
module.exports = RequestProperty;