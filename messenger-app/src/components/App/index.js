import React from 'react';
import Messenger from '../Messenger';
import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink } from '@apollo/client';

var idToken = "cLzWoSwe7ooq2gB67r5bLrTMMDkNU5wjIZ6G7h5MEcXcp8wgPvzPcZPE6hGk3XW8";

const createApolloClient = (authToken) => {
  return new ApolloClient({
    link: new HttpLink({
      uri: 'https://messenger-app.hasura.app/v1/graphql',
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    }),
    cache: new InMemoryCache(),
  });
};

export default function App() {
  const client = createApolloClient(idToken);
  return (
    <ApolloProvider client={client}>
      <div>
        <div className="App">
          <Messenger />
        </div>
      </div>
    </ApolloProvider>
    );
  }