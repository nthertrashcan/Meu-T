import NavBar from "./components/bar/navbar";
import FootBar from "./components/bar/footbar";
import ChatBox from "./components/chat/chatBox";
import RequestBar from "./components/request/requestBar";
import StreamFrames from "./components/stream/streamFrames";
import UsersPanel from "./components/user/usersPanel";
import DialogBox from "./components/dialog/dialogBox";
import React, { useState } from "react";

const Home = (props) => {
  const [onStream, setOnStream] = useState("");

  const handlePull = ({ name, id }) => {
    console.log("Pull clicked", name, id);
  };

  const handlePush = ({ name, id }) => {
    console.log("Push clicked", name, id);
  };

  const handleOnStream = (user) => {
    console.log("Streaming to...", user.id);

    const div = document.getElementById("stream");
    if (div) {
      const vid = document.getElementById("streamVideo");
      if (vid) {
        vid.src = null;
        vid.hidden = true;
      }
      div.hidden = true;
    }
    setOnStream(user.id);
  };

  const handleMute = (user) => {
    const audioRef = document.getElementById(`${user.id}-audio`);
    const muteBtn = document.getElementById(`${user.id}-muteBtn`);
    if (audioRef.muted) {
      audioRef.muted = false;
      muteBtn.innerHTML = "Mute";
    } else {
      audioRef.muted = true;
      muteBtn.innerHTML = "Unmute";
    }
  };

  const handleMicrophone = ({ id }) => {
    let user = id;
    const microphoneBtn = document.getElementById(`${id}-microphoneBtn`);
    if (microphoneBtn.innerHTML == "Microphone-Off") {
      microphoneBtn.innerHTML = "Microphone-On";
      props.peers[user].send(`--6${props.myId}--f0`);
    } else {
      microphoneBtn.innerHTML = "Microphone-Off";
      props.peers[user].send(`--6${props.myId}--f1`);
    }
  };

  return (
    <div>
      <NavBar />

      <RequestBar
        myId={props.myId}
        peers={props.peers}
        onRequest={props.onRequest}
        onRequestRead={props.onRequestRead}
        onRequestAccept={props.onRequestAccept}
      />
      {/* <ChatBox
        users={props.users}
        myId={props.myId}
        outgoingMsg={(e) => props.handleOutgoingMsg(e)}
        incomingMsg={props.incomingMsg}
        onReading={props.onReading}
      /> */}
      <UsersPanel
        myId={props.myId}
        users={props.users}
        peers={props.peers}
        onPing={props.onPing}
        onRequestStatus={props.onRequestStatus}
        onRequestStatusRead={props.onRequestStatusRead}
        onPull={(e) => handlePull(e)}
        onPush={(e) => handlePush(e)}
        onStream={(e) => handleOnStream(e)}
        onMute={(e) => handleMute(e)}
        onMicrophone={(e) => handleMicrophone(e)}
      />
      <DialogBox
        onRejectCall={props.onRejectCall}
        onAcceptCall={props.onAcceptCall}
        onConfirm={props.onRemarkConfirm}
        type={props.dialogBoxType}
      />
      <StreamFrames
        myId={props.myId}
        peer={props.peer}
        peers={props.peers}
        incomingStream={props.incomingStream}
        onHangUp={props.onHangUp}
        onStream={onStream}
        onStreamRead={() => setOnStream("")}
      />
      <FootBar />
    </div>
  );
};

export default Home;
