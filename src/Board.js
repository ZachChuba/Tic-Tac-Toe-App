import React from 'react';
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import './Board.css'

const socket = io();

export function Login() {
    const [showLoginPrompt, setLoginPrompt] = useState(true);
    
    function loginPressed(text) {
        // if user has entered a name join and display
        setLoginPrompt(prevVal => false);
        socket.emit('login', {id:socket.io.engine.id, name: text});
        // add to player/spectator list etc
    }
    
    
    return (
        <div>
            {showLoginPrompt ? <LoginComponents clickFunction={loginPressed}/> : null}
        </div>
    );
}

function LoginComponents(props) {
    const inputRef = useRef(null);
    return (
        <div>
            <input ref={inputRef} required type="text" placeholder="Enter Username"/>
            <button onClick={() => props.clickFunction(inputRef.current.value)}>Join Room</button>
        </div>
    );
}

function UserListContainer() {
    const [players, setPlayers] = useState([]);
    
    function removeFromArray(arr, id) {
        return arr.filter((val, index) => {
            return val[0] != id;
        });
    }
    
    useEffect(() => {
        socket.on('login', (data) => {
            // add to playerlist
            setPlayers(prevList => [...prevList, [data.id, data.name]]);
        });
        socket.on('logout', (data) => {
            // remove from playerlist
            setPlayers(prevList => removeFromArray(prevList, data.id));
        });
        return function cleanup() {
            // remove from playerlist
            socket.emit('logout', {id:socket.io.engine.id});
        };
    });
    return (
        <div>
        <h1> Players </h1>
        <PlayersList activePlayers={players.slice(0,2)}/>
        <h1> Spectators </h1>
        <SpectatorList activeSpectators={players.slice(2)}/>
        </div>
    );
}

function PlayersList(props) {
    
}

function SpectatorList(props) {
    
}

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
        socket.on('connect', () => {
            
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