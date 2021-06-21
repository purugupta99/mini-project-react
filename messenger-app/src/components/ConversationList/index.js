import React, {useState, useEffect} from 'react';
import ConversationSearch from '../ConversationSearch';
import ConversationListItemWrapper from '../ConversationListItemWrapper';

import Toolbar from '../Toolbar';
import ToolbarButton from '../ToolbarButton';



import './ConversationList.css';

function arrayCompare(_arr1, _arr2) {
  if (
    !Array.isArray(_arr1)
    || !Array.isArray(_arr2)
    || _arr1.length !== _arr2.length
    ) {
      return false;
    }
  
  // .concat() to not mutate arguments
  const arr1 = _arr1.concat().sort();
  const arr2 = _arr2.concat().sort();
  
  for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
          return false;
       }
  }
  
  return true;
}

export default function ConversationList(props) {
  const [conversations, setConversations] = useState([]);

  // let tempUsers = props.users;
  let tempUsers = props.users;
  // console.log(tempUsers);

  // if (conversations == ""){
  //   setConversations(tempUsers)
  // }

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
  const updateTempUsers = (newUserList) => {
    if(newUserList.length!== conversations.length){
        setConversations(newUserList);
    }
  }
    return (
      <div className="conversation-list">
        <Toolbar
          title="Messenger"
          leftItems={[
            <ToolbarButton key="cog" icon="ion-ios-cog" />
          ]}
          rightItems={[
            <ToolbarButton key="logout" icon="ion-ios-power" url={props.logout} />
          ]}
        />
        <ConversationSearch
          userList = {tempUsers}
          updateUserList = {updateTempUsers}
        />
        <ConversationListItemWrapper
          conversations = {conversations}
          handleRecipient = {props.handleRecipient}
        />
      </div>
    );
}