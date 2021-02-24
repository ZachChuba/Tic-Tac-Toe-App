
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
            setUserList(prevList => [...prevList, [data.id, data.name]]);
        });
        socket.on('logout', (data) => {
            // remove from playerlist
            setUserList(prevList => removeFromArray(prevList, data.id));
        });
        return function cleanup() {
            // remove from playerlist
            socket.emit('logout', {id:socket.io.engine.id});
        };
    }, []);
  
  return (
    <div className="App">
      {!loggedIn ? <Login statusFunction={setLoggedIn} socket={socket}/> : null}
      {loggedIn ? <BoardComponent /> : null}
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