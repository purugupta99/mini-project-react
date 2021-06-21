import React from 'react';
import ConversationListItem from '../ConversationListItem';

export default function ConversationListItemWrapper(props) {
    let listItems = props.conversations;
    let toReturn;
    if(listItems.length===0){
      toReturn = "No results found"
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