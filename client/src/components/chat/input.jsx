import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const Input = (props) => {
  const [text, setText] = useState("");

  const handleButtonClick = (text) => {
    if (text) {
      handleSending(text);
      setText("");
    }
  };

  const handleEnterPress = (e) => {
    if (e.which === 13) {
      e.preventDefault();

      let text = e.target.value;
      if (text) {
        handleSending(text);
        setText("");
      }
    }
  };

  const handleSending = (text) => {
    props.onText(text);
  };

  return (
    <div id="chat-sendMessage">
      <textarea
        onKeyPress={(e) => handleEnterPress(e)}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
        id="chat-textArea"
      ></textarea>
      <div id="chat-send">
        <button
          id="chat-sendBtn"
          onClick={() => handleButtonClick(text)}
        ></button>
        <button id="chat-sendBtnIcon" onClick={() => handleButtonClick(text)}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </div>
  );
};

export default Input;
