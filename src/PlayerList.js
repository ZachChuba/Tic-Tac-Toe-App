import React from 'react';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './MainStyle.css'

export function UserListContainer(props) {
    return (
        <div class="list-wrapper">
            <h1 class="list-h1"> Users Online </h1>
            <PlayersList activePlayers={props.userList.slice(0,2)}/>
            <SpectatorList activeSpectators={props.userList.slice(2)}/>
        </div>
    );
    /*
    {props.userList.length > 2 ? <h1> Spectators </h1> : null}
    */
}

function PlayersList(props) {
    return (
        <div>
            <ul class="list">
            {props.activePlayers.map((item, index) => <ListItem type="player" position={index===0 ? 'X': 'O'} name={item[1]} />)}
            </ul>
        </div>
    );
}

function SpectatorList(props) {
    return (
        <div>
            {props.activeSpectators.length > 0 ?
            <ul class="list">
               {props.activeSpectators.map(item => <ListItem type="spectator" name={item[1]} position={"none"} />)} 
            </ul>
            : null}
        </div>
    );
    
}

function ListItem(props) {
    return (
        <li class="list-item">
        <div>
            {props.type == "player" ?
            <img src="https://www.flaticon.com/svg/vstatic/svg/20/20079.svg?token=exp=1614381901~hmac=eb29392a8dbeaf04952b8f0f5ee888e5" class="list-item-image" />
            : null}
        </div>
        <div>
            <h4 class="list-h4"> {props.name} </h4>
            <p class="list-p"> {props.type == "player" ? "Playing As " + props.position : "Watching"}</p>
        </div>
        </li>
    );
}