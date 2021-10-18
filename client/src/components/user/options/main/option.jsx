import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVolumeMute,
  faVolumeUp,
  faMicrophoneSlash,
  faMicrophone,
  faBell,
  faStream,
  faDesktop,
} from "@fortawesome/free-solid-svg-icons";

import { useState, useEffect } from "react";

const processName = (optionName) => {
  if (optionName == "Mute")
    return <FontAwesomeIcon icon={faVolumeUp} style={{ fontSize: "15px" }} />;
  else if (optionName == "Microphone-Off")
    return <FontAwesomeIcon icon={faMicrophone} style={{ fontSize: "15px" }} />;
  else if (optionName == "Ping")
    return <FontAwesomeIcon icon={faBell} style={{ fontSize: "15px" }} />;
  else if (optionName == "Stream")
    return <FontAwesomeIcon icon={faDesktop} style={{ fontSize: "15px" }} />;
};

const processIcon = (name, flag) => {
  if (name == "Microphone-Off") {
    if (flag) return faMicrophoneSlash;
    else return faMicrophone;
  } else if (name == "Mute") {
    if (flag) return faVolumeMute;
    else return faVolumeUp;
  } else if (name == "Stream") {
    return faDesktop;
  }
  return faBell;
};

const Option = (props) => {
  const [name, setName] = useState({});

  useEffect(() => {
    let temp = { ...name };

    if (!(props.name in temp)) {
      temp[props.name] = [0, processName(props.name)];
      setName(temp);
    }
  });
  const handleClick = () => {
    let temp = { ...name };
    if (temp[props.name][0] == 0) {
      temp[props.name][0] = 1;
    } else {
      temp[props.name][0] = 0;
    }
    temp[props.name][1] = (
      <FontAwesomeIcon
        icon={processIcon(props.name, temp[props.name][0])}
        style={{ fontSize: "15px" }}
      />
    );
    setName(temp);
    props.onClick();
  };

  return (
    <button className="userOptionBtns" id={props.id} onClick={handleClick}>
      {name[props.name] ? name[props.name][1] : name[props.name]}
    </button>
  );
};

export default Option;
