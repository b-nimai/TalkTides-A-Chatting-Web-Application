const expressAsyncHandler = require("express-async-handler");
const User = require('../Schema/UserSchema')
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const OTP = require("../Schema/OtpSchema");
const { mailSender } = require("../Mail/SendMail");
const otpTemplate = require("../Mail/OtpTemplate");
const bcrypt = require('bcrypt');
const wellcomeMail = require("../Mail/WellcomeMail");

// Send OTP Controller
const sendOtpController = expressAsyncHandler(async (req, res) => {
    try {
        const { firstName, email, password, confirmPassword } = req.body;
        // Checking for empty fields
        if(!firstName || !email || !password || !confirmPassword  ) {
            res.status(400);
            throw new Error("Please Enter all the Feilds.");
        }
        if(password !== confirmPassword) {
            res.status(400);
            throw new Error("Password not matched with confirmPassword");
        }
        // Checking for existing user
        const userExists = await User.findOne({email});
        // if User already exist throw an error
        if(userExists) {
            res.status(400);
            throw new Error("Email already registered with another Account.");
        }
        // Generate OTP
        const otp = crypto.randomInt(1000, 9999).toString();
        await OTP.create({
            email,
            otp
        })
        await mailSender(email, "OTP Verification Email", otpTemplate(otp));
        return res.status(201).json({
            success: true,
            message: "OTP Send successfull."
        })
    } catch (error) {
        return res.status(511).json({
            success: false,
            message: error.message
        })
    }
})

// Singup Controller
const signupController = expressAsyncHandler(async (req, res) => {
    try {
        const { firstName, lastName, email, password, otp } = req.body;
        // Confirm OTP
        const otpRecord = await OTP.findOne({ email, otp });
        if (!otpRecord) {

            return res.status(400).json({
                success: false, 
                message: 'Invalid OTP' 
            });
        }
        // Create new user
        const name = firstName.trim() + " " + lastName.trim();
        const newUser = await User.create({
            name,
            email,
            password,
            profilePic: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        });
        // Delete OTP record after successful verification
        await OTP.deleteOne({ email, otp });
        // return response
       await mailSender(email, "Wellcome Email", wellcomeMail(firstName));
        return res.status(201).json({
            id: newUser._id,
            name: newUser.name,
            email: newUser.email
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
});

// Login controller
const loginController = expressAsyncHandler( async(req, res) => {
    const { email, password } = req.body;
    // Check for empty field
    if(!email || !password) {
        res.status(400);
        throw new Error("All fields are required.");
    }

    try {
        // Check for registered User
        const user = await User.findOne({email});
        if(!user){
            return res.status(411).json({
                success: false,
                message: "User not found."
            })
        }
        // Check for valid password
        const matchedPassword = await bcrypt.compare(password, user.password);
        if(!matchedPassword) {
            res.status(411).json({
                success: false,
                message: "Invalid password, try again"
            })
        }
        // sign a token
        const token = jwt.sign({
            id: user._id,
            name: user.name,
            email: user.email,
        },
            process.env.JWT_SECRET,
        {   
            expiresIn: "1d" 
        }
        )

        res.cookie("authToken", token, {
            httpOnly: true,
            secure: false,  // Set this to true if you're on HTTPS
            sameSite: 'lax', // Required for cross-origin requests
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        // return response
        return res.status(201).json({
            name: user.name,
            email: user.email,
        })
    } catch (error) {
        return res.status(501).json({
            success: false,
            message: "Failed to login",
            Error: error.message
        })
    }
})

// Update Profile Controller
const updateProfileController = expressAsyncHandler( async(req, res) => {
    const { userId, pic, bio } = req.body;
    try {
        // find the user by userId
        const user = await User.findById(userId).exec();
        console.log("user:", user)
        // if user not found then throw an error
        if(!user) {
            throw new Error("User not found.");
        }
        if(pic) {
            user.profilePic = pic;
        }
        if(bio) {
            user.Bio = bio;
        }
        const updatedUser = await user.save();
        updatedUser.password = undefined;
        return res.status(200).json(updatedUser);
    } catch (error) {
        return res.status(501).json({
            success: false,
            message: error.message
        })
    }
});

// Logout controller
const logoutController = expressAsyncHandler( async(req, res) => {
    res.clearCookie('authToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
    });
    res.status(200).send({ message: 'Logged out successfully' });
});

// Me controller
const meController = expressAsyncHandler(async (req, res) => {
    // console.log("Req.cookies: ", req.cookies);
    try {
        const token = req.cookies.authToken;
        if(!token) {
            throw new Error("Token not Found");
        }
        // verify token and return user info
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if(!user) {
            throw new Error("User Not Found");
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(404).json({
            message: "Error occurs",
            Error: error.message
        })
    }
})

// Search User controller using query 
const searchUserController = expressAsyncHandler(async (req, res) => {
  const search = req.query.search;

  // Construct search criteria with case-insensitive regex if `search` is provided
  const keyword = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } }
        ]
      }
    : {};

  try {
    // Find users matching the criteria, excluding the current user
    const users = await User.find({
      ...keyword,
      _id: { $ne: req.user._id }  // Exclude the current user
    });

    res.json(users);  // Send the response as JSON
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Error fetching users");
  }
});

module.exports = { 
    sendOtpController,
    signupController, 
    loginController, 
    searchUserController,
    logoutController,
    meController,
    updateProfileController
};