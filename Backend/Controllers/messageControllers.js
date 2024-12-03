const expressAsyncHandler = require("express-async-handler");
const Message = require('../Schema/MessageSchema');
const User = require("../Schema/UserSchema");
const Chat = require("../Schema/ChatSchema");
const Notification = require("../Schema/Notification");

// Send message controller
const sendMessageController = expressAsyncHandler( async(req, res) => {
    const { content, chatId } = req.body;
    if(!content || !chatId) {
        return res.status(404).json({
            success: false,
            message: "Invalid data passed into request"
        })
    }
    // Creating new message
    let newMessage = {
        sender: req.user._id,
        content,
        chat: chatId
    }

    try {
        let message = await Message.create(newMessage);

        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "name pic email"
        });

        const chat = await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message
        })
        // ----------- For Notifications --------------
        const receivers = chat.users.filter((u) => (
            u._id.toString() !== req.user._id.toString()
        ))
        const notificationContent = chat.isGroupChat
            ? `New Message in ${chat.chatName}`
            : `New Message from ${req.user.name}`;

        const notifications = receivers.map((receiver) => ({
            content: notificationContent,
            sender: req.user._id,
            receiver: receiver._id,
            chat: chatId
        }));
        await Notification.insertMany(notifications);
        // return res
        return res.json(message);
    } catch (error) {
        return res.status(501).json({
            success: false,
            message: error.message
        })
    }
})

// Fetch all message of a Chat
const fetchAllMessagesController = expressAsyncHandler( async(req, res) => {
    try {
        const messages = await Message.find({chat: req.params.chatId})
        .populate('sender', "name profilePic email")
        .populate("chat");
        return res.json(messages);
    } catch (error) {
        return res.status(501).json({
            success: false,
            message: error.message
        })
    }
})

module.exports = { sendMessageController, fetchAllMessagesController }