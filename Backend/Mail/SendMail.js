const nodemailer = require('nodemailer');

const mailSender = async (email, sub, body)=> {
  
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
    })

    const mailOptions = {
      from: 'officialnill2000@gmail.com',
      to: `${email}`,
      subject: `${sub}`,
      html: `${body}`,
    };
    
    try {
      await transporter.sendMail(mailOptions) 
      return "OTP Send."
    } catch (error) {
      return error.message
    }
}
module.exports = { mailSender }