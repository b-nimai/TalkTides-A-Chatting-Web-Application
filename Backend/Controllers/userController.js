const expressAsyncHandler = require("express-async-handler");
const User = require('../Schema/UserSchema')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Singup Controller
const signupController = expressAsyncHandler(async (req, res) => {
    const { name, email, password, confirmPassword, pic } = req.body;
    // Checking for empty fields
    if(!name || !email || !password || !confirmPassword  ) {
        res.status(400);
        throw new Error("Please Enter all the Feilds.");
    }
    // Checking for existing user
    const userExists = await User.findOne({email});
    // if User already exist throw an error
    if(userExists) {
        res.status(400);
        throw new Error("User Already exists.");
    }
    // hashed the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create new user
    const newUser = await User.create({
        name,
        email,
        password : hashedPassword,
        pic
    });
    // return response
    if(newUser) {
        res.status(201).json({
            id: newUser._id,
            name: newUser.name,
            email: newUser.email
        })
    } else {
        res.status(400);
        throw new Error("Failed to create the User");
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
            token

        })
    } catch (error) {
        return res.status(501).json({
            success: false,
            message: "Failed to login",
            Error: error.message
        })
    }
})

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
    signupController, 
    loginController, 
    searchUserController,
    logoutController,
    meController
};