import React from 'react';
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import './Board.css'

export function BoardComponent(props) {
    const [board, setBoard] = useState(['','','','','','','','','']);
    let socket = props.socket;
    
    function updateArray(arr, index, value) {
        return arr.map((val, i) => {
            if (i == index) {
                return value;
            }
            return val;
        });
        
    }
    
    function inArray(arr, target) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i][0].localeCompare(target) == 0) {
                return i;
            }
        }
        return -1;
    }
    
    function whoseTurn() {
        let xCount = 0;
        let oCount = 0;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === 'x')
                xCount++;
            if (board[i] === 'o') {
                oCount++;
            }
        }
        // player 0 or player 1
        return xCount <= oCount ? 0 : 1;
    }
    
    function updateBoard(prevBoard, index, playerNumber) {
        let newBoard = updateArray(prevBoard, index, playerNumber == 0 ? 'x' : 'o');
        let gameEnded = isGameOver(newBoard);
        if (gameEnded != null) {
            if (gameEnded == 'draw') {
                socket.emit('game_over', {state: 'draw'});
            } else {
                socket.emit('game_over', {state: 'win', winner: props.users[playerNumber][1], loser: playerNumber == 0 ? props.users[1][1] : props.users[0][1]});
            }
        }
        return newBoard;
    }
    
    function onClickBoard(index) {
        let playerNumber = inArray(props.users, socket.io.engine.id);
        if (playerNumber >= 0) { // Stop spectators from moving
            // stop illegal moves
            if (whoseTurn() == playerNumber && isGameOver(board) === null && board[index] === '') {
                setBoard(prevBoard => updateBoard(prevBoard, index, playerNumber));
                socket.emit('board_click', {tile: index, move: playerNumber == 0 ? 'x' : 'o'});
            }
        }
    }
    
    // Whenever the board updates, check if game is over
    /*
    useEffect(() => {
        const gameEnded = isGameOver(board);
        if (gameEnded != null) {
            if (gameEnded == 'draw') {
                socket.emit('game_over', {state: 'draw'});
            } else {
                socket.emit('game_over', {state: 'win', winner: gameEnded, loser: props.users[0][1] == gameEnded ? props.users[0][1] : props.users[1][1]});
            }
        }
    }, board);*/
    
    useEffect(() => {
        socket.on('board_click', (data) => {
            // If the server sends a message (on behalf of another client), then we
            // add it to the list of messages to render it on the UI.
            setBoard(prevBoard => updateArray(prevBoard, data.tile, data.move));
        });
        socket.on('board_state', (data) => {
            // When someone joins in the middle of the game, give them the current board
           const jsonData = JSON.parse(data);
           setBoard(prevBoard => jsonData.map(entry => entry));
        });
    }, []);
    
    return (
        <div class="board">
            {board.map((value, index) => <Square index={index} onClickFunction={onClickBoard} content={value} />)}
        </div>
    );
}

export function Square(props) {
    return (
        <div class="box" onClick={() => props.onClickFunction(props.index)}>
        {props.content}
        </div>
    );
}

function isGameOver(board) {
    const winner = calculateWinner(board);
    if (winner != null) {
        return winner;
    } else if (board.filter(location => location != '' ? false : true).length == 0) {
        return 'draw';
    } else {
        return null;
    }
}

// From react TTT tutorial
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}