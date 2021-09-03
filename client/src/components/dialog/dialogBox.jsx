import React, { useState } from "react";

const DialogBox = (props) => {
  const [text, setText] = useState("");

  const handleConfirm = () => {
    if (props.type === "remark") {
      props.onConfirm(text);
      setText("");
    } else if (props.type === "streamCall") {
      props.onAcceptCall();
    }
    close();
  };

  const handleCancel = () => {
    if (props.type === "remark") {
      setText("");
    } else if (props.type === "streamCall") {
      props.onRejectCall();
    }
    close();
  };

  const close = () => {
    document.getElementById("dialogBox").close();
  };

  const handleEnterPress = (e) => {
    if (e.which === 13) {
      e.preventDefault();

      let text = e.target.value;
      if (text) {
        handleConfirm();
        setText("");
      }
    }
  };
  return (
    <dialog id="dialogBox">
      {props.type === "remark" ? (
        <textarea
          style={{ resize: "none" }}
          id="input-Text"
          rows="5"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={(e) => handleEnterPress(e)}
        ></textarea>
      ) : null}
      <div id="btn-Container">
        <button onClick={handleConfirm}>Confirm</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
    </dialog>
  );
};

export default DialogBox;
