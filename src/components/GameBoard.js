import React, { Component } from "react";
import { getNewBoard, getNeighbours, getRandomInt } from "../utils";
import Cell from "./Cell";
import set from "lodash/set";
import get from "lodash/get";

class GameBoard extends Component {
  state = {
    gameOver: false,
    steppedOnMine: false
  };

  componentDidMount() {
    this.startNewGame({ rows: 8, cols: 6 });
  }

  resetGame = () => {
    const { rows, cols } = this.state;
    this.startNewGame({ rows, cols });
  };

  randomizeGame = () => {
    const rows = getRandomInt(3, 15);
    const cols = getRandomInt(rows, 15);
    this.startNewGame({ rows, cols });
  };

  startNewGame = ({ rows, cols }) => {
    const mines = parseInt((10 * rows * cols) / 100, 10);
    const board = getNewBoard({ rows, cols, mines });
    this.setState({
      board,
      message: `There are ${mines} mines! Good luck!`,
      cellsRemaining: rows * cols,
      gameOver: false,
      mines,
      rows,
      cols
    });
  };

  handleClick = (row, col) => {
    const { gameOver, board, cellsRemaining } = this.state;
    if (gameOver) {
      return;
    }
    const { isMine, neighbourMineCount } = get(board, [row, col]);
    let newBoard = set(board, [row, col, "isVisited"], true);
    if (isMine) {
      this.setState({
        gameOver: true,
        steppedOnMine: true,
        message: "Oh no! You lose!"
      });
    } else if (neighbourMineCount === 0) {
      this.clearEmptyCells(row, col);
    }

    this.setState(
      { board: newBoard, cellsRemaining: cellsRemaining - 1 },
      () => {
        if (this.state.cellsRemaining === this.state.mines && !isMine) {
          this.setState({ gameOver: true, message: "You Won!" });
        }
      }
    );
  };

  clearEmptyCells = (row, col) => {
    const { board } = this.state;
    const neighbours = getNeighbours(row, col, board);
    neighbours.forEach(neighbour => {
      if (neighbour) {
        const { isVisited, neighbourMineCount } = neighbour;
        if (!isVisited && neighbourMineCount === 0) {
          const newBoard = set(
            board,
            [neighbour.row, neighbour.col, "isVisited"],
            true
          );
          this.setState(
            {
              board: newBoard
            },
            () =>
              this.setState(state => ({
                cellsRemaining: state.cellsRemaining - 1
              }))
          );
          if (neighbour.neighbourMineCount === 0) {
            this.clearEmptyCells(neighbour.row, neighbour.col, board);
          }
        }
      }
    });
  };

  renderBoard(board) {
    return (
      <div>
        {board.map((row, idx) => {
          return (
            <div key={idx}>
              {row.map((cell, idx) => (
                <Cell
                  key={idx}
                  cell={cell}
                  gameOver={this.state.gameOver}
                  checkCell={this.handleClick}
                />
              ))}
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    const { board, message, cellsRemaining, mines, steppedOnMine } = this.state;
    const displayMessage =
      cellsRemaining === mines && !steppedOnMine ? "You won!" : message;
    return (
      <div className="game-container">
        <div className="message">{displayMessage}</div>
        <div>{board && this.renderBoard(board)}</div>
        <div className="button-group">
          <button className="button" onClick={this.resetGame}>
            Reset Game
          </button>
          <button className="button" onClick={this.randomizeGame}>
            Random game
          </button>
        </div>
      </div>
    );
  }
}

export default GameBoard;
