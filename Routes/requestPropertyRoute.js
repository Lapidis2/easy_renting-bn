const express = require("express");
const router = express.Router();
const authorizeRole = require("../middleware/authorizeRole");
const authenticate = require("../middleware/authenticate");
const requestPropertyController = require("../Controller/requestPropertyController");

router.post("/",authenticate,authorizeRole(["admin"]) ,requestPropertyController.createRequestProperty);
router.get("/", requestPropertyController.getAllRequest);
router.get("/:id", requestPropertyController.getSingleRequest);
router.put("/:id", requestPropertyController.updateRequest);
router.delete("/:id", requestPropertyController.deleteRequest);
module.exports = router;