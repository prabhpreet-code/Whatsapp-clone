import React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import "../styles/DeleteChatBox.css";

function DeleteChatBox({ setOpacity, handleDeleteSuccess }) {
  return (
    <div className="deleteChatBox">
      <p>Are you sure you want to delete this chat?</p>
      <div className="deleteChatBox__buttons">
        <Button
          onClick={handleDeleteSuccess}
          variant="contained"
          color="success"
        >
          Yes
        </Button>
        <Button onClick={setOpacity} variant="outlined" color="error">
          No
        </Button>
      </div>
    </div>
  );
}

export default DeleteChatBox;
