import React, { useRef, useEffect, useState } from "react";

import Peer from "peerjs";
import Home from "../Home";
const io = require("socket.io-client");

const peer = new Peer({
  host: "pingr-peerjs-server.herokuapp.com",
  port: 80,
  path: "/",
});
let cPeers = {};
let cCallPeers = {};
let users = [];
let onCall = [];
let incomingStream = "";
let myId = "";

const removePeer = (userId) => {
  const index = onCall.indexOf(userId);
  if (index > -1) {
    onCall.splice(index, 1);
  }
};

const socketRef = io.connect("https://pingr-server.herokuapp.com/", {});

const Room = () => {
  let ROOM_ID = useRef();
  ROOM_ID.current = "";
  const [user, setUser] = useState([]);
  const [message, setMessage] = useState([]);
  const [request, setRequest] = useState([]);
  const [requestReply, setRequestReply] = useState([]);
  const [requestStatus, setRequestStatus] = useState([]);
  const [iStream, setIncomingStream] = useState("");
  const [dialogBoxType, setDialogBoxType] = useState("");
  let remarkUser = useRef({});
  let streamCaller = useRef("");

  const processIncomingData = (data) => {
    if (data.includes("--0")) {
      const rawData = data.split("--0")[1];
      const userId = rawData.split("--m")[0];
      const m = rawData.split("--m")[1];
      setMessage([userId, m]);
    } else if (data.includes("--1")) {
      const rawData = data.split("--1")[1];
      const userId = rawData.split("--r")[0];
      const remark = rawData.split("--r")[1];
      console.log(`${userId} : ${remark}`);
      setRequest([userId, remark]);
    } else if (data.includes("--2")) {
      const rawData = data.split("--2")[1];
      const userId = rawData.split("--q")[0];
      const reqS = rawData.split("--q")[1];
      console.log(`${userId} ${reqS === "1" ? "Accepted" : "Rejected"}`);
      setRequestReply([userId, reqS]);
    } else if (data.includes("--3")) {
      const rawData = data.split("--3")[1];
      const userId = rawData.split("--r")[0];
      const remark = rawData.split("--r")[1];
      console.log(`${userId} gived up with remark : ${remark}`);
    } else if (data.includes("--4")) {
      const userId = data.split("--4")[1];
      console.log(`Incoming Stream from ||...${userId}`);
      handleStreamCall(userId);
    } else if (data.includes("--5")) {
      const rawData = data.split("--5")[1];
      const userId = rawData.split("--U")[0];
      const flag = rawData.split("--U")[1];

      incomingStream = "";
      setIncomingStream("");
      const div = document.getElementById("stream");
      if (div) {
        const vid = document.getElementById("streamVideo");
        if (vid) {
          vid.src = null;

          vid.hidden = true;
        }
        div.hidden = true;
      }
    } else if (data.includes("--6")) {
      const rawData = data.split("--6")[1];
      const userId = rawData.split("--f")[0];
      const flag = rawData.split("--f")[1];
      const audio = document.getElementById(`${userId}-audio`);
      const muteBtn = document.getElementById(`${userId}-muteBtn`);

      if (audio) {
        if (flag === "0") {
          console.log("Muted by ", userId);
          audio.muted = true;
          muteBtn.disabled = true;
          muteBtn.innerText = "Muted";
        } else {
          console.log("Unmuted by ", userId);
          audio.muted = false;
          muteBtn.disabled = false;
          muteBtn.innerText = "Mute";
        }
      }
    }
  };

  useEffect(() => {
    if (ROOM_ID.current) {
      socketRef.emit("join-room", ROOM_ID.current, peer.id);
      myId = peer.id;
    }

    socketRef.on("user-connected", (userId) => {
      console.log(userId);
      if (!onCall.includes(userId) && userId) {
        handleStream("", userId, 0);

        const conn = peer.connect(userId);
        console.log("Calling...", userId);

        users.push({
          id: userId,
          name: userId,
          conn: conn,
        });
        setUser([...user, { id: conn.peer, name: conn.peer, conn: conn }]);
        cPeers[userId] = conn;

        conn.on("close", () => {
          socketRef.emit("disconnect");
        });

        conn.on("data", (data) => {
          processIncomingData(data);
        });

        console.log("connected to:", userId);
        onCall.push(userId);
      }
    });

    peer.on("call", (call) => {
      if (incomingStream !== call.peer) {
        console.log("Incoming call from...", call.peer);
        handleStream(call, call.peer, 1);
      }
    });

    peer.on("connection", (conn) => {
      if (!onCall.includes(conn.peer)) {
        conn.on("close", () => {
          socketRef.emit("disconnect");
        });
        conn.on("data", (data) => {
          processIncomingData(data);
        });

        users.push({
          id: conn.peer,
          name: conn.peer,
          conn: conn,
        });

        setUser([...user, { id: conn.peer, name: conn.peer, conn: conn }]);

        cPeers[conn.peer] = conn;
        // setPeers(cPeers);
        console.log("connected to :", conn.peer);
        onCall.push(conn.peer);
      }
    });

    socketRef.on("user-disconnected", (userId) => {
      console.log("Disconnected  from:", userId);
      if (onCall.includes(userId)) {
        delete cPeers[userId];
        removePeer(userId);
        users = users.filter((user) => user.id !== userId);

        setUser([...user, ...users]);
      }
    });

    peer.on("open", (id) => {
      myId = id;
      socketRef.emit("join-room", ROOM_ID, id);
    });
  });

  const handleStream = (call, user, flag) => {
    const getUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true },
        });

        if (flag) {
          call.answer(stream);
        } else call = peer.call(user, stream);

        cCallPeers[user] = { call: call, stream: stream };

        call.on("stream", (remoteStream) => {
          const aud = createAudio(user);
          aud.srcObject = remoteStream;
          aud.addEventListener("loadedmetadata", () => {
            aud.play();
          });
          document.getElementById("audio").appendChild(aud);
        });
      } catch (err) {
        console.log(err);
      }
    };
    getUserMedia();
  };

  const createAudio = (user, vid = null) => {
    const audio = document.createElement("audio");
    audio.setAttribute("id", `${user}-audio`);
    audio.controls = true;
    return audio;
  };

  const handleIncomingMsg = () => {
    return message;
  };

  const handleReading = () => {
    setMessage([]);
  };

  const handleRequest = () => {
    return request;
  };

  const handleRequestReading = () => {
    setRequest([]);
  };

  const handleRequestAccept = (e) => {
    console.log("Acting on request accepted", e);
    setRequestStatus([e["user"], true]);
  };

  const handleRequestStatusReading = () => {
    setRequestStatus([]);
  };

  const handleHangUp = () => {
    incomingStream = "";
    streamCaller.current = "";
    setIncomingStream("");
  };

  const handlePing = ({ name, id }) => {
    remarkUser.current = { name, id };
    document.getElementById("dialogBox").open = true;
    setDialogBoxType("remark");
  };

  const handleRemark = (text) => {
    console.log("Remark:", text);
    sendRequest(remarkUser.current.name, remarkUser.current.id, text);
    remarkUser.current = {};
  };

  const sendRequest = (name, id, remark) => {
    if (cPeers[id]) {
      cPeers[id].send(`--1${myId}--r${remark}`);
    }
  };

  const handleStreamCall = (userId) => {
    if (dialogBoxType !== "streamCall") {
      setDialogBoxType("streamCall");
    }
    incomingStream = userId;
    document.getElementById("dialogBox").open = true;
  };

  const handleAcceptCall = () => {
    streamCaller.current = incomingStream;
    setIncomingStream(streamCaller.current);
    console.log("StreamCaller", streamCaller.current);
    const vid = document.getElementById("stream");
    if (vid) {
      vid.hidden = false;
    }
  };
  const handleRejectCall = () => {
    incomingStream = "";
    streamCaller.current = "";
    setIncomingStream("");
    console.log("Rejecting call");
  };

  return (
    <React.Fragment>
      <Home
        myId={myId}
        users={users}
        peers={cPeers}
        callPeers={cCallPeers}
        peer={peer}
        incomingStream={streamCaller.current}
        onPing={(e) => handlePing(e)}
        onRequestAccept={(e) => handleRequestAccept(e)}
        onRemarkConfirm={(e) => handleRemark(e)}
        incomingMsg={handleIncomingMsg}
        onReading={handleReading}
        onRequest={handleRequest}
        onRequestRead={handleRequestReading}
        onRequestStatus={requestStatus}
        onRequestStatusRead={handleRequestStatusReading}
        onHangUp={handleHangUp}
        dialogBoxType={dialogBoxType}
        onAcceptCall={handleAcceptCall}
        onRejectCall={handleRejectCall}
      />
      {<div id="audio" hidden={true}></div>}
    </React.Fragment>
  );
};

export default Room;
