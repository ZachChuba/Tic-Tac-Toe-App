import React from 'react';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './MainStyle.css'

export function LeaderBoard(props) {
    return (
        <div>
            <DisplayLeaderBoardButton toggleLeaderboard={props.toggleLeaderboard} />
            {props.showLeaderBoard && <LeaderBoardTable leaderBoard={props.leaderBoard} />}
        </div>
    );
}

function LeaderBoardTable(props) {
    return(
        <div>
        <table class="blueTable">
            <thead><tr> <th>Player Name</th> <th>Score</th> </tr></thead>
            <tfoot>Only the top 50 are displayed</tfoot>
            <tbody>
                {props.leaderBoard.map(entry => <LeaderBoardRow name={entry[0]} score={entry[1]} />)}
            </tbody>
        </table>
        </div>
    );
}
function LeaderBoardRow(props) {
    return (
        <tr><td>{props.name}</td><td>{props.score}</td></tr>
    );
}

function DisplayLeaderBoardButton(props) {
    return(
        <div>
            <button class="myButton" id="lb" onClick={props.toggleLeaderboard}>Toggle Leaderboard</button>
        </div>
    );
}