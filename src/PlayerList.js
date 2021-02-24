import React from 'react';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

export function UserListContainer(props) {
    return (
        <div>
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
            <ul>
               {props.activePlayers.map(item => <ListItem name={item[1]}/>)}
            </ul>
        </div>
    );
}

function SpectatorList(props) {
    return (
        <div>
            <ul>
               {props.activeSpectators.map(item => <ListItem name={item[1]}/>)} 
            </ul>
        </div>
    );
    
}

function ListItem(props) {
    return (
        <li> {props.name} </li>
    );
}