import { Avatar, IconButton } from "@mui/material";
import React, { useState, useRef, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import IndividualMessage from "./IndividualMessage";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useStateValue } from "../StateProvider";
import Pusher from "pusher-js";
import Opacity from "./Opacity";
import DeleteChatBox from "./DeleteChatBox";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Chat.css";

function Chat() {
  const messagesEndRef = useRef(null);
  const [chats, setChats] = useState([]);
  const [chatLists, setChatLists] = useState({});
  const [userChat, setUserChats] = useState("");
  const [messageIncoming, setMessageIncoming] = useState(0);
  const [opacity, setOpacity] = useState(false);
  const [{ contact, userId, messageRecieved }, dispatch] = useStateValue();
  const emptyImage =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
  const [avatars, setAvatars] = useState(emptyImage);
  const currentUser = localStorage.getItem("currentUser");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const setNewUserChat = (e) => {
    setUserChats(e.target.value);
  };

  const setOpacityFalse = () => {
    setOpacity(false);
  };

  const handleSuccess = () => {
    toast.success("Successfully chat deleted!");
    setOpacity(false);
    setChats([]);
    axios
      .delete(
        `http://localhost:3000/api/deletechat?id=${userId}&contact=${currentUser}`
      )
      .then((res) => {});
  };

  const setOpacityTrue = () => {
    setOpacity(true);
  };

  function timeNow() {
    var d = new Date(),
      h = (d.getHours() < 10 ? "0" : "") + d.getHours(),
      m = (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
    const time = `${h}:${m}`;
    return time;
  }

  const handleSubmitChats = async (e) => {
    e.preventDefault();
    const newMessage = {
      message: userChat,
      recieved: false,
      date: timeNow(),
    };
    const newChatArray = [...chats, newMessage];
    setChats(newChatArray);
    setUserChats("");

    let recieverId = "";
    await axios
      .get(`http://localhost:3000/api/userId?contact=${currentUser}`)
      .then((res) => {
        console.log(res);
        recieverId = res.data;
      });

    axios
      .post(
        `http://localhost:3000/api/newchat?senderId=${userId}&senderContact=${contact}&recieverId=${recieverId}&recieverContact=${currentUser}`,
        { message: userChat, date: timeNow() }
      )
      .then((res) => {
        console.log(res.data);
      });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  useEffect(() => {
    console.log("hyyyy");
    axios
      .get(
        `http://localhost:3000/api/chatList?contact=${currentUser}&id=${userId}`
      )
      .then((res) => {
        console.log(res);
        const result = res.data.chats;
        setChatLists(res.data);
        setChats(result);
      });
  }, [currentUser, messageIncoming]);

  Pusher.logToConsole = true;

  useEffect(() => {
    var pusher = new Pusher("048d4bdac492dbdfa49f", {
      cluster: "ap2",
    });
    var channel = pusher.subscribe("my-channel");
    channel.bind("my-event", function ({ recievedContact, message }) {
      if (recievedContact === contact) {
        console.log(messageIncoming);
        setMessageIncoming((e) => e + 1);
      }
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      setMessageIncoming(0);
    };
  }, []);

  useEffect(() => {
    console.log("hello");
    async function setChatProfile() {
      try {
        await axios
          .get(`http://localhost:3000/api/userId?contact=${currentUser}`)
          .then((response) => {
            axios
              .get(`http://localhost:3000/api/getImage?id=${response.data}`)
              .then((res) => {
                console.log(res);
                const user = `data:image/image/jpg;base64,${res.data}`;
                setAvatars(user);
              });
          });
      } catch (error) {
        setAvatars(emptyImage);
      }
    }
    setChatProfile();

    return () => {};
  }, [currentUser]);

  if (currentUser === null || currentUser === "") {
    return (
      <div className="chat">
        <img
          src="https://tm.ibxk.com.br/2021/11/05/05144353371253.jpg"
          alt=""
        />
      </div>
    );
  } else {
    return (
      <div className="chat">
        <div className="chat__header">
          <Avatar src={avatars} />
          <div className="chat__headerInfo">
            <h3>{chatLists.username}</h3>
            <p>Last seen at...</p>
          </div>
          <div className="chat__headerRight">
            <IconButton>
              <SearchIcon />
            </IconButton>
            <IconButton>
              <AttachFileIcon />
            </IconButton>
            <IconButton onClick={setOpacityTrue}>
              <DeleteIcon />
            </IconButton>
          </div>
        </div>
        <div className="chat__body">
          {chats.map((chat) => (
            <IndividualMessage
              recieverName={chatLists.username}
              senderContact={contact}
              message={chat.message}
              date={chat.date}
              recieved={chat.recieved}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="chat__footer">
          <InsertEmoticonIcon />
          <form
            action="
        "
            onSubmit={handleSubmitChats}
          >
            <input
              onChange={setNewUserChat}
              value={userChat}
              type="text"
              placeholder="Type a message"
              // onKeyDown={handleSubmitChats}
            />
            <button type="submit">Send a message</button>
            <KeyboardVoiceIcon />
          </form>
        </div>

        {opacity && (
          <div>
            <Opacity opacityChat={"opacity-chat"} />
            <DeleteChatBox
              setOpacity={setOpacityFalse}
              handleDeleteSuccess={handleSuccess}
            />
          </div>
        )}
        <ToastContainer />
      </div>
    );
  }
}
export default Chat;
