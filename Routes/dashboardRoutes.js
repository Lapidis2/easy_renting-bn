// routes/dashboardRoutes.js
const express = require("express");
const router = express.Router();
const dashboardRoutes = require("../Controller/dashboardController");

router.get("/dashboard-stats", dashboardRoutes.getDashboardStats);

module.exports = router;
