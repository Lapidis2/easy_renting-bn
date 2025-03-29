const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const port=process.env.PORT || 3000;
const connectDB = async () => {
  try {
	const URI = process.env.NODE_ENV === 'development' ? process.env.MONGODB_URL : process.env.LOCAL_DB;
    const conn = await mongoose.connect(URI, {
        serverSelectionTimeoutMS: 30000, 
      });;

    console.log(`MongoDB Connected: ${conn.connection.port}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); 
  }
};

module.exports = connectDB;
