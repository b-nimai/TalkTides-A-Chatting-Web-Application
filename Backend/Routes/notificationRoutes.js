const express = require('express');
const auth = require('../Middlewares/authMiddlewares');
const { fetchNotificationController, markAsReadController } = require('../Controllers/notifyController');

const router = express.Router();

router.get('/', auth, fetchNotificationController);
router.put('/markAsRead', auth, markAsReadController);

module.exports = router;