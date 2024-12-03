const expressAsyncHandler = require("express-async-handler");
const Notification = require("../Schema/Notification");

// Fetch Notification controller
const fetchNotificationController = expressAsyncHandler(async(req, res) => {
    try {
        const notifications = await Notification.find({
            receiver: req.user._id,
            isRead: false
        })
        .populate('sender', 'name')
        .populate('chat', 'chatName isGroupChat')
        .sort({createdAt: -1})
        return res.status(200).json(notifications);
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch notifications",
            Error: error.message
        })
    }
})

// Mark as read Controller
const markAsReadController = expressAsyncHandler(async (req, res) => {
    const { notificationId } = req.body;
    try {
        await Notification.findByIdAndUpdate(notificationId, {isRead: true});
        return res.status(200).json({
            success: true,
            message: "Notification mark as read"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

module.exports = {fetchNotificationController, markAsReadController}

