import React from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert'

export function GameEndedMessage(props) {
  const { result, resetGame } = props;
  return (
    <Alert className='mt-5' key={0} variant='info'>
      { result !== 'draw' ? ( 
        <div><h5><b>{result}</b> is the winner! {'\n'}</h5></div>
      ) : (
        <div><h5>The game is a <b>draw</b> {'\n'}</h5></div>
      )}
      <Alert.Link onClick={resetGame}>Click here if you want to play again</Alert.Link>
    </Alert>
  );
}

export function ShowWhenGameEnds(props) {
  const { result, resetGame } = props;
  return (
    <div>
    { result !== 'draw' ? (
    <Jumbotron>
      <h1> Winner: {result} </h1>
      <PlayAgainButton resetGameFunction={resetGame} />
    </Jumbotron>
    ) : (
    <Jumbotron>
      <h1> Draw </h1>
      <PlayAgainButton resetGameFunction={resetGame} />
    </Jumbotron>
    )}
    </div>
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

export default GameEndedMessage;
