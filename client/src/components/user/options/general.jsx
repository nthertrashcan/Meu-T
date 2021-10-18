import React from "react";
import Option from "./main/option";

const General = (props) => {
  return (
    <div id="userGeneralOptions">
      <Option id={`${props.id}-muteBtn`} onClick={props.onMute} name={"Mute"} />
      {/* <Option
        id={`${props.id}-streamBtn`}
        onClick={props.onStream}
        name="Stream"
      /> */}
      <Option onClick={props.onPing} name={"Ping"} />
      <Option
        id={`${props.id}-microphoneBtn`}
        onClick={props.onMicrophone}
        name={"Microphone-Off"}
      />
    </div>
  );
};

export default General;
