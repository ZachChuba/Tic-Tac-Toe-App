import React from 'react';
import {useState} from 'react';
import io from 'socket.io-client';

export function ShowWhenGameEnds(props) {
    return (
        <div>
            <WinnerDisplay result={props.result} />
            <PlayAgainButton resetGame={props.resetGame} />
        </div>
    );
}

function WinnerDisplay(props) {
    return (
        <div>
            {props.result.length === 1 ? <h1> Winner: props.result </h1> : <h1> Draw </h1>}
        </div>
    );
}

function PlayAgainButton(props) {
    return (
        <div>
            <button onClick={props.resetGame}>Play Again?</button>
        </div>
    );
}