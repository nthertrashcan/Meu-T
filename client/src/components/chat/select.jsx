import React, { useState, useEffect } from "react";

const Selection = (props) => {
  const [selected, setSelected] = useState("Everyone");

  useEffect(() => {
    const user = props.selected;
    if (selected !== user) {
      setSelected(user);
    }
  });

  const handleSelected = (value) => {
    console.log("Selected :", value);
    setSelected(value);
    props.onSelection(value);
  };

  return (
    <React.Fragment>
      <select
        value={selected}
        id="chat-userSelection"
        onChange={(e) => handleSelected(e.target.value)}
      >
        {props.users.map((user, index) => (
          <option key={user.id}>{user.name}</option>
        ))}
        {props.users.length > 0 ? (
          <option key={props.users.length + 1}>{"Everyone"}</option>
        ) : null}
      </select>
    </React.Fragment>
  );
};

export default Selection;
