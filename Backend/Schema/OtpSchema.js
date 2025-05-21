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


const OTP = mongoose.model("OTP", otpSchema);
module.exports = OTP;