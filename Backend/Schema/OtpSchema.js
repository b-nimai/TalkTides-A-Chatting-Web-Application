const mongoose = require("mongoose");
const { mailSender } = require("../Mail/SendMail");
const otpTemplate = require("../Mail/OtpTemplate");

const otpSchema = mongoose.Schema({
    email: {
		type: String, 
		trim: true, 
		required: true
	},
    otp: {
		type: String, 
		trim: true, 
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 60 * 5, // OTP expires in 5 minutes
	}
},
{
    timestamps: true,
});

// // Define a function to send emails
// async function sendVerificationEmail(email, otp) {
// 	try {
// 		const mailResponse = await mailSender(
// 			email,
// 			"Verification Email",
// 			otpTemplate(otp)
// 		);
// 		console.log("Email sent successfully: ", mailResponse.response);
// 	} catch (error) {
// 		console.log("Error occurred while sending email: ", error);
// 		throw error;
// 	}
// }

const OTP = mongoose.model("OTP", otpSchema);
module.exports = OTP;