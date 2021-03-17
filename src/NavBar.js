import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';

export function NavBar(props) {
    const { toggleGame, toggleLeaderboard } = props;
    return (
        <Navbar bg='light' expand='lg'>
            <Navbar.Brand>Tic Tac Toe</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id='basic-navbar-nav'>
                <Nav className='mr-auto' onSelect={(selectedItem) => selectedItem === "game" ? toggleGame : toggleLeaderboard}>
                    <Nav.Link eventKey="game">Game</Nav.Link>
                    <Nav.Link eventKey="leaderboard">Leaderboard</Nav.Link>
                </Nav>
                <Search />
            </Navbar.Collapse>
        </Navbar>
    );
}

function Search(props) {
    return (
        <Form inline>
            <FormControl type="text" placeholder="Find Leaderboard Rating" className="mr-sm-2" />
            <Button variant="outline-success">Search</Button>
       </Form>
    );
}

export default NavBar;