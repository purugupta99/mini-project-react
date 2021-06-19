import React, { useState } from 'react';
import './Compose.css';
import {gql, useMutation} from "@apollo/client";
import {GET_MY_MESSAGES} from '../MessageList/index';

const ADD_MESSAGE = gql `
  mutation MyMutation($id_receiver: String, $id_sender: String, $text: String) {
    insert_messages(objects: {id_receiver: $id_receiver, id_sender: $id_sender, text: $text}) {
      returning {
        id
        id_sender
        send_at
        text
      }
    }
  }
  `;

const MessageInput = (props) => {
  let input;
  const [messageInput, setMessageInput] = useState('');


  const resetinput = () => {
    setMessageInput('');
  };

  const [addMessages] = useMutation(ADD_MESSAGE, {
    onCompleted: resetinput
  });

  // console.log(messageInput)
  return (
    <form className="compose"
      onSubmit={(e) => {
      e.preventDefault();

      // console.log(props)
      // console.log(messageInput, props.senderId, props.receiverId)
      addMessages (
        {
          variables: {
            text: messageInput,
            id_sender: props.senderId,
            id_receiver: props.recipientId
          }
        }
      ).then(response => {
        console.log(response);
        let tempMessages = response.data.insert_messages.returning.map(messages => {
          return {
            id: messages.id,
            author: messages.id_sender,
            message: messages.text,
            timestamp: messages.send_at
          };
        });
        props.updateConversation(tempMessages);
      });
    }}
    >
      <input
        type="text"
        className="compose-input"
        placeholder="Type a message, @name"
        value={messageInput}
        onChange={e => (setMessageInput(e.target.value))}
      />

      {
        props.rightItems
      }
    </form>
  );
};

export default MessageInput;