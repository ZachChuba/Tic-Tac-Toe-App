import React from 'react';
import {useState, useRef} from 'react';
import io from 'socket.io-client';

export function Login(props) {
    
    function loginPressed(text) {
        // if user has entered a name join and display
        props.statusFunction(prevValue => true);
        props.socket.emit('login', {id:props.socket.io.engine.id, name: text});
    }
    
    
    return (
        <div>
            <LoginComponents clickFunction={loginPressed}/>
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