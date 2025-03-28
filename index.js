const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./Config/db");
const routes = require("./Routes/propertyRoute");

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.use("/api", routes); 


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
