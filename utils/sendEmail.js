const nodemailer = require("nodemailer");
require('dotenv').config();


const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: process.env.Ethereal_UserEmail,
    pass: process.env.Ethereal_Password,
    // user:"pansy28@ethereal.email",
    // pass: "yU8fVhqQUDnEwXTJVz",
  },
});

const sendEmail = async (alert) => {
  await transporter.sendMail({
    from: '"shreyaojha" <shreyaojha192027@gmail.com>',
    to: "prdrobotech@example.com,",
    subject: "generic-event-alert ",
    html: `<!DOCTYPE html>
<html>
  <head>
    <style>
      .container {
        font-family: Arial, sans-serif;
        border: 1px solid #e0e0e0;
        padding: 20px;
        max-width: 600px;
        margin: auto;
        background-color: #f9f9f9;
        border-radius: 8px;
      }
      .heading {
        font-size: 20px;
        font-weight: bold;
        color: #2c3e50;
        margin-bottom: 10px;
      }
      .details {
        font-size: 16px;
        color: #333;
        line-height: 1.6;
      }
      .label {
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="heading">🔔 ${alert.type} — Tenant ${alert.tenantId}</div>

      ${
        alert.payload
          ? `
        <div class="details">
          <div><span class="label">Entity:</span> ${alert.payload.entity}</div>
          <div><span class="label">ID:</span> ${alert.payload.id}</div>
          <div><span class="label">Amount:</span> ${alert.payload.currency} ${alert.payload.amount}</div>
          <div><span class="label">Created By:</span> ${alert.payload.createdBy}</div>
        </div>
        `
          : `<div class="details">No additional payload data.</div>`
      }
    </div>
  </body>
</html>
`,
  });
};
module.exports = {
  sendEmail,
};
