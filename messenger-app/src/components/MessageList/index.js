import React, {useEffect, useState} from 'react';
import Compose from '../Compose';
import Toolbar from '../Toolbar';
import ToolbarButton from '../ToolbarButton';
import Message from '../Message';
import moment from 'moment';

import axios from 'axios';

import { gql, useQuery, useSubscription } from '@apollo/client';

import './MessageList.css';

require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);

// const GET_MY_MESSAGES = gql `

//   query MyQuery ($id_receiver: String!, $id_sender: String!){
//     messages(where: {_or: [{id_receiver: {_eq: $id_receiver}}, {id_sender: {_eq: $id_sender}}]}, order_by: {send_at: asc}) {
//       text
//     }
//   }
//  `;

 const GET_MY_MESSAGES = gql `
  query MyQuery{
    messages(where: {_or: [{id_receiver: {_eq: "1"}}, {id_sender: {_eq: "1"}}]}, order_by: {send_at: asc}) {
      id
      text
      send_at
      user_sender {
        id
      }
    }
  }
 `;

 const GET_RECIPIENT_NAME = gql `
  query MyQuery($id: String!) {
    users(where: {id: {_eq: $id}}) {
      name
    }
  }
 `;

 const GET_CURR_MESSAGES = gql `
 query MyQuery($id_receiver: String!, $id_sender: String!) {
  messages(where: {_or: [{_and: [{id_receiver: {_eq: $id_receiver}}, {id_sender: {_eq: $id_sender}}]}, {_and: [{id_receiver: {_eq: $id_sender}}, {id_sender: {_eq: $id_receiver}}]}]}) {
    id
    text
    send_at
    user_sender {
      id
    }
  }
}
 `;


const MessageHandler= (props) => {

  // console.log(props)
  const [messages, setMessages] = useState([]);
  const [recipientId, setRecipientId] = useState(props.recipient);
  const [recipientName, setRecipientName] = useState("");


  useEffect(() => {

    // console.log(props.recipient)
    setRecipientId(props.recipient);
    // console.log(recipientId)

    getRecipientName(recipientId);
    subscribeMessages();
    console.log(recipientName);

    
  }, [])

  
  const getRecipientName = (recipientId) => {

    console.log(recipientId)
    // const {data, loading, error} = useQuery(GET_RECIPIENT_NAME, {
    //   variables: {id: recipientId},
    // });
  
    // console.log(data);
    // console.log(error);
    // return data;

    axios({
      url: 'https://messenger-app.hasura.app/v1/graphql',
      method: 'post',
      data: {
        query: `
        query MyQuery($id: String) {
          users(where: {id: {_eq: $id}}) {
            name
          }
        }        
          `,
        variables: {
          id: recipientId
        }
      },
      headers: {
        'x-hasura-admin-secret': 'cLzWoSwe7ooq2gB67r5bLrTMMDkNU5wjIZ6G7h5MEcXcp8wgPvzPcZPE6hGk3XW8',
        'content-type': 'application/json'
      }
    })
    .then(response => {
        let username = response.data.data.users[0].name;
        console.log(username);
        setRecipientName(username);
    })
    .catch(error => {
      console.log(error);
      setRecipientName("Error in loading name");
    });
  }
  
  const subscribeMessages = () => {
    
    let tempMessages = props.newMessages.map(messages => {
      return {
        id: messages.id,
        author: messages.user_sender.id,
        message: messages.text,
        timestamp: messages.send_at
      };
    });

    if (messages.length !== props.newMessages.length){
      setMessages(tempMessages)
    }
  }

  subscribeMessages();
  

  const renderMessages = () => {
    let i = 0;
    let messageCount = messages.length;
    let messageList = [];

    while (i < messageCount) {
      let previous = messages[i - 1];
      let current = messages[i];
      let next = messages[i + 1];
      let isMine = current.author === "2";
      let currentMoment = moment(current.timestamp);
      let prevBySameAuthor = false;
      let nextBySameAuthor = false;
      let startsSequence = true;
      let endsSequence = true;
      let showTimestamp = true;

      if (previous) {
        let previousMoment = moment(previous.timestamp);
        let previousDuration = moment.duration(currentMoment.diff(previousMoment));
        prevBySameAuthor = previous.author === current.author;
        
        if (prevBySameAuthor && previousDuration.as('hours') < 1) {
          startsSequence = false;
        }

        if (previousDuration.as('hours') < 1) {
          showTimestamp = false;
        }
      }

      if (next) {
        let nextMoment = moment(next.timestamp);
        let nextDuration = moment.duration(nextMoment.diff(currentMoment));
        nextBySameAuthor = next.author === current.author;

        if (nextBySameAuthor && nextDuration.as('hours') < 1) {
          endsSequence = false;
        }
      }

      messageList.push(
        <Message
          key={i}
          isMine={isMine}
          startsSequence={startsSequence}
          endsSequence={endsSequence}
          showTimestamp={showTimestamp}
          data={current}
        />
      );

      // Proceed to the next message.
      i += 1;
    }

    return messageList;
  }

    if(recipientId !== props.recipient){
      setRecipientId(props.recipient);
      getRecipientName(props.recipient);
      // setMessages([]);
      // getMessages(props.recipient);
      // console.log(props.receiver, reload,talking_toID);
    }

    return(
      <div className="message-list">
        <Toolbar
          title="Conversation Title"
          rightItems={[
            <ToolbarButton key="info" icon="ion-ios-information-circle-outline" />,
            <ToolbarButton key="video" icon="ion-ios-videocam" />,
            <ToolbarButton key="phone" icon="ion-ios-call" />,
            // <button key="test" onClick={getMessages}> hi </button>
            // <ToolbarButton key="send"  icon="ion-ios-call" onClick={getMessages} />
          ]}
        />

        <div className="message-list-container">{renderMessages()}</div>

        <Compose rightItems={[
          <ToolbarButton key="photo" icon="ion-ios-camera" />,
          <ToolbarButton key="image" icon="ion-ios-image" />,
          <ToolbarButton key="audio" icon="ion-ios-mic" />,
          <ToolbarButton key="money" icon="ion-ios-card" />,
          <ToolbarButton key="games" icon="ion-logo-game-controller-b" />,
          <ToolbarButton key="emoji" icon="ion-ios-happy" />
        ]}/>
      </div>
    );
}

const MessageList = (props) => {
  const {data, loading, error} = useSubscription(GET_CURR_MESSAGES, {variables:{
    id_sender: "2",
    id_receiver: props.recipient
  }});

  console.log(data)
  if (loading) {
    return (<div> <h1> Loading .. </h1></div>)
  }
  if (error) {
    return (<div> <h1> Error </h1> <p> {error.message} </p> </div>)
  }

  return (<MessageHandler
    newMessages = {data.messages}
    recipient = {props.recipient}
  />)
}

export default MessageList;
