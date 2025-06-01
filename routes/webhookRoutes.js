const express = require("express");
const { registerWebhook } = require("../controller/webhookController.js");

const router = express.Router();

router.post("/", registerWebhook);

module.exports = router;
