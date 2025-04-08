const express = require("express");
const router = express.Router();
const supplyPropertyController = require("../Controller/supplyPropertyController");
const upload = require("../Config/multer")
router.post("/",supplyPropertyController.createSupplyProperty);
router.get("/", supplyPropertyController.getAllRequest);
router.get("/:id", supplyPropertyController.getSingleRequest);
router.put("/:id", supplyPropertyController.updateRequest);
router.delete("/:id", supplyPropertyController.deleteRequest);

module.exports = router;