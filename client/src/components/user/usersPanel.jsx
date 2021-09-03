import User from "./user";

import React, { useEffect, useState } from "react";

const UserPanel = (props) => {
  const [requestStatus, setRequestStatus] = useState({});

  useEffect(() => {
    if (props.onRequestStatus.length > 0) {
      const [user, flag] = props.onRequestStatus;
      setFlag(user, flag);
      props.onRequestStatusRead();
    }
  });

  const handleGiveUp = (user) => {
    setFlag(user.id, false);
    props.peers[user.id].send(`--3${props.myId}--rSorry`);
  };

  const setFlag = (user, flag) => {
    let req = requestStatus;
    req[user] = flag;
    setRequestStatus({ ...requestStatus, ...req });
  };

  return (
    <div id="usersPanel">
      {props.users.map((user, index) => (
        <User
          key={index}
          name={user.name}
          id={user.id}
          requestStatus={requestStatus[user.id]}
          onPull={() => props.onPull(user)}
          onPush={() => props.onPush(user)}
          onGiveUp={() => handleGiveUp(user)}
          onPing={() => props.onPing(user)}
          onStream={() => props.onStream(user)}
          onMute={() => props.onMute(user)}
          onMicrophone={() => props.onMicrophone(user)}
        />
      ))}
    </div>
  );
};

export default UserPanel;
