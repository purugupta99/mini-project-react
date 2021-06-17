import React, {useEffect, useState} from 'react';
import Compose from '../Compose';
import Toolbar from '../Toolbar';
import ToolbarButton from '../ToolbarButton';
import Message from '../Message';
import moment from 'moment';

import { gql, useQuery } from '@apollo/client';

import './MessageList.css';

const MY_USER_ID = 'apple';

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
const MessageList = props => {

  const [messages, setMessages] = useState("");
  const {data, loading, error} = useQuery(GET_MY_MESSAGES);

  console.log(data)
  if (loading) {
    return (<div> <h1> Loading .. </h1></div>)
  }
  if (error) {
    return (<div> <h1> Error </h1> <p> {error.message} </p> </div>)
  }
  
  let tempMessages = data.messages.map(messages => {
    return {
      id: messages.id,
      author: messages.user_sender.id,
      message: messages.text,
      timestamp: messages.send_at
    };
  });

  if (messages == ""){
    setMessages(tempMessages)
  }
  // const getMessages = async () => {

  //    console.log("hi");

  //    const [addMessages] = useQuery(GET_MY_MESSAGES);
  //    let messageList = addMessages({variables: {id_receiver: "1", id_sender: "1"}});

  //    console.log(messageList);
  //   //  var tempMessages = [
  //   //     {
  //   //       id: 1,
  //   //       author: 'apple',
  //   //       message: 'Hello world! This is a long message that will hopefully get wrapped by our message bubble component! We will see how well it works.',
  //   //       timestamp: new Date().getTime()
  //   //     },
  //   //     {
  //   //       id: 2,
  //   //       author: 'orange',
  //   //       message: 'It looks like it wraps exactly as it is supposed to. Lets see what a reply looks like!',
  //   //       timestamp: new Date().getTime()
  //   //     },
  //   //     {
  //   //       id: 3,
  //   //       author: 'orange',
  //   //       message: 'Hello world! This is a long message that will hopefully get wrapped by our message bubble component! We will see how well it works.',
  //   //       timestamp: new Date().getTime()
  //   //     },
  //   //     {
  //   //       id: 4,
  //   //       author: 'apple',
  //   //       message: 'It looks like it wraps exactly as it is supposed to. Lets see what a reply looks like!',
  //   //       timestamp: new Date().getTime()
  //   //     },
  //   //     {
  //   //       id: 5,
  //   //       author: 'apple',
  //   //       message: 'Hello world! This is a long message that will hopefully get wrapped by our message bubble component! We will see how well it works.',
  //   //       timestamp: new Date().getTime()
  //   //     },
  //   //     {
  //   //       id: 6,
  //   //       author: 'apple',
  //   //       message: 'It looks like it wraps exactly as it is supposed to. Lets see what a reply looks like!',
  //   //       timestamp: new Date().getTime()
  //   //     },
  //   //     {
  //   //       id: 7,
  //   //       author: 'orange',
  //   //       message: 'Hello world! This is a long message that will hopefully get wrapped by our message bubble component! We will see how well it works.',
  //   //       timestamp: new Date().getTime()
  //   //     },
  //   //     {
  //   //       id: 8,
  //   //       author: 'orange',
  //   //       message: 'It looks like it wraps exactly as it is supposed to. Lets see what a reply looks like!',
  //   //       timestamp: new Date().getTime()
  //   //     },
  //   //     {
  //   //       id: 9,
  //   //       author: 'apple',
  //   //       message: 'Hello world! This is a long message that will hopefully get wrapped by our message bubble component! We will see how well it works.',
  //   //       timestamp: new Date().getTime()
  //   //     },
  //   //     {
  //   //       id: 10,
  //   //       author: 'orange',
  //   //       message: 'It looks like it wraps exactly as it is supposed to. Lets see what a reply looks like!',
  //   //       timestamp: new Date().getTime()
  //   //     },
  //   //   ]
      // setMessages(tempMessages);
  // }

  const renderMessages = () => {
    let i = 0;
    let messageCount = messages.length;
    let messageList = [];

    while (i < messageCount) {
      let previous = messages[i - 1];
      let current = messages[i];
      let next = messages[i + 1];
      let isMine = current.author === MY_USER_ID;
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

export default MessageList;