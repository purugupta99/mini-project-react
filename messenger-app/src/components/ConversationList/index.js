import React, {useState, useEffect} from 'react';
import ConversationSearch from '../ConversationSearch';
import ConversationListItem from '../ConversationListItem';
import Toolbar from '../Toolbar';
import ToolbarButton from '../ToolbarButton';
import axios from 'axios';

import './ConversationList.css';

export default function ConversationList(props) {
  const [conversations, setConversations] = useState([]);
  useEffect(() => {
    getConversations()
  },[])

 const getConversations = () => {
    axios({
      url: 'https://messenger-app.hasura.app/v1/graphql',
      method: 'post',
      data: {
        query: `
        query getUsers {
          users {
            id
            name
            last_seen
          }
        }
          `
      },
      headers: {
        'x-hasura-admin-secret': 'cLzWoSwe7ooq2gB67r5bLrTMMDkNU5wjIZ6G7h5MEcXcp8wgPvzPcZPE6hGk3XW8',
        'content-type': 'application/json'
      }
    })
    .then(response => {
      console.log(response);
        let newConversations = response.data.data.users.map(users => {
          return {
            id: users.id,
            photo: 'https://i.pinimg.com/236x/38/aa/95/38aa95f88d5f0fc3fc0f691abfaeaf0c.jpg',
            name: users.name,
            text: users.last_seen
          };
        });
        setConversations([...conversations, ...newConversations])
    })
    .catch(error => {
      console.log(error);
    });

  }
    return (
      <div className="conversation-list">
        <Toolbar
          title="Messenger"
          leftItems={[
            <ToolbarButton key="cog" icon="ion-ios-cog" />
          ]}
          rightItems={[
            <ToolbarButton key="add" icon="ion-ios-add-circle-outline" />
          ]}
        />
        <ConversationSearch />
        {
          conversations.map(conversation =>
            <ConversationListItem
              key={conversation.name}
              data={conversation}
              id={conversation.id}
            />
          )
        }
      </div>
    );
}