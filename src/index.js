
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Square will now be a function component since it only contains a render method and no state, only props
// class Square extends React.Component {
//   render() {
//     return (
//       // the onClick prop on the <button> tells React to set up a click event listner
//       <button 
//       className="square" 
//       onClick={() => this.props.onClick()}
//       >
//         {this.props.value}
//       </button>
//     );
//   }
// }

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  // Board component receive squares and onClick props from the Game component
  // constructor(props) {
  //   super(props);
  //   // Let's set the first move to X by default
  //   // Then each time a player moves, the boolean xIsNext will be flipped
  //   this.state = {
  //     squares: Array(9).fill(null),
  //     xIsNext: true,
  //   };
  // }

  // This is now handled by Game
  // handleClick(i) {
  //   // we call .slice() to create a copy of the squares Array to modify instead of modifying the existing array
  //   // --> this is immutability: data change without mutation
  //   const squares = this.state.squares.slice();

  //   // ignore a click if game was one or square already filled
  //   if (calculateWinner(squares) || squares[i]) {
  //     return;
  //   }

  //   // This is where we flip xIsNext at each move
  //   squares[i] = this.state.xIsNext ? 'X' : 'O';
  //   this.setState({
  //     squares: squares,
  //     xIsNext: !this.state.xIsNext,
  //   });
  // }

  renderSquare(i) {
    // wrap the returned element in parentheses so that JS doesn't insert a semicolon after "return"
    return ( 
      <Square 
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)}
      />
      // The onClick prop for sqaure is specified by the Board
    );
  }

  render() {
    // change "status" text so that it displays which player has the next turn
    // const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    // This is now handled by Game
    // const winner = calculateWinner(this.state.squares);
    // let status;
    // if (winner) {
    //   status = 'Winner: ' + winner
    // } else {
    //   status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    // }

    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      // add stepNumber to the Game component’s state to indicate which step we’re currently viewing
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    // we concatenate new history entries onto history
    // ensures that if we “go back in time” and then make a new move from that point, we throw away all the “future” history that would now become incorrect
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      // the concat() method doesn’t mutate the original array
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    // rendering the currently selected move according to stepNumber
    const current = history[this.state.stepNumber];
    // const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    // Map over history
    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start'
      return (
        // We can use 'move' as a unique key because moves  are never re-ordered, deleted, or inserted in the middle of the array of moves
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)} 
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
