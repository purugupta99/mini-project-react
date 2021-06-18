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

const MessageInput = () => {
  let input;
  const [messageInput, setMessageInput] = useState('');

  const updateCache = (cache, {data}) => {

    // Fetch the todos from the cache

    const existingMessages = cache.readQuery({

      query: GET_MY_MESSAGES

    });

    // Add the new todo to the cache

    const newMessage = data.insert_message.returning[0];
    cache.writeQuery({
      query: GET_MY_MESSAGES,
      data: {messages: [existingMessages.messages, ...newMessage]}
    });
  };

  const resetinput = () => {
    setMessageInput('');
  };

  const [addMessages] = useMutation(ADD_MESSAGE, {
    update: updateCache,
    onCompleted: resetinput
  });

  return (
    <form className="compose"
    onSubmit={(e) => {
    e.preventDefault();
    addMessages (
      {
        variables: {
          text: messageInput,
          id_sender: "1",
          id_receiver: "3"
        }
      }
    );
  }}
    >
      <input
        type="text"
        className="compose-input"
        placeholder="Type a message, @name"
        value={messageInput}
        onChange={e => (setMessageInput(e.target.value))}
      />

      {/* {
        props.rightItems
      } */}
    </form>
  );
};

export default MessageInput;

import React from 'react';
import './Compose.css';

export default function Compose(props) {
    return (
      <div className="compose">
        <input
          type="text"
          className="compose-input"
          placeholder="Type a message, @name"
        />

        {
          props.rightItems
        }
      </div>
    );
}