const express = require('express');
const auth = require('../Middlewares/authMiddlewares');
const { sendMessageController, fetchAllMessagesController } = require('../Controllers/messageControllers');

const router = express.Router();

router.route('/').post(auth, sendMessageController);
router.route('/:chatId').get(auth, fetchAllMessagesController);

module.exports = router;