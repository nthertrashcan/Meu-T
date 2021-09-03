import React from "react";
import General from "./options/general";
import Special from "./options/special";

const UserOptions = (props) => {
  return (
    <div id={`${props.id}-userOptions`} hidden>
      <General
        name={props.name}
        id={props.id}
        onPing={props.onPing}
        onStream={props.onStream}
        onMute={props.onMute}
        onMicrophone={props.onMicrophone}
      />
      {props.requestStatus ? (
        <Special onGiveUp={props.onGiveUp} name={props.name} id={props.id} />
      ) : null}
    </div>
  );
};

export default UserOptions;
