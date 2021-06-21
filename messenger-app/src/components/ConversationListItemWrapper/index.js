import React from 'react';
import ConversationListItem from '../ConversationListItem';

export default function ConversationListItemWrapper(props) {
    let listItems = props.conversations;
    let toReturn;
    // console.log(listItems);
    if(listItems.length===0){
      // console.log("Hello")
      toReturn = `
      Cannot show anyone with that unique name :)
      `;
    }
    else{
      toReturn = listItems.map(conversation =>
        <ConversationListItem
  
          user_id = {conversation.id}
          key = {conversation.name}
          data = {conversation}
          handleRecipient = {props.handleRecipient}
        />
      )
    }
    return (toReturn);
}