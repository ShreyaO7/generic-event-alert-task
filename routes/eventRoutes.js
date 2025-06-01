const express = require("express");
const { publishEvent } = require("../controller/eventController.js");

const router = express.Router();

router.post("/", publishEvent);

module.exports = router;
