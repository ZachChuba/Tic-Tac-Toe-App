import React from 'react';
import Table from 'react-bootstrap/Table';

function LeaderBoard(props) {
  const { leaderboard } = props;
  console.log(leaderboard);
  return (
    <div>
      <LeaderBoardTable leaderBoard={leaderboard} />
    </div>
  );
}

function LeaderBoardTable(props) {
  const { leaderBoard } = props;
  return (
    <div>
      <Table variant="light" className="mt-5" striped bordered hover>
        <thead>
          <tr>
            <th>Rank</th>
            {' '}
            <th>Player Name</th>
            {' '}
            <th>Score</th>
            {' '}
          </tr>
        </thead>
        <tbody>
          {leaderBoard.map((entry) => <LeaderBoardRow rank={entry[2]} name={entry[0]} score={entry[1]} />)}
        </tbody>
      </Table>
    </div>
  );
}

function LeaderBoardRow(props) {
  const { name, score, rank } = props;
  return (
    <tr>
      <td>{rank}</td>
      <td>{name}</td>
      <td>{score}</td>
    </tr>
  );
}

export default LeaderBoard;