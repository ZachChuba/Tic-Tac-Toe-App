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
    socket.on('login', (data) => {
      // add to playerlist
      // Event 1: The user is not logging in for the first time
      if ({}.hasOwnProperty.call(data, 'id')) {
        setUserList((prevList) => [...prevList, [data.id, data.name]]);
      } else {
        // Event 2: The user logs in for the first time, needs list from server
        const dataJson = JSON.parse(data);
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
    // Handle logout for when the user closes tab/refreshes page
    window.addEventListener('beforeunload', () => {
      socket.emit('logout', { id: socket.io.engine.id });
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
                      <BoardComponent socket={socket} users={userList.slice(0,2)} board={board} setBoard={setBoard} />
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