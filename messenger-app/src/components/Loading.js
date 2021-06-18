import React from "react";
import loading from "../assets/loading.svg";

const Loading = () => (
  <div className="spinner">
    <img src={loading} style={{
      display: "block",
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: "200px"
    }} alt="Loading" />
  </div>
);

export default Loading;