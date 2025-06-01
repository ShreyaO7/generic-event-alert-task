# Generic Event Alert Service

This is a generic event alert service which can be used to send webhooks or emails when an event occurs.




### Webhook

*   **POST /webhooks**
    *   Registers a webhook for a tenant
    *   Payload: `tenantId`, `url`, `events`
    *   Response: `201 Created`

### Events

*   **POST /events**
    *   Publishes an event to all registered webhooks and emails for a tenant
    *   Payload: `tenantId`, `type`, `payload`
    *   Response: `200 OK`


### Webhook

*   `tenantId`: The id of the tenant
*   `url`: The url of the webhook
*   `events`: An array of event types to subscribe to

### Events

*   `tenantId`: The id of the tenant
*   `type`: The type of the event
*   `payload`: The payload of the event

## Running Locally

1.  Clone the repository
2.  Install dependencies
```base
 npm install
 ```
 #### Use nodemailer to send email
###  Email 
Used `nodemailer` with `Ethereal` to test emails during development.

4.  Create a `.env` file with the following variables:

    *   `SLACK_WEBHOOK_URL`: The url of the slack webhook
    *   `PORT`: The port to run the server on
    * `Ethereal_Username`:Temporary test email username from Ethereal.
    * `Ethereal_Password`:Password for the Ethereal test account SMTP login.
5.  Run the server 
```base
 npm start
 ```
 or
 ```base
 npm run dev
 ```

6.  Use a tool like `postman` to test the routes


## Testing
```base
npm test
```
###  Retry Logic (In-Memory)

When an event is published, it’s pushed to an in-memory `eventQueue`.  
A background worker (`deliveryWorker`) processes events every second.

- Each event has an `attempts` counter and `nextAttemptAt` timestamp.
- If the webhook delivery fails:
  - The system retries up to **5 times**.
  - Each retry uses **exponential backoff**:
    - Example: 1s → 2s → 4s → 8s → 16s
- After 5 failures, the event is moved to the `deadLetterQueue`.
- An alert is pushed to `alertQueue` notifying that delivery has failed.



##  How to Upgrade to Redis or Database

Currently, the system uses in-memory Maps and Arrays.  
In production, replace them with Redis or a database for persistence and scalability:

- Replace queues (eventQueue, alertQueue) with Redis lists or DB tables
- Replace Map<tenantId, webhooks> with Redis Hashes or a webhooks collection/table
- Use Redis Streams or BullMQ for more reliable and observable background jobs
