const mongoose = require("mongoose");

const chatSchema = mongoose.Schema({
  date: { type: Date },
  message: { type: String, default: "" },
  recieved: { type: Boolean, default: false },
});

module.exports = mongoose.model("Chats", chatSchema);
