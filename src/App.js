import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Navbar, Nav, Form, Button, FormControl } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import BoardComponent from './Board';
import Login from './UserLogin';
import UserListContainer from './PlayerList';
import GameEndedMessage from './GameOverEvent';
import LeaderBoard from './LeaderBoard';
import NavBar from './NavBar';
import PopUpBubble from './InvalidSearch';

const socket = io();
let userId = null;

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userList, setUserList] = useState([]);
  const [win, setWin] = useState(null);
  const [board, setBoard] = useState(['','','','','','','','','']);
  const [showLeaderBoard, setShowLeaderBoard] = useState(false);
  const [leaderBoard, setLeaderBoard] = useState([]);
  const [showBubble, setShowBubble] = useState(false);
  const [searchName, setSearchName] = useState(null);
  
  let currPane = 0; // 0: game 1: leaderBoard 2: filteredLeaderBoard

  function removeFromArray(arr, id) {
    return arr.filter((val) => val[0] !== id);
  }
  function resetGameButton() {
    socket.emit('restart');
  }
  function resetGame() {
    setWin(null);
  }
  function toggleLeaderBoard() {
    if (showLeaderBoard === false) {
      setShowLeaderBoard(true);
      socket.emit('get_leaderboard');
    } else {
      setShowLeaderBoard(false);
    }
  }
  function clickedGame() {
      if (showLeaderBoard) {
        setShowLeaderBoard(false);
        currPane = 0;
      }
  }
  function clickedLeader() {
      if (currPane !== 1 ) {
          setShowLeaderBoard(true);
          socket.emit('get_leaderboard');
          currPane = 1;
      }
  }
  function requestLeaderboardEntry(username) {
      socket.emit('get_player_from_leaderboard', {name: username} );
  }

  useEffect(() => {
    socket.on('player_list_update', (data) => {
      // add to playerlist
      // Event 1: The user is not logging in for the first time
      const dataJson = JSON.parse(data);
      if ({}.hasOwnProperty.call(dataJson, 'uid')) {
        setUserList((prevList) => [...prevList, [dataJson.uid, dataJson.name]]);
      } else if ({}.hasOwnProperty.call(dataJson, 'players')) {
        // Event 2: The user logs in for the first time, needs list from server
        let usersGiven = dataJson.players;
        userId = dataJson.own_id;
        setUserList(() => usersGiven.map((entry) => [entry.uid, entry.name]));
      } else {
        // Event 3: User list updated by disconnect event
        setUserList(() => dataJson.map((entry) => [entry.uid, entry.name]));
      }
    });
    socket.on('logout', (data) => {
      // remove from playerlist
      setUserList((prevList) => removeFromArray(prevList, data.id));
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
      const dataJson = JSON.parse(data);
      const jsFriendlyArray = [];
      for (let i = 0; i < dataJson.length; i += 1) {
        jsFriendlyArray.push([dataJson[i].name, dataJson[i].score, i+1]);
      }
      setLeaderBoard(() => jsFriendlyArray);
    });
    socket.on('leaderboard_player_entry', (data) => {
        const dataJson = JSON.parse(data);
        if (dataJson.exists === 'true') {
            currPane = 2;
            if (!showLeaderBoard) {
                setShowLeaderBoard(true);
            }
            setLeaderBoard([[dataJson.name, dataJson.score, dataJson.rank]])
        } else {
            setShowBubble(true);
            setSearchName(dataJson.name);
        }
    });
  }, []);
  
    return (
        <div>
          { !loggedIn && <div>
            <Login socket={socket} statusFunction={setLoggedIn} />
          </div>
          }
          { loggedIn && <div>
            <NavBar toggleGame={clickedGame} toggleLeaderboard={clickedLeader} requestEntry={requestLeaderboardEntry} />
            {showBubble && <PopUpBubble showBubble={showBubble} setShowBubble={setShowBubble} searchName={searchName} />}
            <Container>
              { showLeaderBoard &&
              <Row>
                  <Col sm={12}>
                      <LeaderBoard leaderboard={leaderBoard} />
                  </Col>
              </Row>
              }
              { win !== null && !showLeaderBoard &&
              <Row>
                  <Col className='ml-5' md={4}>
                      <GameEndedMessage result={win} resetGame={resetGameButton} />
                  </Col>
              </Row>
              }
              { !showLeaderBoard &&
              <Row>
                  <Col>
                      <BoardComponent socket={socket} userId={userId} users={userList.slice(0,2)} board={board} setBoard={setBoard} />
                  </Col>
                  <Col>
                      <UserListContainer userList={userList} />
                  </Col>
              </Row>
              }
            </Container>
          </div>
          }
      </div>
    );
}

export default App;