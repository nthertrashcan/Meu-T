import React, { useEffect, useRef } from "react";

// import { desktopCapturer } from "electron";

let user = "";
const StreamFrames = (props) => {
  const videoRef = useRef();
  const callRef = useRef();
  const videoStreamRef = useRef();
  useEffect(() => {
    console.log("Getting", props.incomingStream);
    if (props.onStream !== "") {
      console.log("On Stream...", props.onStream);
      props.peers[props.onStream].send(`--4${props.myId}`);
      handleStream("", props.onStream, 0);
      user = props.onStream;
      props.onStreamRead();
    }

    props.peer.on("call", (call) => {
      callRef.current = call;
    });
    if (callRef.current) {
      let call = callRef.current;
      if (props.incomingStream === call.peer) {
        call.answer(new MediaStream());
        call.on("stream", (remoteStream) => {
          if (props.incomingStream) {
            console.log("loading");
            const div = document.getElementById("stream");
            if (div) {
              const vid = document.getElementById("streamVideo");
              if (vid) {
                vid.src = null;

                vid.hidden = false;
              }
              div.hidden = false;
            }
            videoRef.current.srcObject = remoteStream;
            videoStreamRef.current = remoteStream;
          }
        });
      }
    }
  });

  const handleStream = (call, user, flag) => {
    const getUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        call = props.peer.call(user, stream);
        callRef.current = call;
        videoRef.current.srcObject = stream;
        videoStreamRef.current = stream;

        call.on("close", () => {
          props.peers[call.peer].send(`--5${props.myId}--U0`);
          console.log(`${call.peer} closed stream`);
        });
      } catch (err) {
        console.log(err);
      }
    };
    getUserMedia();
    if (!flag) {
      changeStream();
    }
  };

  const changeStream = () => {
    navigator.mediaDevices
      .getDisplayMedia({
        audio: false,
        video: true,
      })
      .then((stream) => {
        let videoTrack = stream.getVideoTracks()[0];

        videoTrack.onended = () => {
          handleBtn();
        };

        let sender = callRef.current.peerConnection
          .getSenders()
          .find(function (s) {
            if (s.track.kind === "video") {
              return s;
            }
          });
        if (sender) sender.replaceTrack(videoTrack);
      });
  };

  const handleBtn = () => {
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks()[0].stop();

      videoStreamRef.current.getTracks().forEach((track) => {
        if (track.kind === "video") {
          console.log("Stopping", track);
          track.stop();
          track.enabled = false;
        }
      });
    }
    callRef.current.close();

    if (props.incomingStream) {
      props.peers[props.incomingStream].send(`--5${props.myId}--U0`);
      props.onHangUp();
    } else {
      props.peers[user].send(`--5${props.myId}--U1`);
    }
  };

  return (
    <div
      className="p-3 mb-2 bg-primary text-white .bg-info.bg-gradient"
      id="streamFrames"
    >
      {props.incomingStream ? (
        <div id="stream">
          <div>{props.incomingStream ? props.incomingStream : user}</div>
          <video
            // style={{ width: "300px", height: "300px" }}
            id="streamVideo"
            autoPlay
            ref={videoRef}
            controls
          ></video>
          <button onClick={handleBtn}>
            {props.incomingStream ? "HangUp" : "Stop"}
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default StreamFrames;

// desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
//   for (const source of sources) {
//     if (source.name === 'Electron') {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           audio: false,
//           video: {
//             mandatory: {
//               chromeMediaSource: 'desktop',
//               chromeMediaSourceId: source.id,
//               minWidth: 1280,
//               maxWidth: 1280,
//               minHeight: 720,
//               maxHeight: 720
//             }
//           }
//         })
//         handleStream(stream)
//       } catch (e) {
//         handleError(e)
//       }
//       return
//     }
//   }
// })

// function handleStream (stream) {
//   const video = document.querySelector('video')
//   video.srcObject = stream
//   video.onloadedmetadata = (e) => video.play()
// }

// function handleError (e) {
//   console.log(e)
// }
