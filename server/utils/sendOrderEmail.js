const nodemailer = require("nodemailer");

const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
  <style>
    .container {
      margin: 10px auto;
      width: 600px;
      max-width: 100%;
      border: 1px solid #E5E5E5;
    }
    .heading {
      font-size: 32px;
      line-height: 1.3;
      font-weight: 700;
      text-align: center;
      letter-spacing: -1px;
    }
    .text {
      color: #747474;
      font-weight: 500;
    }
    .hr {
      border-color: #E5E5E5;
      margin: 0;
    }
    .footer-text {
      margin: 0;
      color: #AFAFAF;
      font-size: 13px;
      text-align: center;
    }
    .address-title {
      font-size: 15px;
      font-weight: bold;
    }
  </style>
</head>
<body style="background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;">
  <div class="container">
    <section style="padding: 40px 74px; text-align: center;">
      <img src="{{baseUrl}}/snake-3.png" width="95" height="99" alt="delivery snake" style="margin: auto" />
      <h1 class="heading">Thank you for your order!</h1>
      <p class="text">
        We're preparing everything for delivery and will notify you once your package has been shipped. Delivery usually takes 2 days.
      </p>
      <p class="text" style="margin-top: 24px;">
        If you have any questions regarding your order, please feel free to contact us with your order number and we're here to help.
      </p>
    </section>

    <hr class="hr" />
    
    <section style="padding: 22px 40px;">
      <p class="address-title">Shipping to: {{shippingAddressName}}</p>
      <p class="text" style="font-size: 14px;">
        {{shippingAddressStreet}}, {{shippingAddressCity}}, {{shippingAddressState}} {{shippingAddressPostalCode}}
      </p>
    </section>

    <hr class="hr" />
    
    <section style="padding: 22px 40px;">
      <div style="display: block; gap: 16px; margin-bottom: 40px;">
        <div style="width: 170px;">
          <p><strong>Order Number</strong></p>
          <p style="font-weight: 500; color: #6F6F6F;">{{orderId}}</p>
        </div>
        <div>
          <p><strong>Order Date</strong></p>
          <p style="font-weight: 500; color: #6F6F6F;">{{orderDate}}</p>
        </div>
        <div>
        <a href="{{linkUrl}}" target="_blank" style="text-decoration: none; text-color: blue;">Order details</a>
        </div>
      </div>
    </section>

    <hr class="hr" />
    
    <section style="padding-top: 30px; padding-bottom: 30px;">
      <p class="footer-text">
        Please contact us if you have any questions. (If you reply to this email, we won't be able to see it.)
      </p>
      <p class="footer-text">© CaseCraze, Inc. All Rights Reserved.</p>
    </section>
  </div>
</body>
</html>
`;

const sendOrderEmail = async (session, orderId, orderDate) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  // Extract address fields, using defaults if undefined
  const customerName = session.customer_details.name || "Customer";
  const address = session.customer_details.address || {};
  const street = `${address.line1 || ""} ${address.line2 || ""}`.trim();
  const city = address.city || "";
  const state = address.state || "";
  const postalCode = address.postal_code || "";

  // Fill in the HTML template with actual data
  const filledHtml = htmlTemplate
    .replace('{{baseUrl}}', `${process.env.FRONTEND_URL}`)
    .replace('{{linkUrl}}', `${process.env.FRONTEND_URL}/customcase/orders/${orderId}`) 
    .replace('{{shippingAddressName}}', customerName)
    .replace('{{shippingAddressStreet}}', street)
    .replace('{{shippingAddressCity}}', city)
    .replace('{{shippingAddressState}}', state)
    .replace('{{shippingAddressPostalCode}}', postalCode)
    .replace('{{orderId}}', orderId)
    .replace('{{orderDate}}', orderDate);

  const mailOptions = {
    from: `CaseCraze <${process.env.EMAIL_USER}>`,
    to: session.customer_details.email,
    subject: "Your OTP Code",
    subject: 'Thanks for your order!',
    html: filledHtml,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendOrderEmail;
