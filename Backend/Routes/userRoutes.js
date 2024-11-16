const express = require('express');
const { 
    signupController, 
    loginController, 
    searchUserController, 
    logoutController, 
    meController 
} = require('../Controllers/userController');
const auth = require('../Middlewares/authMiddlewares');
const router = express.Router();

router.route('/').post(signupController).get(auth, searchUserController);
router.post('/login', loginController);
router.post('/logout', logoutController);
router.get('/me', meController);


module.exports = router;