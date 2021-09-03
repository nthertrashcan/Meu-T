import UserOptions from "./userOptions";
import React from "react";

const User = (props) => {
  const handleOnMouseEnter = () => {
    setFlag(false);
  };

  const handleOnMouseLeave = () => {
    setFlag(true);
  };

  const setFlag = (flag) => {
    const options = document.getElementById(`${props.id}-userOptions`);
    const name = document.getElementById(`${props.id}-userName`);
    if (options) options.hidden = flag;
    if (name) name.hidden = !flag;
  };

  return (
    <div
      id="user"
      onMouseEnter={() => handleOnMouseEnter()}
      onMouseLeave={() => handleOnMouseLeave()}
    >
      <textarea
        style={{ cursor: "pointer" }}
        readOnly
        id={`${props.id}-userName`}
        className={`userName`}
        value={props.name}
      ></textarea>

      <UserOptions
        name={props.name}
        id={props.id}
        onPing={() => props.onPing(props)}
        onPush={() => props.onPush(props)}
        onPull={() => props.onPull(props)}
        onGiveUp={() => props.onGiveUp(props)}
        requestStatus={props.requestStatus}
        onStream={props.onStream}
        onMute={props.onMute}
        onMicrophone={props.onMicrophone}
      />
    </div>
  );
};

export default User;
