// routes/motorRoutes.js
const express = require("express");
const router = express.Router();
const motorController = require("../controllers/motorController");

router.get("/motors", motorController.getAllMotors);
router.get("/motors/search", motorController.searchMotors);
router.get("/motors/:id", motorController.getMotorById);
router.post("/motors", motorController.addMotor);
router.put("/motors/:id", motorController.updateMotor);
router.delete("/motors/:id", motorController.deleteMotor);

module.exports = router;
