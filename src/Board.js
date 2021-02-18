import React from 'react';
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import './Board.css'

const socket = io();

export function BoardComponent(props) {
    const [board, setBoard] = useState(['','','','','','','','','']);
    const [turn, setTurn] = useState(true); // true is x, false is y
    
    function updateArray(arr, index, value) {
        return arr.map((val, i) => {
            if (i == index) {
                return value;
            }
            return val;
        });
        
    }
    
    function onClickBoard(index) {
        setBoard(prevBoard => updateArray(prevBoard, index, turn ? 'x' : 'o'));
        setTurn(prevTurn => !prevTurn);
        socket.emit('board_click', {tile: index, move: turn ? 'x' : 'o', turn: turn});
    }
    
    useEffect(() => {
        socket.on('board_click', (data) => {
        console.log('Board_click event received!');
        console.log(data);
        // If the server sends a message (on behalf of another client), then we
        // add it to the list of messages to render it on the UI.
        setTurn(prevTurn => data.turn);
        setBoard(prevBoard => updateArray(prevBoard, data.tile, data.move));
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