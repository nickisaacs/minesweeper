import React, { Component } from "react";

class Cell extends Component {
  handleClick = () => {
    const { cell, checkCell } = this.props;
    checkCell(cell.row, cell.col);
  };

  render() {
    const { gameOver, cell } = this.props;
    const { isMine, neighbourMineCount, isVisited } = cell;
    const className = `cell ${isMine ? "is-mine" : ""}`;
    if (!isVisited && !gameOver) {
      return <span className={className} onClick={this.handleClick} />;
    }
    return (
      <span className={className}>{isMine ? "X" : neighbourMineCount}</span>
    );
  }
}

export default Cell;
