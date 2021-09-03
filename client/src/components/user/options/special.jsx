import React from "react";
import Option from "./main/option";

const Special = (props) => {
  const handlePush = () => {};
  const handlePull = () => {};

  return (
    <div>
      <Option onClick={handlePush} name="Pull" />
      <Option onClick={handlePull} name="Push" />
      <Option onClick={props.onGiveUp} name="Give Up" />
    </div>
  );
};

export default Special;
