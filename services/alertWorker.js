const { alertQueue } = require("../queues/alertQueue.js");
const axios = require("axios");
const { sendEmail } = require("../utils/sendEmail.js");
const dedupMap = new Map();

const startAlertWorker = () => {
  try {
      setInterval(async () => {
    const now = Date.now();

    while (alertQueue.length > 0) {
      const alert = alertQueue.shift();

      const key = `${alert.tenantId}-${alert.type}-${alert.payload?.id || ""}`;
      if (dedupMap.has(key) && now - dedupMap.get(key) < 5 * 60 * 1000)
        continue;

      dedupMap.set(key, now);

      const text =
        `*${alert.type}* — Tenant ${alert.tenantId}\n` +
        (alert.payload
          ? `Entity: ${alert.payload.entity} • ID: ${alert.payload.id} • ${alert.payload.currency} ${alert.payload.amount} • by ${alert.payload.createdBy}`
          : "");

      await axios.post(process.env.SLACK_WEBHOOK_URL, { text });
      await sendEmail(alert);
    }
  }, 2000);
    
  } catch (error) {
    console.log(error)
    throw new Error(error); 
    
  }

};

module.exports = {
  startAlertWorker,
};
