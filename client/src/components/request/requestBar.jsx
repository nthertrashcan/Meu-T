import RequestContainer from "./requestContainer";
import React, { useState, useEffect } from "react";

const RequestBar = (props) => {
  const [flag, setFlag] = useState(false);
  const [requests, setRequests] = useState([]);
  const [acceptFlag, setAcceptFlag] = useState({});

  useEffect(() => {
    const req = props.onRequest();

    if (req.length > 0) {
      const time = new Date().toLocaleTimeString();
      setRequests([[...req, time], ...requests]);
      props.onRequestRead();
    }
  });

  const handleClick = () => {
    setFlag(!flag);
  };

  const handleAccept = (e) => {
    const { user, text, time } = e;
    let accFlag = { ...acceptFlag };
    accFlag[`${user}-${text.substring(0, 10)}-${time}`] = true;
    setAcceptFlag(accFlag);

    reply(e["user"], 1);
    props.onRequestAccept(e);
  };

  const handleReject = (e) => {
    reply(e["user"], 0);
    setRequests(requests.filter((req, index) => index !== e["index"]));
  };

  const reply = (user, flag) => {
    if (props.peers[user]) {
      props.peers[user].send(`--2${props.myId}--q${flag}`);
    }
  };

  return (
    <nav className="navbar navbar-light bg-info text-center" id="requestBar">
      <span onClick={handleClick} className="">
        {"Requests"}
      </span>
      {flag ? (
        <RequestContainer
          onAccept={(e) => handleAccept(e)}
          onReject={(e) => handleReject(e)}
          requests={requests}
          acceptFlag={acceptFlag}
        />
      ) : null}
    </nav>
  );
};

export default RequestBar;
