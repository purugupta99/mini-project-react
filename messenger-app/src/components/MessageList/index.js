import React, {useEffect, useState} from 'react';
import Compose from '../Compose';
import Toolbar from '../Toolbar';
import ToolbarButton from '../ToolbarButton';
import Message from '../Message';
import moment from 'moment';
import axios from 'axios';

import './MessageList.css';

const MY_USER_ID = '1';
const TALKING_TO = '2';

export default function MessageList(props) {
  const [messages, setMessages] = useState([]);
  const [talking_to, setTalkingTo] = useState([]);

  useEffect(() => {
    getMessages();
    getTalkingToName();
  },[])

  
  const getMessages = () => {
    axios({
      url: 'https://messenger-app.hasura.app/v1/graphql',
      method: 'post',
      data: {
        query: `
        query MyQuery ($sender:String!,$receiver:String!) {
          messages(where: {_or: [{_and: [{id_receiver: {_eq: $receiver}}, {id_sender: {_eq: $sender}}]},{_and: [{id_receiver: {_eq: $sender}}, {id_sender: {_eq: $receiver}}]}]}, order_by: {send_at: asc}) {
            text
            user_sender{
              id
            }
          }
        }    
          `,
        variables: {
          sender: MY_USER_ID,
          receiver: TALKING_TO
        },
      },
      headers: {
        'x-hasura-admin-secret': 'cLzWoSwe7ooq2gB67r5bLrTMMDkNU5wjIZ6G7h5MEcXcp8wgPvzPcZPE6hGk3XW8',
        'content-type': 'application/json'
      }
    })
    .then(response => {
      console.log(response);
        let tempMessages = response.data.data.messages.map(messages => {
          return {
            id: messages.id,
            author: messages.user_sender.id,
            message: messages.text,
            timestamp: messages.sent_at
          };
        });
        setMessages([...messages, ...tempMessages])
    })
    .catch(error => {
      console.log(error);
    });
     /* var tempMessages = [
        {
          id: 1,
          author: 'apple',
          message: 'Hello world! This is a long message that will hopefully get wrapped by our message bubble component! We will see how well it works.',
          timestamp: new Date().getTime()
        },
        {
          id: 2,
          author: 'orange',
          message: 'It looks like it wraps exactly as it is supposed to. Lets see what a reply looks like!',
          timestamp: new Date().getTime()
        },
        {
          id: 3,
          author: 'orange',
          message: 'Hello world! This is a long message that will hopefully get wrapped by our message bubble component! We will see how well it works.',
          timestamp: new Date().getTime()
        },
        {
          id: 4,
          author: 'apple',
          message: 'It looks like it wraps exactly as it is supposed to. Lets see what a reply looks like!',
          timestamp: new Date().getTime()
        },
        {
          id: 5,
          author: 'apple',
          message: 'Hello world! This is a long message that will hopefully get wrapped by our message bubble component! We will see how well it works.',
          timestamp: new Date().getTime()
        },
        {
          id: 6,
          author: 'apple',
          message: 'It looks like it wraps exactly as it is supposed to. Lets see what a reply looks like!',
          timestamp: new Date().getTime()
        },
        {
          id: 7,
          author: 'orange',
          message: 'Hello world! This is a long message that will hopefully get wrapped by our message bubble component! We will see how well it works.',
          timestamp: new Date().getTime()
        },
        {
          id: 8,
          author: 'orange',
          message: 'It looks like it wraps exactly as it is supposed to. Lets see what a reply looks like!',
          timestamp: new Date().getTime()
        },
        {
          id: 9,
          author: 'apple',
          message: 'Hello world! This is a long message that will hopefully get wrapped by our message bubble component! We will see how well it works.',
          timestamp: new Date().getTime()
        },
        {
          id: 10,
          author: 'orange',
          message: 'It looks like it wraps exactly as it is supposed to. Lets see what a reply looks like!',
          timestamp: new Date().getTime()
        },
      ] */
      // setMessages([...messages, ...tempMessages])
  }
  const getTalkingToName = () => {
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
          talking_to: TALKING_TO
        }
      },
      headers: {
        'x-hasura-admin-secret': 'cLzWoSwe7ooq2gB67r5bLrTMMDkNU5wjIZ6G7h5MEcXcp8wgPvzPcZPE6hGk3XW8',
        'content-type': 'application/json'
      }
    })
    .then(response => {
      console.log(response.data.data.users[0].name);
        let talking_with_name = response.data.data.users[0].name;
        setTalkingTo(talking_with_name);
    })
    .catch(error => {
      console.log(error);
      return "Error in loading name";
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