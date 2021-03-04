
import './App.css';
import { BoardComponent} from './Board.js';
import { Login } from './UserLogin.js'
import { UserListContainer } from './PlayerList.js';
import { ShowWhenGameEnds } from './GameOverEvent.js';
import { LeaderBoard } from './LeaderBoard.js'
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io();

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userList, setUserList] = useState([]);
  const [win, setWin] = useState(null);
  const [showLeaderBoard, setShowLeaderBoard] = useState(false);
  const [leaderBoard, setLeaderBoard] = useState([])
  
  function removeFromArray(arr, id) {
      return arr.filter((val, index) => {
          return val[0] != id;
      });
  }
  function resetGameButton() {
      socket.emit('restart');
  }
  function resetGame() {
      setWin(prevState => null);
  }
  function toggleLeaderBoard() {
      if (showLeaderBoard === false) {
          setShowLeaderBoard(true);
          socket.emit('get_leaderboard');
      } else {
          setShowLeaderBoard(false);
      }
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
        socket.on('game_over', (data) => {
            if (data.state === 'draw') {
                setWin('draw');
            } else {
                setWin(data.winner);
            }
        });
        socket.on('restart', () => {
            resetGame();
        });
        socket.on('sending_leaderboard', (data) => {
            setLeaderBoard(data);
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
      {win != null && loggedIn && !showLeaderBoard ? <ShowWhenGameEnds result={win} resetGame={resetGameButton} /> : null}
      {loggedIn && !showLeaderBoard ? <BoardComponent socket={socket} users={userList.slice(0,2)} /> : null}
      {loggedIn && !showLeaderBoard ? <UserListContainer userList={userList} /> : null}
      {loggedIn && showLeaderBoard ? <LeaderBoard leaderBoard={leaderBoard} /> : null}
    </div>
  );
}

export default App;