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
                {props.leaderBoard.map((playerEntry) => {
                    <tr><td>{playerEntry.name}</td><td>{playerEntry.score}</td></tr>
                })}
            </tbody>
        </table>
        </div>
    );
}

function DisplayLeaderBoardButton(props) {
    return(
        <div>
            <button class="myButton" onClick={props.toggleLeaderboard}>Toggle Leaderboard</button>
        </div>
    );
}