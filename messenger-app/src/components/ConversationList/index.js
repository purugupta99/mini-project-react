import React, {useState, useEffect} from 'react';
import ConversationSearch from '../ConversationSearch';
import ConversationListItem from '../ConversationListItem';
import Toolbar from '../Toolbar';
import ToolbarButton from '../ToolbarButton';
import { gql, useQuery } from '@apollo/client';


import './ConversationList.css';

const GET_MY_CONVOS = gql `
  query getUsers {
    users {
      id
      name
      last_seen
    }
  }
`;

export default function ConversationList(props) {
  const [conversations, setConversations] = useState([]);

  const {data, loading, error} = useQuery(GET_MY_CONVOS);

  console.log(data);

  if (loading) {
    return (<div> <h1> Loading .. </h1></div>)
  }
  if (error) {
    return (<div> <h1> Error </h1> <p> {error.message} </p> </div>)
  }

  let tempUsers = data.users.map(users => {
    return {
      user_id: users.id,
      name: users.name,
      photo: "https://i.pinimg.com/236x/38/aa/95/38aa95f88d5f0fc3fc0f691abfaeaf0c.jpg",
      last_seen: users.last_seen,
    };
  });

  if (conversations == ""){
    setConversations(tempUsers)
  }

//   useEffect(() => {
//     getConversations()
//   },[])

//  const getConversations = () => {
//     axios.get('https://randomuser.me/api/?results=20').then(response => {
//         let newConversations = response.data.results.map(result => {
//           return {
//             photo: result.picture.large,
//             name: `${result.name.first} ${result.name.last}`,
//             text: 'Hello world! This is a long message that needs to be truncated.'
//           };
//         });
//         setConversations([...conversations, ...newConversations])
//     });
//   }

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

              user_id = {conversation.id}
              key = {conversation.name}
              data = {conversation}
              handleRecipient = {props.handleRecipient}
            />
          )
        }
      </div>
    );
}