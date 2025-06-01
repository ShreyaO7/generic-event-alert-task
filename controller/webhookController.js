const { alertQueue } = require("../queues/alertQueue.js");

const webhooksMap = new Map();

const registerWebhook = (req, res) => {
  const { tenantId, url, events } = req.body;

  if (!tenantId || !url || !events) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const existing = webhooksMap.get(tenantId) || [];
  existing.push({ url, events });
  webhooksMap.set(tenantId, existing);

  alertQueue.push({ type: "Webhook registered", tenantId });
  return res.status(201).json({ message: "Webhook registered" });
};

module.exports = {
  registerWebhook,
  webhooksMap,
};
