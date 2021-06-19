import React, { useState } from 'react';
import ConversationList from '../ConversationList';
import MessageList from '../MessageList';
import { useAuth0 } from "../Auth/react-auth0-spa";

import './Messenger.css';

export default function Messenger(props) {

    const [recipient, setRecipient] = useState("1");
    const { user } = useAuth0();

    console.log(user);

    const handleRecipient = recipientId => {
      // console.log(recipientId);
      setRecipient(recipientId);
    };

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