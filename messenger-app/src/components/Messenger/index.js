import React, { useState} from 'react';
import ConversationList from '../ConversationList';
import MessageList from '../MessageList';
import './Messenger.css';
import { useAuth0 } from "../Auth/react-auth0-spa";

export default function Messenger(props) {
  const [receiver, setReceiver] = useState("1");
  const { user } = useAuth0();

  console.log("user id:", user.sub);
  const handleReceiverChange = id => {
    console.log(id);
    setReceiver(id);
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
          updateReceiver = {handleReceiverChange}
          logOutBTN = {props.logOutBTN}
          me = {user.sub}
          />
        </div>

        <div className="scrollable content">
          <MessageList
          receiver = {receiver}
          me = {user.sub}
          />
        </div>
      </div>
    );
}