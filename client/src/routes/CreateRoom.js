import React, { useState } from "react";
import { v1 as uuid } from "uuid";

const CreateRoom = (props) => {
  const [text, setText] = useState("");
  function create() {
    const id = uuid();
    console.log("Room id:", id);
    props.history.push(`/room/${id}`);
  }

  function join(roomId) {
    props.history.push(`/room/${roomId}`);
  }

  return (
    <div style={{ display: "flex" }}>
      <button onClick={create}>Create Room</button>
      <div style={{ display: "grid", width: 300 }}>
        <input type="text" onChange={(e) => setText(e.target.value)} />
        <button onClick={() => join(text)}>Join Room</button>
      </div>
    </div>
  );
};

export default CreateRoom;
