import React from "react";
import { useAuth0 } from "./react-auth0-spa";
import logo from "../../assets/react-messenger.svg"

import { Button } from "react-bootstrap";

const Login = () => {
  const { loading, loginWithRedirect } = useAuth0();
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="overlay">
      <div className="overlay-content">
        <img style={{
          display: "block",
          marginRight: "auto",
          marginLeft: "auto",
          marginTop: "200px"
        }} src={logo} alt="Logo" />
        <div style={{textAlign:"center",padding:"20px"}} className="overlay-heading">
          Welcome to the Messanger app
        </div>
        <div style={{textAlign:"center", paddingTop:"10px"}} className="overlay-message">Please login to continue</div>
        <div style={{textAlign:"center", paddingTop:"10px"}} className="overlay-action">
          <Button
            id="qsLoginBtn"
            variant="primary"
            className="btn-margin loginBtn"
            onClick={() => {
              loginWithRedirect({});
            }}
          >
            Log In
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;