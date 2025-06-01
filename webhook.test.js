const request = require('supertest');
const express = require('express');
const webhookRoutes = require('./routes/webhookRoutes.js');

const app = express();
app.use(express.json());
app.use('/webhooks', webhookRoutes);

describe('Webhook Registration', () => {
  it('should register a webhook and return 201', async () => {
    const res = await request(app).post('/webhooks').send({
      tenantId: 'testTenant',
      url: 'https://example.com/webhook',
      events: ['record.created']
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toBe('Webhook registered');
  });

  it('should fail if required fields are missing', async () => {
    const res = await request(app).post('/webhooks').send({
      tenantId: 'testTenant'
    });

    expect(res.statusCode).toEqual(400);
  });
});