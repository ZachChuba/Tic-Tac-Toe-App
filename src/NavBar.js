import React, { useRef } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';

function NavBar(props) {
    const { toggleGame, toggleLeaderboard, requestEntry } = props;
    return (
        <Navbar bg='light' expand='lg'>
            <Navbar.Brand>Tic Tac Toe</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id='basic-navbar-nav'>
                <Nav className='mr-auto' onSelect={(selectedItem) => selectedItem === "game" ? toggleGame() : toggleLeaderboard()}>
                    <Nav.Link eventKey="game">Game</Nav.Link>
                    <Nav.Link eventKey="leaderboard">Leaderboard</Nav.Link>
                </Nav>
                <SearchElement requestEntry={requestEntry} />
            </Navbar.Collapse>
        </Navbar>
    );
}

function SearchElement(props) {
    const { requestEntry } = props;
    const formText = useRef(null);
    return (
        <Form inline>
            <FormControl type="text" placeholder="Find Leaderboard Rating" className="mr-sm-2" ref={formText} />
            <Button onClick={() => requestEntry(formText.current.value)} variant="outline-success">Search</Button>
       </Form>
    );
}

export default NavBar;