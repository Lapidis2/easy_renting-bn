const express = require("express");
const router = express.Router();
const upload = require("../Config/multer");
const requestPropertyController = require("../Controller/requestPropertyController");

router.post("/",upload.single("image"),requestPropertyController.createRequestProperty);
router.get("/", requestPropertyController.getAllRequest);
router.get("/:id", requestPropertyController.getSingleRequest);
router.put("/:id",upload.single("image"), requestPropertyController.updateRequest);
router.delete("/:id", requestPropertyController.deleteRequest);
module.exports = router;