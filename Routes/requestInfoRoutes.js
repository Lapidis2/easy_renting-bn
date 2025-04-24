const express = require("express");
const router = express.Router();
const createInformation = require("../Controller/requestInfoController");


router.post("/request-inform", createInformation);

module.exports = router;