import React, {useEffect} from 'react';
import shave from 'shave';

import './ConversationListItem.css';

export default function ConversationListItem(props) {
  useEffect(() => {
    shave('.conversation-snippet', 20);
  })

    const { photo, name, user_id, last_seen} = props.data;

    const handleUpdateReceiver = (recipientId) => {

      return () => {
        console.log(recipientId);
        props.handleRecipient(recipientId);
      }
    }

    return (
      <div className="conversation-list-item" id={user_id} onClick={handleUpdateReceiver(user_id)}>
        <img className="conversation-photo" src={photo} alt="conversation" />
        <div className="conversation-info">
          <h1 className="conversation-title">{ name }</h1>
          {/* <p className="conversation-snippet">{ text }</p> */}
        </div>
      </div>
    );
}