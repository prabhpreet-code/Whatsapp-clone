import { Avatar } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { black, red } from "@mui/material/colors";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/SidebarChat.css";

function SidebarChat({ name, userContact, handleClick }) {
  const emptyImage =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
  const [avatars, setAvatars] = useState(emptyImage);

  useEffect(() => {
    console.log("hello");
    axios
      .get(`http://localhost:3000/api/userId?contact=${userContact}`)
      .then((response) => {
        axios
          .get(`http://localhost:3000/api/getImage?id=${response.data}`)
          .then((res) => {
            console.log(res);
            const user = `data:image/image/jpg;base64,${res.data}`;
            setAvatars(user);
          });
      });

    return () => {};
  }, [avatars]);
  return (
    <div id={userContact} className="sidebarChat">
      <Avatar src={avatars} />
      <div className="sidebarChat__info">
        <h2>{name}</h2>
        <p>Last message</p>
      </div>
      <DeleteIcon
        onClick={handleClick}
        sx={{ color: red[500], visibility: "hidden" }}
      />
    </div>
  );
}

export default SidebarChat;
