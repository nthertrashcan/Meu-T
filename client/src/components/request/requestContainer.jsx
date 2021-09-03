import Request from "./request";

import React from "react";

const RequestContainer = (props) => {
  return (
    <div id="requestPanel">
      {props.requests.map((req, index) => (
        <Request
          key={`${req}-${index}`}
          request={req}
          index={index}
          onAccept={props.onAccept}
          onReject={props.onReject}
          acceptFlag={props.acceptFlag}
        />
      ))}
    </div>
  );
};

export default RequestContainer;
