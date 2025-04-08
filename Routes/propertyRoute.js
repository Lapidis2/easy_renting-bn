const express = require("express");
const router = express.Router();
const upload = require("../Config/multer"); 
const { createProperty,getProperties } = require("../Controller/propertyController");

router.post("/create-property", upload.single("image"), createProperty);
router.get("/get-properties", getProperties);
module.exports = router;
