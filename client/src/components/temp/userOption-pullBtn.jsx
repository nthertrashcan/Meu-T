import React, { Component } from "react";

class PullBtn extends Component {
  render() {
    return <button onClick={this.props.onPull}>Pull</button>;
  }
}

export default PullBtn;
