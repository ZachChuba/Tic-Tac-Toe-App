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
    
    function onClickBoard(index) {
        let playerNumber = inArray(props.users, socket.io.engine.id);
        if (playerNumber >= 0) {
            if (whoseTurn() == playerNumber) {
                setBoard(prevBoard => updateArray(prevBoard, index, playerNumber == 0 ? 'x' : 'o'));
                socket.emit('board_click', {tile: index, move: playerNumber == 0 ? 'x' : 'o'});
            }
        }
    }
    
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
          <Square index='0' onClickFunction={onClickBoard} content={board[0]}/>
          <Square index='1' onClickFunction={onClickBoard} content={board[1]}/>
          <Square index='2' onClickFunction={onClickBoard} content={board[2]}/>
          <Square index='3' onClickFunction={onClickBoard} content={board[3]}/>
          <Square index='4' onClickFunction={onClickBoard} content={board[4]}/>
          <Square index='5' onClickFunction={onClickBoard} content={board[5]}/>
          <Square index='6' onClickFunction={onClickBoard} content={board[6]}/>
          <Square index='7' onClickFunction={onClickBoard} content={board[7]}/>
          <Square index='8' onClickFunction={onClickBoard} content={board[8]}/>
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