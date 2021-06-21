import { gql, useQuery} from '@apollo/client';
import React, { useState } from 'react';
import './ConversationSearch.css';

//Need to update query
// const GET_FILTERED_USERS = gql `
// query MyQuery ($search_name: String){
//   messages(
//     where: {
//       _or: [{
//       user_receiver: {
//         name: {_like: $search_name}
//         }
//       },
//         {user_sender: {
//           name: {_like: $search_name}
//         }
//         }
//       ]
//     },
//     distinct_on: [id_receiver,id_sender]) {
//     text
//     id_sender
//     id_receiver
//   }
// }
// `;

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


const GET_FILTERED_USERS = gql `
  query getUsers ($searchName: String){
    users (where: {name: {_like: $searchName}}){
      id
      name
      last_seen
    }
  }
`;

const ConversationSearch = props => {
  const [searchInput, setSearchInput] = useState('');
  // props.userList, props.updateUserList
  let users = props.userList;
  console.log(users);
  var searchedUsers = users.filter(user => user.name.toLowerCase().includes(searchInput.toLowerCase()));
  console.log((searchedUsers));

  props.updateUserList(searchedUsers);

  const resetInput = () => {
    setSearchInput('');
  };

  const {queryUsers, loading, error} = useQuery(GET_FILTERED_USERS, {
    variables: {"searchName": searchInput},
    // onCompleted: resetInput
  });
  
  return (
    <form className="conversation-search"
    onSubmit={(e) => {
      e.preventDefault();
      // queryUsers (
      //   {
      //     variables: {
      //       search_name: searchInput
      //     }
      //   }
      // );
    }}
    >
      <input
        type="search"
        className="conversation-search-input"
        placeholder="Search Messages"
        value={searchInput}
        onChange={e => (setSearchInput(e.target.value))}
      />
      {
        props.rightItems
      }
    </form>
  );
};

export default ConversationSearch;