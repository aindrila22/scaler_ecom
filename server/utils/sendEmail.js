const nodemailer = require("nodemailer");

const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}`,
    html: `
            <h1>Thanks for signing up!</h1>
            <p>Welcome to <strong>Case Cobra</strong>!</p>
            <p>Your OTP code is: <strong>${otp}</strong></p>
            <p>We're excited to have you on board! You can now make your own custom phone case. Start creating your design today!</p>
            <p>Best regards,<br/>The Case Cobra Team</p>
        `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendOTPEmail;
