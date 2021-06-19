import React from 'react';
import Messenger from '../Messenger';
import { WebSocketLink } from 'apollo-link-ws';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { useAuth0 } from "../Auth/react-auth0-spa";
import Loading from "../Loading";

const createApolloClient = (idToken) => {
  // console.log(authToken);
  return new ApolloClient({
    link: new WebSocketLink({
      // uri: 'wss://mytodo.hasura.app/v1/graphql',
      uri: 'wss://messenger-app.hasura.app/v1/graphql',
      options: {
        reconnect: true,
        connectionParams: {
          headers: {
          //  Authorization : `Bearer ${idToken}`
            'x-hasura-admin-secret': 'cLzWoSwe7ooq2gB67r5bLrTMMDkNU5wjIZ6G7h5MEcXcp8wgPvzPcZPE6hGk3XW8'
          }
        }
      }
    }),
    cache: new InMemoryCache(),
  });
 };

export default function App({idToken}) {
  const { loading, logout } = useAuth0();
  // console.log(logout);
  if (loading) {
    return <Loading />;
  }
  const client = createApolloClient(idToken);
  // console.log(client);
    return (
      <ApolloProvider client={client}>
      <div className="App">
        {/* <Messenger/> */}
        <Messenger logOutBTN = {logout} />
      </div>
      </ApolloProvider>
    );
}