const mongoose = require("mongoose");

const whatsappSchema = mongoose.Schema({
  username: {
    type: String,
    minlength: 5,
    maxlength: 50,
  },
  contact: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  avatar: {
    type: Buffer,
  },
  chatList: [{ type: mongoose.Schema.Types.ObjectId, ref: "ChatList" }],
});

module.exports = mongoose.model("Whatsapp", whatsappSchema);
