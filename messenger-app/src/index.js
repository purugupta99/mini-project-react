import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Router } from "react-router-dom";

import { Auth0Provider } from "./components/Auth/react-auth0-spa";
import history from "./utils/history";
import { AUTH_CONFIG } from "./components/Auth/auth0-variables";

import './assets/index.css';
import * as serviceWorker from './serviceWorker';

const onRedirectCallback = appState => {
    history.push(
        appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    );
};

const mainRoutes = (
<Router history={history}>
    <Route
    path="/"
    render={props => (
        <Auth0Provider
        domain={AUTH_CONFIG.domain}
        client_id={AUTH_CONFIG.clientId}
        redirect_uri={AUTH_CONFIG.callbackUrl}
        onRedirectCallback={onRedirectCallback}
        />
    )}
    />
</Router>
);

ReactDOM.render(mainRoutes, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
