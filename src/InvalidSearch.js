import React from 'react';
import Toast from 'react-bootstrap/Toast';
import ToastHeader from 'react-bootstrap/ToastHeader';
import ToastBody from 'react-bootstrap/ToastBody';

function PopUpBubble(props) {
  const { searchName, showBubble, setShowBubble } = props;
  
  return (
    <Toast className='float-right mr-1 mt-1' show={showBubble} onClose={() => setShowBubble(false)}>
      <Toast.Header>
        <strong className="mr-auto">Tic Tac Toe</strong>
      </Toast.Header>
      <Toast.Body>We couldn't find {searchName} on the Leaderboard</Toast.Body>
    </Toast>
  );
}

export default PopUpBubble;