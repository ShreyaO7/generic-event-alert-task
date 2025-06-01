const { eventQueue } = require("../queues/eventQueue.js");
const { webhooksMap } = require("../controller/webhookController.js");
const axios = require("axios");
const { deadLetterQueue } = require("../queues/deadLetterQueue.js");
const { alertQueue } = require("../queues/alertQueue.js");
const { sendEmail } = require("../utils/sendEmail.js");

const startDeliveryWorker = () => {
  try {
      setInterval(async () => {
    const now = Date.now();
    for (let i = 0; i < eventQueue.length; i++) {
      const event = eventQueue[i];
      if (event.nextAttemptAt > now) continue;
      const hooks = (webhooksMap.get(event.tenantId) || []).filter((h) =>
        h.events.includes(event.type)
      );
      for (const hook of hooks) {
        try {
          console.log("url is=>", hook);
          await axios.post(hook.url, event.payload);
          await sendEmail(event);

          eventQueue.splice(i, 1);
          i--;
          break;
        } catch (err) {
          console.error(`Failed to deliver event to ${hook.url}:`, err.message);
          event.attempts++;
          event.nextAttemptAt = now + 2 ** event.attempts * 1000;

          if (event.attempts >= 5) {
            deadLetterQueue.push(event);
            alertQueue.push({
              type: "Delivery Failed",
              tenantId: event.tenantId,
              payload: event.payload,
            });
            eventQueue.splice(i, 1);
            i--;
          }
        }
      }
    }
  }, 1000);
    
  } catch (error) {
    console.log(error)
    throw new Error(error);
    
  }

};

module.exports = {
  startDeliveryWorker,
};
