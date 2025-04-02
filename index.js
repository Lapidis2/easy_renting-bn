const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const session = require("express-session");
const compression = require("compression");
const dotenv = require("dotenv");
const connectDB = require("./Config/db");
const propertyRoute = require("./Routes/propertyRoute");
const subRoutes =require("./Routes/subRoutes")
const userRoutes =require("./Routes/userRoutes")
const carRoutes = require("./Routes/carRoutes");
const requestPropertyRoutes = require("./Routes/requestPropertyRoute");
const supplyPropertyRoutes = require("./Routes/supplyPropertyRoute");
dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
// Set the view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// ** Middleware **
app.use(compression()); // Improve performance
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.CLIENT_URL,
    ],
    methods: ["POST", "PUT", "GET", "DELETE", "OPTIONS", "HEAD"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});
app.options("*", cors());
// Serve static files
app.use(express.static("public"));
// ** Session Configuration **
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default-secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);


app.use("/api", propertyRoute); 
app.use("/api", subRoutes); 
app.use("/api", userRoutes); 
app.use("/api/request-property", requestPropertyRoutes);
app.use("/api/supply-property", supplyPropertyRoutes);
app.use('/api/cars', carRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
