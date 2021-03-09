import React from "react";
import { useState } from "react";
import io from "socket.io-client";

export function ShowWhenGameEnds(props) {
  return (
    <div class="playAgain">
      <WinnerDisplay result={props.result} />
      <PlayAgainButton resetGame={props.resetGame} />
    </div>
  );
}

function WinnerDisplay(props) {
  return <div>{<h1 class="winner-h1"> Winner: {props.result} </h1>}</div>;
}

function PlayAgainButton(props) {
  return (
    <div>
      <button class="myButton" onClick={props.resetGame}>
        Play Again?
      </button>
    </div>
  );
}
