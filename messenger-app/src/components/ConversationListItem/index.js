import React, {useEffect} from 'react';
import shave from 'shave';
import myInitObject from '../MyInit';

import './ConversationListItem.css';

export default function ConversationListItem(props) {
  useEffect(() => {
    shave('.conversation-snippet', 20);
  })

    const {id, photo, name, text } = props.data;
    const setMessages = talking_to_id => {
      return () => {
        // console.log("I am " + myInitObject.me);
        myInitObject.talkingTo = talking_to_id;
        props.updateReceiver(talking_to_id);
        // console.log("Talking to " + talking_to_id);
      }
    }
    const findDiff = time => {
      if(time!==null){
        var now = Date.now();
        var lastSeen = Date.parse(time);
        var n = Math.round((now - lastSeen)/60000);
        return n.toString() + " minutes ago";
      }
      else{
        return "";
      }
    }
    return (
      <div className="conversation-list-item" onClick={setMessages(id)}>
        <img className="conversation-photo" src={photo} alt="conversation" />
        <div className="conversation-info">
          <h1 className="conversation-title">{ name }</h1>
          <p className="conversation-snippet">Last seen: { findDiff(text) }</p>
        </div>
      </div>
    );
}