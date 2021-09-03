import React from "react";

const Option = (props) => {
  return (
    <button id={props.id} onClick={props.onClick}>
      {props.name}
    </button>
  );
};

export default Option;
