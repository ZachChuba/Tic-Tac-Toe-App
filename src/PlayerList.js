import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';

function UserListContainer(props) {
  const { userList } = props;
  return (
    <Accordion defaultActiveKey='0'>
      <PlayerListContainer activePlayers={userList.slice(0,2)} />
      <SpectatorListContainer spectatorList={userList.slice(2)} />
    </Accordion>
  );
}

function SpectatorListContainer(props) {
  const { spectatorList } = props;
  return (
    <Card className="mt-0">
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="1">
              Spectators (Click to view)
            </Accordion.Toggle>
          </Card.Header>
            <Accordion.Collapse eventKey="1">
              <Card.Body><SpectatorList spectatorList={spectatorList} /></Card.Body>
            </Accordion.Collapse>
      </Card>
  );
}

function PlayerListContainer(props) {
  const { activePlayers } = props;
  return (
      <Card className="mt-5">
        <Card.Header>
          <Accordion.Toggle as={Button} variant="link" eventKey="0">
            Active Players
          </Accordion.Toggle>
        </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body><PlayerList activePlayers={activePlayers} /></Card.Body>
          </Accordion.Collapse>
      </Card>
  );
}

function PlayerList(props) {
  const { activePlayers } = props;
  return (
    <ListGroup>
      {activePlayers.map((player, idx) => <PlayerListItem player={player[1]} idx={idx} />)}
    </ListGroup>
  );
}

function PlayerListItem(props) {
  const { player, idx } = props;
  return (
    <ListGroup.Item>
      <h5>
        {player} <Badge variant='secondary'>Playing As {idx === 0 ? 'X' : 'O'}</Badge>
      </h5>
    </ListGroup.Item>
  );
}

function SpectatorList(props) {
  const { spectatorList } = props;
  return (
    <ListGroup>
      {spectatorList.map((user) => <SpectatorListItem user={user[1]} />)}
    </ListGroup>
  );
}

function SpectatorListItem(props) {
  const { user } = props;
  return (
    <ListGroup.Item>
      <h5>
        {user}
      </h5>
    </ListGroup.Item>
  );
}

export default UserListContainer;