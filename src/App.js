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

const socket = io();

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userList, setUserList] = useState([]);
  const [win, setWin] = useState(null);
  const [board, setBoard] = useState(['','','','','','','','','']);
  const [showLeaderBoard, setShowLeaderBoard] = useState(false);
  const [leaderBoard, setLeaderBoard] = useState([]);

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
      }
  }
  function clickedLeader() {
      if (!showLeaderBoard) {
          setShowLeaderBoard(true);
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
        if (data.exists === 'true') {
            setLeaderBoard(() => [data.name, data.score, data.rank])
            clickedLeader();
        } else {
            
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
            <Container>
              { leaderBoard &&
              <Row>
                  <Col sm={12}>
                      <LeaderBoard leaderboard={leaderBoard} />
                  </Col>
              </Row>
              }
              { win !== null && !leaderBoard &&
              <Row>
                  <Col className='ml-5' md={4}>
                      <GameEndedMessage result={win} resetGame={resetGameButton} />
                  </Col>
              </Row>
              }
              { !leaderBoard &&
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
  /*
  <Row>
            <Col md={6}>
                <ShowWhenGameEnds result={'x'} resetGame={resetGameButton}/>
            </Col>
        </Row>
  */
/*
  return (
    <div className="App">
      {!loggedIn ? (
        <Login statusFunction={setLoggedIn} socket={socket} />
      ) : null}
      {win != null && loggedIn ? (
        <ShowWhenGameEnds result={win} resetGame={resetGameButton} />
      ) : null}
      {loggedIn ? (
        <BoardComponent socket={socket} users={userList.slice(0, 2)} />
      ) : null}
      {loggedIn ? <UserListContainer userList={userList} /> : null}
      {loggedIn ? (
        <LeaderBoard
          leaderBoard={leaderBoard}
          toggleLeaderboard={toggleLeaderBoard}
          showLeaderBoard={showLeaderBoard}
        />
      ) : null}
    </div>
  ); */
}

export default App;