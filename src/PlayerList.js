import React from 'react';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './MainStyle.css'

export function UserListContainer(props) {
    return (
        <div class="user_container">
            <h1> Players </h1>
            <PlayersList activePlayers={props.userList.slice(0,2)}/>
            <h1> Spectators </h1>
            <SpectatorList activeSpectators={props.userList.slice(2)}/>
        </div>
    );
    /*
    
    */
}

function PlayersList(props) {
    return (
        <div>
            {props.activePlayers.map((item, index) => <h3> {index===0 ? 'X:' : 'O:'} {item[1]} </h3>)}
        </div>
    );
}

function SpectatorList(props) {
    return (
        <div>
               {props.activeSpectators.map(item => <p> {item[1]} </p>)} 
        </div>
    );
    
}

function ListItem(props) {
    return (
        <li> {props.name} </li>
    );
}