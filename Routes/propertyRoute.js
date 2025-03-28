const express = require("express");
const router = express.Router();
const upload = require("../Config/multer"); 
const { createProperty,getProperties } = require("../Controller/propertyController");

router.post("/createProperty", upload.single("image"), createProperty);
router.get("/getProperties", getProperties);
module.exports = router;
