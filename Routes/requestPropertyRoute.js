const express = require("express");
const router = express.Router();
const requestPropertyController = require("../Controller/requestPropertyController");

router.post("/", requestPropertyController.createRequestProperty);
router.get("/", requestPropertyController.getAllRequest);
router.get("/:id", requestPropertyController.getSingleRequest);
router.put("/:id", requestPropertyController.updateRequest);
router.delete("/:id", requestPropertyController.deleteRequest);

module.exports = router;