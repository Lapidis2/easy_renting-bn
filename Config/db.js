const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = async () => {
  try {    const URI = process.env.NODE_ENV === 'development' 
      ? process.env.LOCAL_DB
      : process.env.MONGO_URI;
    const conn = await mongoose.connect(URI, {
      serverSelectionTimeoutMS: 30000, 
    });


    console.log("MongoDB Connected successfully");

  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); 
}
};

module.exports = connectDB;
