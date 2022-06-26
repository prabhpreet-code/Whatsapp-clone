const mongoose = require("mongoose");
const Whatsapp = require("./models/Whatsapp");
const ChatList = require("./models/ChatList");
const Chats = require("./models/Chats");
const express = require("express");
const Pusher = require("pusher");
const cors = require("cors");
const fs = require("fs");
var multer = require("multer");

const app = express();

mongoose
  .connect("mongodb://localhost/whatsapp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to Mongoose"))
  .catch((err) => console.log("Could not connect to mongoose", err));

const pusher = new Pusher({
  appId: "1419368",
  key: "048d4bdac492dbdfa49f",
  secret: "3e08adf0a149c246cacb",
  cluster: "ap2",
  useTLS: true,
});

const db = mongoose.connection;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${1}${getExt(file.mimetype)}`);
  },
});

const getExt = (mimetype) => {
  switch (mimetype) {
    case "image/png":
      return ".png";
    case "image/jpeg":
      return ".jpg";
  }
};

var upload = multer({ storage: storage });

app.use(express.json());
app.use(cors());

app.post("/api/newuser", async (req, res) => {
  const username = req.body.username;
  const contact = req.body.contact;
  const findUser = await Whatsapp.findOne({ contact: contact });
  if (findUser) return res.json(findUser);
  // return res.status(404).send("The User already exists!");
  const newUser = new Whatsapp();
  newUser.username = username;
  newUser.contact = contact;
  const result = await newUser.save();
  console.log(result);
  res.status(200).json(result);
});

app.post("/api/newchatlist", async (req, res) => {
  const userContact = req.query.userContact;
  const id = req.query.id;
  const currentUser = await Whatsapp.findOne({ contact: userContact });
  const username = req.body.username;
  const contact = req.body.contact;
  const findUser = await ChatList.findOne({
    loggedInUser: id,
    contact: contact,
  });
  if (findUser) return res.status(404).send("The User is already added!");
  const newChatList = new ChatList();
  newChatList.contact = contact;
  newChatList.username = username;
  newChatList.loggedInUser = currentUser._id;

  const result = await newChatList.save();
  currentUser.chatList.push(result._id);
  const whatsappList = await currentUser.save();
  res.status(200).json(whatsappList);
});

app.post("/api/newchat", async (req, res) => {
  const senderChat = new Chats();
  const recieverChat = new Chats();
  senderChat.message = req.body.message;
  recieverChat.message = req.body.message;
  senderChat.recieved = false;
  recieverChat.recieved = true;
  // newChat.recieved = req.body.recieved;
  const savedSenderChat = await senderChat.save();
  const savedRecieverChat = await recieverChat.save();
  const senderId = req.query.senderId;
  const recieverId = req.query.recieverId;
  const senderContact = req.query.senderContact;
  const recieverContact = req.query.recieverContact;
  const senderChatList = await ChatList.findOne({
    loggedInUser: senderId,
    contact: recieverContact,
  });
  console.log(senderChatList);
  const recieverChatList = await ChatList.findOne({
    loggedInUser: recieverId,
    contact: senderContact,
  });
  console.log(recieverChatList);
  // senderChatList.recieved = false;
  senderChatList.chats.push(savedSenderChat._id);
  // recieverChatList.recieved = true;
  recieverChatList.chats.push(savedRecieverChat._id);
  await senderChatList.save();
  await recieverChatList.save();
  pusher.trigger("my-channel", "my-event", {
    recievedContact: recieverContact,
    message: req.body.message,
  });
  res.json(savedSenderChat);
});

app.get("/api/userId", async (req, res) => {
  const contact = req.query.contact;
  const phone = await Whatsapp.findOne({ contact: contact });
  if (!phone) return res.status(404).send("The contact was not found.");
  res.status(200).send(phone._id);
});

app.get("/api/users", async (req, res) => {
  const contact = req.query.contact;
  await Whatsapp.findOne({ contact: contact })
    .populate({ path: "chatList", populate: { path: "chats" } })
    .then((user) => res.json(user));
});

app.get("/api/chatList", async (req, res) => {
  const id = req.query.id;
  const contact = req.query.contact;
  // var myId = JSON.parse(req.query.id);
  // const id = mongoose.Types.ObjectId(req.query.id.trim());
  await ChatList.findOne({ loggedInUser: id, contact: contact })
    .populate({ path: "chats" })
    .then((user) => res.json(user));
});

app.delete("/api/deletechat", async (req, res) => {
  const id = req.query.id;
  const contact = req.query.contact;
  const item = ChatList.findOne({ loggedInUser: id, contact: contact });

  item.updateOne({ $set: { chats: [] } }, function (err, affected) {
    res.status(200);
  });
});

app.delete("/api/deletechatlist", async (req, res) => {
  const id = req.query.id;
  const contact = req.query.contact;
  const result = await ChatList.remove({ loggedInUser: id, contact: contact });
  res.send(result);
});

app.post("/api/postImage", upload.single("post-image"), async (req, res) => {
  const id = req.query.id;

  let requiredUser = await Whatsapp.findOne({ _id: id });
  requiredUser.avatar = fs.readFileSync(`uploads/post-image-1.jpg`);
  await requiredUser.save();
  // const userData = new User({
  //   username: "sahej",
  //   avatar: fs.readFileSync(`uploads/post-image-1.jpg`),
  // });

  try {
    fs.unlinkSync("uploads/post-image-1.jpg");

    console.log("File is deleted.");
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/getImage", async (req, res) => {
  const id = req.query.id;
  const result = await Whatsapp.findOne({ _id: id });
  if (result.avatar) {
    const final = Buffer.from(result.avatar).toString("base64");
    res.json(final);
  }
  return;
  // res.json(result);
});

app.get("/api/name", async (req, res) => {
  const id = req.query.id;
  const result = await Whatsapp.findOne({ _id: id });
  if (result.username) {
    res.json(result.username);
  }
  return;
  // res.json(result);
});

app.post("/api/Changename", async (req, res) => {
  const id = req.query.id;
  const username = req.query.username;

  const result = await Whatsapp.findOne({ _id: id });
  if (result.username) {
    result.username = username;
    result.save();
  }
  return;
  // res.json(result);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
