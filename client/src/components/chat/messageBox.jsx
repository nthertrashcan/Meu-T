import React, { useEffect } from "react";

const MessageBox = (props) => {
  useEffect(() => {
    const box = document.getElementById("chat-messageBox");
    if (box) {
      box.scrollTop = box.scrollHeight;
    }
  });
  return (
    <React.Fragment>
      <div id="chat-messageBox">{props.messages}</div>
    </React.Fragment>
  );
};

export default MessageBox;
