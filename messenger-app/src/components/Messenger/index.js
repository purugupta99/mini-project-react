import React, { useState } from 'react';
import ConversationList from '../ConversationList';
import MessageList from '../MessageList';
import { useAuth0 } from "../Auth/react-auth0-spa";
import { gql, useQuery } from '@apollo/client';


import './Messenger.css';

const GET_MY_CONVOS = gql `
  query getUsers {
    users {
      id
      name
      last_seen
    }
  }
`;

export default function Messenger(props) {
  
    
    const [recipient, setRecipient] = useState("1");
    const { user } = useAuth0();

    // console.log(user);

    const handleRecipient = recipientId => {
      // console.log(recipientId);
      setRecipient(recipientId);
    };
    const {data, loading, error} = useQuery(GET_MY_CONVOS);
    if (loading) {
      // return []
      return (<div> <h1> Loading .. </h1></div>)
    }
    if (error) {
      // return []
      return (<div> <h1> Error </h1> <p> {error.message} </p> </div>)
    }

    let tempUsers = data.users.map(users => {
      return {
        user_id: users.id,
        name: users.name,
        photo: "https://i.pinimg.com/236x/38/aa/95/38aa95f88d5f0fc3fc0f691abfaeaf0c.jpg",
        last_seen: users.last_seen,
      };
    });
    // console.log(tempUsers)
    return (
      <div className="messenger">
        {/* <Toolbar
          title="Messenger"
          leftItems={[
            <ToolbarButton key="cog" icon="ion-ios-cog" />
          ]}
          rightItems={[
            <ToolbarButton key="add" icon="ion-ios-add-circle-outline" />
          ]}
        /> */}

        {/* <Toolbar
          title="Conversation Title"
          rightItems={[
            <ToolbarButton key="info" icon="ion-ios-information-circle-outline" />,
            <ToolbarButton key="video" icon="ion-ios-videocam" />,
            <ToolbarButton key="phone" icon="ion-ios-call" />
          ]}
        /> */}

        <div className="scrollable sidebar">
          <ConversationList 
          handleRecipient = {handleRecipient}
          sender = {user.sub}
          logout = {props.logout}
          users = {tempUsers}

          />
        </div>

        <div className="scrollable content">
          <MessageList 
          recipient = {recipient}
          sender = {user.sub}
          />
        </div>
      </div>
    );
}