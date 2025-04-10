const express = require("express");
const router = express.Router();
const upload = require("../Config/multer");
const {createProperty,getProperties,deleteProperty,getPropertyById,updateProperty} = require("../Controller/propertyController");

router.post("/create-property",
  upload.single("image"),
  createProperty
);
router.get("/get-property/:id",getPropertyById);
router.delete("/delete-property/:id",deleteProperty);
router.put("/update-property/:id",
  upload.single("image"),
  updateProperty
);
router.get("/get-properties",getProperties);

module.exports = router;
