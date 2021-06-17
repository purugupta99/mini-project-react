import React, {useState} from "react";
import axios from 'axios';
import './Compose.css';

export default function Compose(props) {
  const [messageInput, setMessageInput] = useState('');
  const resetInput = () => {
    setMessageInput('');
  };
  const sendMessage = data => {
    console.log(data.variables);
    axios({
      url: 'https://messenger-app.hasura.app/v1/graphql',
      method: 'post',
      data: {
        query: `
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
          `,
        variables: data.variables
      },
      headers: {
        'x-hasura-admin-secret': 'cLzWoSwe7ooq2gB67r5bLrTMMDkNU5wjIZ6G7h5MEcXcp8wgPvzPcZPE6hGk3XW8',
        'content-type': 'application/json'
      }
    })
    .then(response => {
        console.log(response.data.data.insert_messages.returning);
        let tempMessages = response.data.data.insert_messages.returning.map(messages => {
          return {
            id: messages.id,
            author: messages.id_sender,
            message: messages.text,
            timestamp: messages.sent_at
          };
        });
        props.addMessage(tempMessages);
        resetInput();
    })
    .catch(error => {
      console.log(error);
    });
  }
    return (
      <form
        className="compose"
        onSubmit={e => {
          e.preventDefault();
          sendMessage(
            {
              variables: {
                text: messageInput,
                id_sender: props.idSender,
                id_receiver: props.idReceiver
              }
            }
          );
        }}
      >
        <input
          type="text"
          className="compose-input"
          value = {messageInput}
          placeholder={"Type a message for "+props.nameReceiver}
          onChange={e => (setMessageInput(e.target.value))}
        />

        {
          props.rightItems
        }
      </form>
    );
}