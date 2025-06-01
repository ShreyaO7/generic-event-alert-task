const express = require("express");

const webhookRoutes = require("./routes/webhookRoutes.js");
const eventRoutes = require("./routes/eventRoutes.js");
const { startDeliveryWorker } = require("./services/deliveryWorker.js");
const { startAlertWorker } = require("./services/alertWorker.js");

require('dotenv').config();

const app = express();
app.use(express.json());

app.use("/webhooks", webhookRoutes);
app.use("/events", eventRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
startDeliveryWorker();
startAlertWorker();
