const { eventQueue } = require("../queues/eventQueue.js");
const { alertQueue } = require("../queues/alertQueue.js");

const publishEvent = (req, res) => {
  const { tenantId, type, payload } = req.body;

  if (!tenantId || !type || !payload) {
    return res.status(400).json({ error: "Missing fields" });
  }
  eventQueue.push({
    tenantId,
    type,
    payload,
    attempts: 0,
    nextAttemptAt: Date.now(),
  });

  alertQueue.push({
    type: "Event Published",
    tenantId,
    payload,
  });
  res.status(200).json({ message: "Event received" });
};

module.exports = {
  publishEvent,
};
