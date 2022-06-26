import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Avatar, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button from "@mui/material/Button";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { styled } from "@mui/material/styles";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { auth } from "../firebase";
import SidebarChat from "./SidebarChat";
import { useStateValue } from "../StateProvider";
import NewContact from "./NewContact";
import Pusher from "pusher-js";
import Opacity from "./Opacity";
import { blueGrey, green } from "@mui/material/colors";
import DoneIcon from "@mui/icons-material/Done";
import "../styles/Sidebar.css";

function Sidebar() {
  const Input = styled("input")({
    display: "none",
  });
  const emptyImage =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
  const [avatars, setAvatars] = useState(emptyImage);
  // const [username, setUsername] = useState("");
  const [menu, setMenu] = useState("hidden");
  const [userContact, setUserContact] = useState("");
  const [name, setName] = useState("");
  const [sidenavbar, setSidenavbar] = useState(false);
  const [chatList, setChatList] = useState([]);
  const [{ contact, currentUser, userId }, dispatch] = useStateValue();
  const [opacity, setOpacity] = useState(false);
  const [messageIncoming, setMessageIncoming] = useState(0);
  const [profileVisible, setProfileVisible] = useState("hidden");
  const [changeName, setChangeName] = useState("");

  const updateName = (e) => {
    setChangeName(e.target.value);
  };
  const setNavBar = () => {
    setSidenavbar(!sidenavbar);
  };

  const setProfileVisibilityTrue = () => {
    setProfileVisible("visible");
  };

  const setProfileVisibilityFalse = () => {
    setProfileVisible("hidden");
  };

  const setSidebarMenu = () => {
    if (menu === "hidden") {
      setMenu("visible");
    } else {
      setMenu("hidden");
    }
  };

  const logOut = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("contact");
    localStorage.removeItem("currentUser");
    window.location = "/";
    auth.signOut();
  };

  const handleChatClick = (e) => {
    dispatch({
      type: "SET_CURRENTUSER",
      currentUser: e.target.id,
    });
    localStorage.setItem("currentUser", e.target.id);
    console.log(e);
    console.log(e.target.id);
  };

  const handleNewContacts = () => {
    setOpacity(true);
    setMenu("hidden");
  };

  const setOpacityFalse = () => {
    setOpacity(false);
  };

  const setOpacityTrue = () => {
    setOpacity(true);
  };

  const handleNewContactSuccess = (userName, userContact) => {
    const newChatList = {
      username: userName,
      contact: userContact,
    };
    const arrayChatList = [...chatList, newChatList];
    setChatList(arrayChatList);
    axios
      .post(
        `http://localhost:3000/api/newchatlist?userContact=${contact}&id=${userId}`,
        { username: userName, contact: userContact }
      )
      .then((res) => {});
    setUserContact("");
    setName("");
  };

  const handleClick = (e) => {
    console.log(e.nativeEvent.path[2].id);

    axios
      .delete(
        `http://localhost:3000/api/deletechatlist?id=${userId}&contact=${e.nativeEvent.path[2].id}`
      )
      .then((res) => {
        toast.success("Successfully user deleted!");
        setMessageIncoming((e) => e + 1);
      });
  };

  useEffect(() => {
    console.log(typeof contact);
    console.log(contact);
    axios
      .get(`http://localhost:3000/api/users?contact=${contact}`)
      .then((res) => {
        console.log(res);
        const chats = res.data.chatList;
        setChatList(chats);
      });
    return () => {
      setMessageIncoming(0);
    };
  }, [messageIncoming]);

  useEffect(() => {
    axios.get(`http://localhost:3000/api/getImage?id=${userId}`).then((res) => {
      console.log(res);
      const user = `data:image/image/jpg;base64,${res.data}`;
      setAvatars(user);
    });
    axios.get(`http://localhost:3000//api/name?id=${userId}`).then((res) => {
      console.log(res);
      const userDetails = res.data;
      // setUsername(userDetails);
      setChangeName(userDetails);
    });
    return () => {};
  }, [avatars]);

  const submitNewPost = () => {
    console.log("photoooo");
    let input = document.querySelector('input[type="file"]');
    console.log(input);
    console.log(input.files[0]);

    if (input.files[0]) {
      let data = new FormData();
      data.append("post-image", input.files[0]);
      const API_URL_IMAGE = `http://localhost:3000/api/postImage?id=${userId}`;
      fetch(API_URL_IMAGE, {
        method: "POST",
        body: data,
      }).then(() => {
        console.log("senttttt");
      });
      setAvatars("");
    }

    const API_URL_NAME = `http://localhost:3000/api/Changename?id=${userId}&username=${changeName}`;

    fetch(API_URL_NAME, {
      method: "POST",
    }).then(() => {
      console.log("senttttt");
    });
    setSidenavbar(!sidenavbar);
    toast.success("Profile successfully updated");
  };

  if (!sidenavbar) {
    return (
      <div className="sidebar">
        <div className="sidebar__header">
          {/* <Avatar
            style={{ cursor: "pointer" }}
            onClick={setNavBar}
            src="https://avatars.githubusercontent.com/u/66708921?s…00&u=fadba647f0b8d652d6e7e79c91cde1df41cafb3f&v=4"
          /> */}

          <Avatar
            style={{ cursor: "pointer" }}
            onClick={setNavBar}
            src={avatars}
          />
          <div className="sidebar__headerRight">
            <IconButton>
              <DonutLargeIcon />
            </IconButton>
            <IconButton>
              <ChatIcon />
            </IconButton>
            <IconButton onClick={setSidebarMenu}>
              <MoreVertIcon />
            </IconButton>
          </div>
          <div style={{ visibility: menu }} className="sidebar__menu">
            <ul>
              <li onClick={handleNewContacts}>New Contact</li>
              <li onClick={logOut}>Log Out</li>
            </ul>
          </div>
        </div>
        <div className="sidebar__search">
          <div className="sidebar__searchContainer">
            <SearchIcon />
            <input type="text" placeholder="Search or start new chat" />
          </div>
        </div>
        <div className="sidebar__chats">
          <div
            onClickCapture={handleChatClick}
            className="sidebar__chatsContainer"
          >
            {chatList.map((chat) => (
              <SidebarChat
                name={chat.username}
                userContact={chat.contact}
                handleClick={handleClick}
              />
            ))}
          </div>
        </div>
        {opacity && (
          <div>
            <NewContact
              handleSuccess={handleNewContactSuccess}
              setOpacityTrue={setOpacityTrue}
              setOpacityFalse={setOpacityFalse}
            />
            <Opacity opacityChat={""} />
          </div>
        )}
        <ToastContainer />
      </div>
    );
  } else {
    return (
      <div className="profile">
        <div className="profile__nav">
          <div className="profile__nav__innerContainer">
            <ArrowBackIcon onClick={setNavBar} />
            <p>Profile</p>
          </div>
          <DoneIcon onClick={submitNewPost} sx={{ color: green[500] }} />
        </div>
        <div
          onMouseEnter={setProfileVisibilityTrue}
          onMouseLeave={setProfileVisibilityFalse}
          className="profile__changeProfile"
        >
          {/* <img
            className="profile__photo"
            src="https://avatars.githubusercontent.com/u/66708921?s…00&u=fadba647f0b8d652d6e7e79c91cde1df41cafb3f&v=4"
            alt=""
          /> */}
          <img className="profile__photo" src={avatars} alt="" />

          <div
            className="profile__opacity"
            style={{ visibility: profileVisible }}
          ></div>
          <div
            className="profile__uploadButton"
            style={{ visibility: profileVisible }}
          >
            <label for="inputTag">
              Select Image <br />
              <PhotoCamera size="large" />
              <input
                id="inputTag"
                type="file"
                name="post-image"
                accept="image/*"
              />
              <br />
              <span id="imageName"></span>
            </label>
            {/* <label htmlFor="icon-button-file">
              <Input
                type="file"
                name="post-image"
                accept="image/*"
                id="icon-button-file"
              />
              { <IconButton
                sx={{ color: blueGrey[50] }}
                aria-label="upload picture"
                component="span"
                size="large"
              > }
              <PhotoCamera size="large" />
              </IconButton>
            </label> */}
          </div>
        </div>
        {/* <button id="form-post-submit" type="button" onClick={submitNewPost}>
          Submit
        </button> */}
        <div className="profile__username">
          <p>Your name</p>
          <div className="profile__usernameEdit">
            <input
              value={changeName}
              onChange={updateName}
              type="text"
              placeholder="name"
            />
            <ModeEditIcon />
          </div>
        </div>
        <p>
          This is not your username or pin. This name will be visible to your
          WhatsUpp contacts.
        </p>
      </div>
    );
  }
}

export default Sidebar;
