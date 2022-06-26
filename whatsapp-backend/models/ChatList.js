const mongoose = require("mongoose");

const chatListSchema = mongoose.Schema({
  loggedInUser: { type: mongoose.Schema.Types.ObjectId, ref: "Whatsapp" },
  username: {
    type: String,
    // required: true,
    minlength: 5,
    maxlength: 50,
  },
  contact: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 10,
  },
  avatar: {
    type: Buffer,
  },
  chats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chats" }],
});

module.exports = mongoose.model("ChatList", chatListSchema);
