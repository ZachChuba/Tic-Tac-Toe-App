import React from 'react';
import './MainStyle.css';

export function UserListContainer(props) {
  const { userList } = props;
  return (
    <div className="list-wrapper">
      <h1 className="list-h1"> Users Online </h1>
      <PlayersList activePlayers={userList.slice(0, 2)} />
      <SpectatorList activeSpectators={userList.slice(2)} />
    </div>
  );
}

function PlayersList(props) {
  const { activePlayers } = props;
  return (
    <div>
      <ul className="list">
        {activePlayers.map((item, index) => (
          <ListItem
            type="player"
            position={index === 0 ? 'X' : 'O'}
            name={item[1]}
          />
        ))}
      </ul>
    </div>
  );
}

function SpectatorList(props) {
  const { activeSpectators } = props;
  return (
    <div>
      {activeSpectators.length > 0 ? (
        <ul className="list">
          {activeSpectators.map((item) => (
            <ListItem type="spectator" name={item[1]} position="none" />
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function ListItem(props) {
  const { type, name, position } = props;
  return (
    <li className="list-item">
      <div>
        {type === 'player' ? (
          <img
            src="https://www.flaticon.com/svg/vstatic/svg/20/20079.svg?token=exp=1614381901~hmac=eb29392a8dbeaf04952b8f0f5ee888e5"
            alt="Player_Image"
            className="list-item-image"
          />
        ) : null}
      </div>
      <div>
        <h4 className="list-h4">
          {' '}
          {name}
          {' '}
        </h4>
        <p className="list-p">
          {' '}
          {type === 'player' ? `Playing As ${position}` : 'Watching'}
        </p>
      </div>
    </li>
  );
}
