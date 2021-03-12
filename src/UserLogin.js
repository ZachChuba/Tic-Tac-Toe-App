import React, { useRef } from 'react';

import io from 'socket.io-client';
import './MainStyle.css';

export function Login(props) {
  function loginPressed(text) {
    // if user has entered a name join and display
    props.statusFunction(true);
    props.socket.emit('login', { id: props.socket.io.engine.id, name: text });
  }

  return (
    <div>
      <LoginComponents clickFunction={loginPressed} />
    </div>
  );
}

function LoginComponents(props) {
  const inputRef = useRef(null);
  return (
    <div className="login">
      <h1 className="login-h1">Login</h1>
      <input
        ref={inputRef}
        required
        type="text"
        placeholder="Enter Username"
      />
      {' '}
      <br />
      <br />
      <button
        type="button"
        className="myButton"
        onClick={() => props.clickFunction(inputRef.current.value)}
      >
        Join Room
      </button>
    </div>
  );
}
