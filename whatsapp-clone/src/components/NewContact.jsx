import CancelIcon from "@mui/icons-material/Cancel";
import DoneIcon from "@mui/icons-material/Done";
import PersonIcon from "@mui/icons-material/Person";
import CallIcon from "@mui/icons-material/Call";
import { black, red, green } from "@mui/material/colors";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/NewContact.css";

function NewContact({ handleSuccess, setOpacityTrue, setOpacityFalse }) {
  const [userContact, setUserContact] = useState("");
  const [name, setName] = useState("");

  const handleNewContactFailure = () => {
    setOpacityFalse();
    setUserContact("");
    setName("");
  };

  const handleContactSuccess = () => {
    handleSuccess(name, userContact);
    toast.success("User successfully added!");
    setOpacityFalse();
  };

  const setNewName = (e) => {
    setName(e.target.value);
  };

  const setNewUserContact = (e) => {
    setUserContact(e.target.value);
  };

  return (
    <div className="sidebar__newContact">
      <div className="sidebar__newContactHeader">
        <CancelIcon
          onClick={handleNewContactFailure}
          sx={{ color: red[500] }}
        />
        <h4>New Contact</h4>
        <DoneIcon onClick={handleContactSuccess} sx={{ color: green[500] }} />
      </div>
      <div className="sidebar__newContactName">
        <PersonIcon />
        <input
          type="text"
          placeholder="Name"
          onChange={setNewName}
          value={name}
        />
      </div>
      <div className="sidebar__newContactNumber">
        <CallIcon />
        <input
          type="text"
          placeholder="Number"
          onChange={setNewUserContact}
          value={userContact}
        />
      </div>
      <ToastContainer />
    </div>
  );
}

export default NewContact;
