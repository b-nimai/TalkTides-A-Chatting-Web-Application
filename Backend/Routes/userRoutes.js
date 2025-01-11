const express = require('express');
const { 
    signupController, 
    loginController, 
    searchUserController, 
    logoutController, 
    meController, 
    sendOtpController,
    updateProfileController
} = require('../Controllers/userController');
const auth = require('../Middlewares/authMiddlewares');
const router = express.Router();

router.route('/').post(signupController).get(auth, searchUserController);
router.post('/sendOtp', sendOtpController);
router.post('/login', loginController);
router.post('/logout', logoutController);
router.get('/me', meController);
router.put('/update', updateProfileController);


module.exports = router;