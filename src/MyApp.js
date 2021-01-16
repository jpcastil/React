import React, {useState, useEffect} from 'react';
import Table from './Table'
import Form from './Form';
import axios from 'axios';

// Init function 
async function fetchAll(){
  try {
     const response = await axios.get('http://localhost:5000/users');
     return response.data.users_list;     
  }
  catch (error){
     //We're not handling errors. Just logging into the console.
     console.log(error); 
     return false;         
  }
}

function MyApp() {
  const [characters, setCharacters] = useState([]);
  useEffect(() => {
    fetchAll().then( result => {
       if (result)
          setCharacters(result);
     });
  }, [] );

  async function makePostCall(person){
    try {
      const response = await axios.post('http://localhost:5000/users/', person);
      if (response.status !== 201){
        throw new Error("Back end must return code 201. it did not. Table addition invalid")
      }
      return response.data;
    }
    catch (error) {
       console.log(error);
       return false;
    }
  }

  function updateList(person) { 
    makePostCall(person).then( result => {
      if (result){
        setCharacters(result.users_list);
      }
    });
  }

  function removeOneCharacter (index) {
    let character = characters[index]; 
    // removes from FE
    const updated = characters.filter((character, i) => {
        return i !== index
    });
    setCharacters(updated);
    // removes from BE
    makeDeleteCall(character);
  }

  async function makeDeleteCall(person){
    try {
      const response = await axios.delete(`http://localhost:5000/users/${person.id}`);
      if (response.status !== 204){
        throw new Error("Back end must return code 204.")
      }
      return response;
    }
    catch (error) {
       console.log(error);
       return false;
    }
  }

  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  )
}

export default MyApp;
