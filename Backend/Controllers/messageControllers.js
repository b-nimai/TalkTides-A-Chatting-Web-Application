const expressAsyncHandler = require("express-async-handler");
const Message = require('../Schema/MessageSchema');
const User = require("../Schema/UserSchema");
const Chat = require("../Schema/ChatSchema");

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

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message
        })
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