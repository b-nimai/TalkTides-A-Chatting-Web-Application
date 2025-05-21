const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
  name: {type: String, trim: true, required: true},
  email: {type: String, trim: true, required: true, unique: true},
  password: {type: String, required: true},
  profilePic : {type: String, default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"},
  isOnline: { type: Boolean, default: false },
  lastSeen: { type: Date, default: Date.now },
  Bio: {type: String, maxlength: 200}
},
{
  timestamps: true,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;