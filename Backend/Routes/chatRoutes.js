const express = require('express');
const auth = require('../Middlewares/authMiddlewares');
const { 
    accessChatController, 
    fetchChatController, 
    createGroupController,
    renameGroupController,
    addToGroupController,
    removeFromGroupController

} = require('../Controllers/chatController');


const router = express.Router();

router.route('/').post(auth, accessChatController);
router.route('/').get(auth, fetchChatController);
router.route('/group').post(auth, createGroupController);
router.route('/rename').put(auth, renameGroupController);
router.route('/remove').put(auth, removeFromGroupController);
router.route('/add').put(auth, addToGroupController);

module.exports = router;