const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {type: String, trim: true, required: true},
    email: {type: String, trim: true, required: true, unique: true},
    password: {type: String, required: true},
    profilePic : {type: String, default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
},
{
    timestamps: true,
});

const User = mongoose.model("User", userSchema);
module.exports = User;