const expressAsyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../Schema/UserSchema');


const auth = expressAsyncHandler(async (req, res, next) => {
  // Check if the token exists in cookies
  const token = req.cookies.authToken;

    if(token) {
        try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user by ID, exclude password, and attach user data to req
        req.user = await User.findById(decoded.id).select("-password");

        next(); // Proceed to the next middleware or route handler
        } catch (error) {
        // Token verification failed
        return res.status(401).json({
            message: error.message,
            customMessage: "Not authorized, token verification failed"
        });
        }
    } else {
        // No token in cookies
        return res.status(401).json({
        customMessage: "Not authorized, token missing"
        });
    }
});



module.exports = auth;