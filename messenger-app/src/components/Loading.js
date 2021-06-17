import React from "react";
import loading from "../assets/loading.svg";

const Loading = () => (
  <div className="spinner">
    <img src={loading} style={{
      display: "block",
      margin: "auto",
      marginTop: "50%"
    }} alt="Loading" />
  </div>
);

export default Loading;
