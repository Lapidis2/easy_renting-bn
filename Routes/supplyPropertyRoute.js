const express = require("express");
const router = express.Router();
const supplyPropertyController = require("../Controller/supplyPropertyController");
const upload = require("../Config/multer");

router.post("/", upload.single("image"), supplyPropertyController.createSupplyProperty);
router.get("/", supplyPropertyController.getAllRequest);
router.get("/:id", supplyPropertyController.getSingleRequest);
router.put("/:id", upload.single("image"), supplyPropertyController.updateRequest);
router.delete("/:id", supplyPropertyController.deleteRequest);

module.exports = router;