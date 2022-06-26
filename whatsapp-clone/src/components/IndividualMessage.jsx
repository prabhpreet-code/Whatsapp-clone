import React from "react";
import "../styles/IndividualMessage.css";

function IndividualMessage({
  recieverName,
  senderContact,
  message,
  date,
  recieved,
}) {
  if (recieved) {
    return (
      <p className="chat__message">
        <span className="chat__name">{recieverName}</span>
        {message}
        <span className="chat__timestamp">{date}</span>
      </p>
    );
  } else {
    return (
      <p className="chat__message chat__recieved">
        <span className="chat__name">{senderContact}</span>
        {message}
        <span className="chat__timestamp">{date}</span>
      </p>
    );
  }
}

export default IndividualMessage;
