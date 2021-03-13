import React from 'react';
import './MainStyle.css';

export function LeaderBoard(props) {
  const { toggleLeaderboard, showLeaderBoard, leaderBoard } = props;
  return (
    <div>
      <DisplayLeaderBoardButton toggleLeaderboard={toggleLeaderboard} />
      {showLeaderBoard && (
        <LeaderBoardTable leaderBoard={leaderBoard} />
      )}
    </div>
  );
}

function LeaderBoardTable(props) {
  const { leaderBoard } = props;
  return (
    <div>
      <table className="blueTable">
        <thead>
          <tr>
            {' '}
            <th>Player Name</th>
            {' '}
            <th>Score</th>
            {' '}
          </tr>
        </thead>
        <tfoot>Only the top 50 are displayed</tfoot>
        <tbody>
          {leaderBoard.map((entry) => (
            <LeaderBoardRow name={entry[0]} score={entry[1]} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LeaderBoardRow(props) {
  const { name, score } = props;
  return (
    <tr>
      <td>{name}</td>
      <td>{score}</td>
    </tr>
  );
}

function DisplayLeaderBoardButton(props) {
  const { toggleLeaderboard } = props;
  return (
    <div>
      <button type="button" className="myButton" id="lb" onClick={toggleLeaderboard}>
        Toggle Leaderboard
      </button>
    </div>
  );
}
