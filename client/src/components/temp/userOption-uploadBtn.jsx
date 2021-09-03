import React, { Component } from "react";

class UploadBtn extends Component {
  render() {
    return <button onClick={this.props.onUpload}>Upload</button>;
  }
}

export default UploadBtn;
