import React, { useState } from "react";

const Request = (props) => {
  const [viewFlag, setViewFlag] = useState({});

  const request = (user, remark, index) => {
    let reqMsg = "";
    if (remark.length > 40) reqMsg = remark.substring(0, 40).trim() + "...";
    else reqMsg = remark;
    return (
      <div
        key={`${user}-${Date.now()}-${remark.substring(0, 10)}`}
        id="req-container"
        onMouseDown={() => handleMouseDown(user, remark)}
        onMouseLeave={() => handleMouseLeave(user, remark)}
      >
        <span id="req-msg">{user.substring(0, 8)}</span>
        {viewFlag[`${user}-${remark.substring(0, 10)}-${props.request[2]}`] ? (
          handleRequestView(user, remark, index)
        ) : (
          <span className="time-right" style={{ backgroudColor: "Red" }}>
            {props.request[2]}
          </span>
        )}
      </div>
    );
  };

  const handleMouseDown = (user, remark) => {
    let _viewFlag = { ...viewFlag };
    _viewFlag[`${user}-${remark.substring(0, 10)}-${props.request[2]}`] = true;
    setViewFlag(_viewFlag);
  };

  const handleMouseLeave = (user, remark) => {
    let _viewFlag = { ...viewFlag };
    _viewFlag[`${user}-${remark.substring(0, 10)}-${props.request[2]}`] = false;
    setViewFlag(_viewFlag);
  };

  const handleRequestView = (user, text, index) => {
    let rows = 1;
    const letters = 23;

    if (text.length < letters) {
      rows = 1;
    } else if (text.length < letters * 2) {
      rows = 2;
    } else if (text.length < letters * 3) {
      rows = 3;
    } else if (text.length < letters * 4) {
      rows = 4;
    } else if (text.length < letters * 5) {
      rows = 5;
    }

    return (
      <div
        id="req-msgContainer"
        style={{
          display: "grid",
        }}
      >
        <textarea
          readOnly
          value={text}
          id="reqView-textArea"
          rows={rows}
        ></textarea>

        {props.acceptFlag[
          `${user}-${text.substring(0, 10)}-${props.request[2]}`
        ] ? null : (
          <div id="reqView-btnContainer">
            <button
              className="requestConfirmationBtns"
              onMouseDown={() =>
                props.onAccept({
                  user: user,
                  index: index,
                  text: text,
                  time: props.request[2],
                })
              }
            >
              {"Accept"}
            </button>
            <button
              className="requestConfirmationBtns"
              onMouseDown={() =>
                props.onReject({
                  user,
                  index: index,
                  remark: text,
                  time: props.request[2],
                })
              }
            >
              {"Reject"}
            </button>
          </div>
        )}
      </div>
    );
  };

  return request(props.request[0], props.request[1], props.index);
};

export default Request;
