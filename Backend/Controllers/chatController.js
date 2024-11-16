const expressAsyncHandler = require("express-async-handler");
const  Chat  = require("../Schema/ChatSchema");
const User = require("../Schema/UserSchema");

// One to One chat
const accessChatController = expressAsyncHandler( async(req, res) => {
    const { userId } = req.body;
    if(!userId) {
        console.log("UserId not found");
        return res.sendStatus(400);
    }
    // Checking already chat availble or not
    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: {$elemMatch: {$eq: req.user._id}}},
            { users: { $elemMatch: {$eq: userId}}}
        ]
    }).populate("users", "-password").populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email"
    });
    // if Chat exist then find return it otherwise create a new chat
    if(isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        const sendTo = await User.findById(userId);
        const chatData = {
            chatName: sendTo.name,
            isGroupChat: false,
            users: [req.user._id, userId]
        };

        try {
            const createChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({_id: createChat._id}).populate("users", "-password");
            res.status(200).send(fullChat);
        } catch (error) {
            res.status(400).json({
                message: error.message
            })
        }
    }
})

// Fetch all chats
const fetchChatController = expressAsyncHandler( async(req, res) => {
    try {
        Chat.find({ users: { $elemMatch: {$eq: req.user._id}}})
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({updatedAt: -1})
        .then(async (result) => {
            result= await User.populate(result, {
                path: "latestMessage.sender",
                select: "name pic email"
            });
            res.status(200).send(result);
        })
        
    } catch (error) {
        return res.status(501).json({
            message: "Error while fetching all chats",
            Error: error.message
        })
    }
})

// Create Group chat
const createGroupController = expressAsyncHandler( async(req, res) => {
    if(!req.body.users || !req.body.name) {
        return res.status(400).send({
            message: "Please fill all the feilds"
        });
    };

    let users = JSON.parse(req.body.users);
    if(users.length < 2) {
        return res.status(400).json({
            message: "More than 2 users are required"
        });
    }
    users.push(req.user);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users,
            isGroupChat: true,
            groupAdmin:req.user
        });
        const fullGroupChat = await Chat.findById(groupChat._id)
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

        return res.status(200).json(fullGroupChat);
    } catch (error) {
        return res.status(400).json({
            message: "Error while creating group chat",
            Error: error.message
        })
    }
})

// Rename the group
const renameGroupController = expressAsyncHandler( async(req, res) => {
    const { chatId, chatName } = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName
        },
        {
            new: true
        }
    ).populate("users", "-password")
    .populate("groupAdmin", "-password");

    if(!updatedChat) {
        return res.status(404).json({
            message: "Chat not found"
        })
    } else{
        return res.status(201).json(updatedChat);
    }
})

// Add member to group
const addToGroupController = expressAsyncHandler( async(req, res) => {
    const { chatId, userId } = req.body;
    try {
        const added = await Chat.findByIdAndUpdate(
            chatId,
            {
                $push: {users: userId}
            },
            {
                new: true
            }
        ).populate("users", "-password")
        .populate("groupAdmin", "-password");

        if(!added) {
            return res.status(404).send("Chat not found");
        }
        return res.status(201).json(added);
    } catch (error) {
        return res.status(503).json({
            message: "Error occurs while adding new member to the group",
            Error: error.message
        })
    }
});

// Remove a member from group
const removeFromGroupController = expressAsyncHandler( async(req, res) => {
    const { chatId, userId } = req.body;
    try {
        const remove = await Chat.findByIdAndUpdate(
            chatId,
            {
                $pull: {users: userId}
            },
            {
                new: true
            }
        ).populate("users", "-password")
        .populate("groupAdmin", "-password");

        if(!remove) {
            return res.status(404).send("Chat not found");
        }
        return res.status(201).json(remove);
    } catch (error) {
        return res.status(503).json({
            message: "Error occurs while adding new member to the group",
            Error: error.message
        })
    }
})

module.exports = { 
    accessChatController, 
    fetchChatController, 
    createGroupController, 
    renameGroupController,
    addToGroupController,
    removeFromGroupController 
};