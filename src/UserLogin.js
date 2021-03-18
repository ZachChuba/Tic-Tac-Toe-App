import React, { useRef } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './MainStyle.css';


function Login(props) {
  const { socket, statusFunction } = props;
  
  function loginPressed(text) {
    // if user has entered a name join and display
    statusFunction(true);
    socket.emit('login', { id: socket.io.engine.id, name: text });
  }
  
  const cardStyle = {
    'width': '36rem',
    'margin-left': 'auto',
    'margin-right': 'auto'
  };
  
  return (
    <Card style={cardStyle} className='mt-5'>
      <Card.Body className='justify-content-center'>
        <Card.Title>Welcome to Tic Tac Toe</Card.Title>
        <LoginForm clickFunction={loginPressed}/>
      </Card.Body>
    </Card>
  );
  // <Card.Img variant='top' src='https://dummyimage.com/300x200/000/fff' />
}

function LoginForm(props) {
  const { clickFunction } = props;
  const inputRef = useRef(null);
  return (
    <Form>
      <Form.Group controlId='formBasicUsername'>
        <Form.Label>Username</Form.Label>
        <Form.Control type='text' placeholder='Enter A Username' ref={inputRef} />
      </Form.Group>
      <Button onClick={() => clickFunction(inputRef.current.value)} variant='primary' size='lg'>
        Join The Game
      </Button>
    </Form>
  );
}

export default Login;