import React from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button';

export function ShowWhenGameEnds(props) {
  const { result, resetGame } = props;
  return (
    <Jumbotron>
      <h1> Winner: {result} </h1>
      <PlayAgainButton resetGameFunction={resetGame} />
    </Jumbotron>
  );
}

function PlayAgainButton(props) {
  const { resetGameFunction } = props;
  return (
    <Button variant='success' size='lg' onClick={resetGameFunction}>
      Play Again
    </Button>
  );
}
/*
export function ShowWhenGameEnds(props) {
  const { result, resetGame } = props;
  return (
    <div className="playAgain">
      <WinnerDisplay result={result} />
      <PlayAgainButton resetGame={resetGame} />
    </div>
  );
}

function WinnerDisplay(props) {
  const { result } = props;
  return (
    <div>
      <h1 className="winner-h1">
        {' '}
        Winner:
        {result}
      </h1>
    </div>
  );
}

function PlayAgainButton(props) {
  const { resetGame } = props;
  return (
    <div>
      <button type="button" className="myButton" onClick={resetGame}>
        Play Again?
      </button>
    </div>
  );
}
*/