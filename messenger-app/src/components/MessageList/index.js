import React, {useEffect, useState, createContext} from 'react';
import Compose from '../Compose';
import Toolbar from '../Toolbar';
import ToolbarButton from '../ToolbarButton';
import Message from '../Message';
import moment from 'moment';
import axios from 'axios';
import myInitObject from '../MyInit';
import Loading from "../Loading";

import { useSubscription, useApolloClient, gql } from "@apollo/client";

import './MessageList.css';




const MessageList2 = (props) => {
  const [messages, setMessages] = useState([]);
  const [talking_to, setTalkingTo] = useState([]); // stores name
  const [talking_toID, setTalkingToID] = useState(props.receiver); // stores id
  const [reload, setReload] = useState(1); // farzi

  useEffect(() => {
    setTalkingToID(props.receiver);
    getMessages();
    getTalkingToName(props.receiver);
    setReload((reload+1) % 100); // farzi
  },[])
  const getMessages = () => {
    // console.log("Hello again");

    let tempMessages = props.latestMessages.map(messages => {
      return {
        id: messages.id,
        author: messages.user_sender.id,
        message: messages.text,
        timestamp: messages.sent_at
      };
    });
    if(messages.length!==props.numMessages){
      setMessages(tempMessages);
    // console.log("Hello luv");
    }
  }
  // console.log("Hello partyyy");
  getMessages();
  const add2Message = newMsg => {
    setMessages([...messages, ...newMsg])
  }
  const getTalkingToName = (id) => {
    axios({
      url: 'https://messenger-app.hasura.app/v1/graphql',
      method: 'post',
      data: {
        query: `
        query MyQuery($talking_to: String) {
          users(where: {id: {_eq: $talking_to}}) {
            name
          }
        }        
          `,
        variables: {
          talking_to: id
        }
      },
      headers: {
        'x-hasura-admin-secret': 'cLzWoSwe7ooq2gB67r5bLrTMMDkNU5wjIZ6G7h5MEcXcp8wgPvzPcZPE6hGk3XW8',
        'content-type': 'application/json'
      }
    })
    .then(response => {
        let talking_with_name = response.data.data.users[0].name;
        setTalkingTo(talking_with_name);
    })
    .catch(error => {
      console.log(error);
      setTalkingTo("Error in loading name");
    });
  }
  const renderMessages = () => {
    let i = 0;
    let messageCount = messages.length;
    let tempMessages = [];

    while (i < messageCount) {
      let previous = messages[i - 1];
      let current = messages[i];
      let next = messages[i + 1];
      let isMine = current.author === props.me;
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

      tempMessages.push(
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

    return tempMessages;
  }
  if(talking_toID !== props.receiver){
    setTalkingToID(props.receiver);
    getTalkingToName(props.receiver);
    setMessages([]);
    getMessages(props.receiver);
    console.log(props.receiver, reload,talking_toID);
  }

    return(
      <div className="message-list">
        <Toolbar
          title={talking_to}
          rightItems={[
            <ToolbarButton key="info" icon="ion-ios-information-circle-outline" />,
            <ToolbarButton key="video" icon="ion-ios-videocam" />,
            <ToolbarButton key="phone" icon="ion-ios-call" />
          ]}
        />

        <div className="message-list-container">{renderMessages()}</div>

        <Compose
        rightItems={[
          <ToolbarButton key="photo" icon="ion-ios-camera" />,
          <ToolbarButton key="image" icon="ion-ios-image" />,
          <ToolbarButton key="audio" icon="ion-ios-mic" />,
          <ToolbarButton key="money" icon="ion-ios-card" />,
          <ToolbarButton key="games" icon="ion-logo-game-controller-b" />,
          <ToolbarButton key="emoji" icon="ion-ios-happy" />
        ]}
        idReceiver= {props.receiver}
        nameReceiver = {talking_to}
        idSender = {props.me}
        addMessage = {add2Message}
        />
      </div>
    );
}

const NOTIFY_NEW_MESSAGES = gql`
    subscription getMessages ($sender:String!,$receiver:String!) {
      messages(where: {_or: [{_and: [{id_receiver: {_eq: $receiver}}, {id_sender: {_eq: $sender}}]},{_and: [{id_receiver: {_eq: $sender}}, {id_sender: {_eq: $receiver}}]}]}, order_by: {send_at: asc}) {
        text
        user_sender{
          id
        }
      }
    }
  `;
  const MessageList =(props) => {
    console.log(props);
    const { loading, error, data } = useSubscription(NOTIFY_NEW_MESSAGES, {variables: {
      sender: props.me,
      receiver: props.receiver
    }});
    if (loading) {
      return <Loading />;
    }
    if (error) {
      console.log(error);
      return <span>Error... {error.message}</span>;
    }
    console.log("socket-data")
    console.log(data);
    // return <Loading/>;
    return (<MessageList2
      latestMessages={data.messages}
      numMessages = {data.messages.length}
      receiver = {props.receiver}
      me = {props.me}
      />);
  }

export default MessageList;