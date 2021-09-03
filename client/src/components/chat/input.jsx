import React, { useState } from "react";

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
      <button
        onClick={() => handleButtonClick(text)}
        id="chat-sendBtn"
      ></button>
    </div>
  );
};

export default Input;
