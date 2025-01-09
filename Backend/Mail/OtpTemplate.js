const otpTemplate = (otp) => {
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification Email</title>
    <style>
      body {
        background-color: #f7f8fa;
        font-family: 'Arial', sans-serif;
        font-size: 16px;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 30px auto;
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
      .header {
        background-color: #4caf50;
        padding: 20px;
        text-align: center;
        color: #ffffff;
        font-size: 24px;
        font-weight: bold;
      }
      .body {
        padding: 20px;
        text-align: center;
      }
      .message {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      .highlight {
        font-size: 22px;
        font-weight: bold;
        color: #4caf50;
      }
      .cta {
        display: inline-block;
        margin-top: 20px;
        padding: 10px 20px;
        background-color: #4caf50;
        color: #ffffff;
        text-decoration: none;
        font-weight: bold;
        border-radius: 5px;
        font-size: 16px;
      }
      .footer {
        margin-top: 30px;
        font-size: 14px;
        color: #777;
        text-align: center;
        padding: 10px 20px;
      }
      .footer a {
        color: #4caf50;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">Welcome to TalkTides </div>
      <div class="body">
        <p class="message">Your OTP is: <h2 class="highlight">${otp}</h2> </p>
        <p>Please use this OTP to verify your account or reset your password. This code is valid for the next 5 minutes.</p>
        <p>If you did not request this verification, please ignore this email.</p>
      </div>
      <div class="footer">
        <p>Need help? Contact us at <a href="mailto:officialnill2000@gmail.com">officialnill2000@gmail.com</a></p>
      </div>
    </div>
  </body>
  </html>`;
};

module.exports = otpTemplate;
