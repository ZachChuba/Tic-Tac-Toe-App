
import logo from './logo.svg';
import './App.css';
import { ListItem } from './ListItem.js';
import { BoardComponent} from './Board.js';
import { Login } from './UserLogin.js'
import { UserListContainer } from './PlayerList.js';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io();

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userList, setUserList] = useState([]);
  
  function removeFromArray(arr, id) {
      return arr.filter((val, index) => {
          return val[0] != id;
      });
  }
  
  useEffect(() => {
        socket.on('login', (data) => {
            // add to playerlist
            // Event 1: The user is not logging in for the first time
            if (data.hasOwnProperty('id')) {
              setUserList(prevList => [...prevList, [data.id, data.name]]);
            } else { // Event 2: The user logs in for the first time, needs list from server
              const dataJson = JSON.parse(data);
              setUserList(prevList => dataJson.map(entry => [entry.uid, entry.name]));
            }
        });
        socket.on('logout', (data) => {
            // remove from playerlist
            setUserList(prevList => removeFromArray(prevList, data.id));
        });
        // Handle logout for when the user closes tab/refreshes page
        window.addEventListener("beforeunload", function(e) {
          socket.emit('logout', {id:socket.io.engine.id});
        });
        // Handle logout for any other instance where the object is dismounted
        return function cleanup() {
            // remove from playerlist
            socket.emit('logout', {id:socket.io.engine.id});
        };
    }, []);
  
  return (
    <div className="App">
      {!loggedIn ? <Login statusFunction={setLoggedIn} socket={socket} /> : null}
      {loggedIn ? <BoardComponent socket={socket} users={userList.slice(0,2)} /> : null}
      {loggedIn ? <UserListContainer userList={userList} /> : null}
    </div>
  );
}

export default App;

/* Old code for reference, TODO delete
<input ref={inputRef} type="text" />
      <button onClick={onClickButton}> Add to list </button>
      <ul>
        {myList.map(item => <ListItem name={item} />)}
      </ul>
*/