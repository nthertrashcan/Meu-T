import MessageBox from "./messageBox";
import Selection from "./select";
import Input from "./input";

import React, { useState, useEffect } from "react";

const ChatBox = (props) => {
  const [selected, setSelected] = useState("Everyone");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const msg = props.incomingMsg();
    if (msg.length > 0) {
      const [user, text] = msg;

      if (text) {
        console.log("Incoming :", text);
        const key = `${text}-${user}-${Date.now()}`;
        const message = createContainer(text, key, user, 0);
        setMessages([...messages, message]);
      }
      props.onReading();
    }
  });

  const handleSelection = (e) => {
    setSelected(e);
  };

  const handleText = (e) => {
    const [user, text] = [selected, e];
    if (text) {
      const key = `${user}-${text}-${Date.now()}`;
      const message = createContainer(text, key, user, 1);
      setMessages([...messages, message]);
      send(text);
    }
  };

  const handleSelectionClick = (e) => {
    let value = e.target.childNodes[0].innerHTML;
    if (!value) value = e.target.childNodes[0].data;

    if (value) {
      if (value === "Everyone") handleSelection(value);
      else {
        for (let user of props.users) {
          if (user["name"].includes(value)) {
            handleSelection(user.name);
            break;
          }
        }
      }
    }
  };

  const createContainer = (text, key, user, flag) => {
    let { fmsg, current } = process(text);

    return (
      <div
        value={user}
        onDoubleClick={(e) => handleSelectionClick(e)}
        key={key}
        className={`container ${flag ? "darker" : ""}`}
      >
        <div id="chatUserName" style={{ cursor: "pointer" }}>
          {user.substring(0, 8)}
        </div>

        <div id={flag ? "chat-outgoingMsg" : "chat-incomingMsg"}>
          <span>{fmsg}</span>
        </div>
        <span className="time-right">{current.toLocaleTimeString()}</span>
      </div>
    );
  };

  const send = (text) => {
    if (selected !== "Everyone") {
      let user;
      for (let u of props.users) {
        if (u["id"] === selected) {
          user = u["conn"];
          break;
        }
      }
      if (user) user.send(`--0${props.myId}--m${text}`);
    } else {
      for (let u of props.users) {
        u["conn"].send(`--0${props.myId}--m${text}`);
      }
    }
  };

  return (
    <div id="chat-box">
      <Selection
        users={props.users}
        selected={selected}
        onSelection={(e) => handleSelection(e)}
      />
      <MessageBox messages={messages} />
      <Input onText={(e) => handleText(e)} />
    </div>
  );
};

export default ChatBox;

const process = (text) => {
  let current = new Date();
  let fmsg = "";
  for (let m of text.split(" ")) {
    let temp = "";
    if (m.length > 29) {
      let i;
      for (i = 0; i < m.length; i += 30) temp += m.substring(i, i + 30) + " ";

      temp += m.substring(i, m.length);
    } else {
      temp = m;
    }
    fmsg += temp + " ";
  }
  return {
    fmsg,
    current,
  };
};
