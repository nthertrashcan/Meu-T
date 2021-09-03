import React, { Component } from "react";

class PushBtn extends Component {
  render() {
    return <button onClick={this.props.onPush}>Push</button>;
  }
}

export default PushBtn;
