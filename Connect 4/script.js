function addPieces(x) {
  numMoves++;
  let column = gameBoard[x];
  for (let i = 5; i >= 0; i--) {
    if (column[i].value == null) {
      column[i].value = "red";
      document.getElementById(column[i].position).style.backgroundColor = "#fc1c03";
      document.getElementById("red").innerHTML = "RED: " + column[i].position;
      if (checkForWinner(gameBoard) == "red") {
        console.log("RED WINS");
        endGame("RED");
      } else {
        if (numMoves == 42) {
          console.log("DRAWS");
          endGame("DRAW");
        }
        console.log("Thinking...");
        disableClick("none");
        setTimeout(function() { determineNextMove();; }, 250);
        disableClick("initial");
      }
      break;
    }
  }
  document.getElementById("level").style.display = "none";
}

function determineNextMove() {
  numMoves++;
  let col = findBestMove(gameBoard);
  let column = gameBoard[col];
  for (let i = 5; i >= 0; i--) {
    if (column[i].value == null) {
      column[i].value = "yellow";
      document.getElementById(column[i].position).style.backgroundColor = "#fff200";
      document.getElementById("yellow").innerHTML = "YELLOW: " + column[i].position;
      if (checkForWinner(gameBoard) == "yellow") {
        console.log("YELLOW WINS");
        endGame("YELLOW");
      } else {
        if (numMoves == 42) {
          console.log("DRAW");
          endGame("DRAW");
        }
      }
      break;
    }
  }
}

function startGame() {
  for (let i = 0; i < 7; i++) {
    let column = gameBoard[i];
    for (let k = 0; k < 6; k++) {
      column[k].value = null;
      document.getElementById(column[k].position).style.backgroundColor = "antiquewhite";
    }
  }
  document.getElementById("result").style.display = "none";
  document.getElementById("notice").innerHTML = "";
  let a = document.getElementsByTagName("td");
  disableClick("initial");
  document.getElementById("level").style.display = "initial";
  document.getElementById("level").style.marginLeft = "50px";
  document.getElementById("lastPlayed").style.display = "initial";
  document.getElementById("red").innerHTML = "";
  document.getElementById("yellow").innerHTML = "";
}

function endGame(player) {
  if (player == "DRAW") {
    document.getElementById("result").innerHTML = player;
  } else {
    document.getElementById("result").innerHTML = player + " WINS!";
  }
  document.getElementById("result").style.display = "initial";
  if (checkForWinner(gameBoard) != null || numMoves == 42) {
    document.getElementById("notice").innerHTML = "Press 'Reset' to play again";
  }
  disableClick("none");
  numMoves = 0;
  document.getElementById("level").style.display = "initial";
  document.getElementById("lastPlayed").style.display = "none";
}

function checkForWinner(gameBoard) {
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 7; j++) {
      let cell = gameBoard[j][i];
      if (cell.value === null) {
        continue;
      }
      if (j < 4) {
        if (gameBoard[j + 1][i].value === cell.value && gameBoard[j + 2][i].value === cell.value && gameBoard[j + 3][i].value === cell.value) {
          return cell.value;
        }
      }
      if (i < 3) {
        if (gameBoard[j][i + 1].value === cell.value && gameBoard[j][i + 2].value === cell.value && gameBoard[j][i + 3].value === cell.value) {
          return cell.value;
        }
        if (j < 4) {
          if (gameBoard[j + 1][i + 1].value === cell.value && gameBoard[j + 2][i + 2].value === cell.value && gameBoard[j + 3][i + 3].value === cell.value) {
            return cell.value;
          }
        }
        if (j > 2) {
          if (gameBoard[j - 1][i + 1].value === cell.value && gameBoard[j - 2][i + 2].value === cell.value && gameBoard[j - 3][i + 3].value === cell.value) {
            return cell.value;
          }
        }
      }
    }
  }
  return null;
}

function isColumnFull(board, col) {
  return board[col][0].value !== null;
}

function makeMove(board, col, turn) {
  let newBoard = copyBoard(board);
  for (let row = 5; row >= 0; row--) {
    if (newBoard[col][row].value === null) {
      newBoard[col][row].value = turn;
      break;
    }
  }
  return newBoard;
}

function scoreNode(gameBoard) {
  let score = 0;
  if (checkForWinner(gameBoard) == "red") {
    score -= 1000000;
  }
  if (checkForWinner(gameBoard) == "yellow") {
    score += 1000000;
  }
  if (nextMoveWin("red", gameBoard) == "red") {
    score -= 10000001;
  }
  if (nextMoveWin("yellow", gameBoard) == "yellow") {
    score += 10000000;
  }
  return score;
}

function nextMoveWin(turn, Board) {
  let copy = copyBoard(Board);
  let column;
  for (let col = 0; col < 7; col++) {
    column = copy[col];
    for (let row = 0; row < 6; row++) {
      if (row != 5) {
        if (column[row].value == null && column[row + 1].value != null) {
          column[row].value = turn;
          let returnValue = checkForWinner(copy);
          column[row].value = null;
          if (returnValue == turn) {
            return returnValue;
          }
        }
      } else {
        if (column[row].value == null) {
          column[row].value = turn;
          let returnValue = checkForWinner(copy);
          column[row].value = null;
          if (returnValue == turn) {
            return returnValue
          }
        }
      }
    }
  }
  return null;
}

function copyBoard(board) {
  return board.map(row => row.map(cell => ({ ...cell })));
}

function minimax(node, depth, alpha, beta, maximizingPlayer) {
  if (depth === 0 || checkForWinner(node)) {
    return scoreNode(node);
  }
  if (maximizingPlayer) {
    let maxEval = -Infinity;
    for (let col = 0; col < 7; col++) {
      if (!isColumnFull(node, col)) {
        let child = makeMove(node, col, "yellow");
        let eval = minimax(child, depth - 1, alpha, beta, false);
        maxEval = Math.max(maxEval, eval);
        alpha = Math.max(alpha, eval);
        if (beta <= alpha) {
          break;
        }
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let col = 0; col < 7; col++) {
      if (!isColumnFull(node, col)) {
        let child = makeMove(node, col, "red");
        let eval = minimax(child, depth - 1, alpha, beta, true);
        minEval = Math.min(minEval, eval);
        beta = Math.min(beta, eval);
        if (beta <= alpha) {
          break;
        }
      }
    }
    return minEval;
  }
}

function findBestMove(board) {
  let bestEval = -Infinity;
  let bestCol = null;
  for (let col = 0; col < 7; col++) {
    if (!isColumnFull(board, col)) {
      let child = makeMove(board, col, "yellow");
      let eval = minimax(child, document.getElementById("difficulty").value, -Infinity, Infinity, false);
      if (eval > bestEval) {
        bestEval = eval;
        bestCol = col;
      }
    }
  }
  return bestCol;
}

function disableClick(state) {
  let a = document.getElementsByTagName("td");
  for (let i = 0; i < a.length; i++) {
    a[i].style.pointerEvents = state;
  }
}

class Cell {
  constructor(position) {
    this.position = position;
    this.value = null;
  }
}

var cell1 = new Cell("1");
var cell2 = new Cell("2");
var cell3 = new Cell("3");
var cell4 = new Cell("4");
var cell5 = new Cell("5");
var cell6 = new Cell("6");
var cell7 = new Cell("7");
var cell8 = new Cell("1a");
var cell9 = new Cell("2a");
var cell10 = new Cell("3a");
var cell11 = new Cell("4a");
var cell12 = new Cell("5a");
var cell13 = new Cell("6a");
var cell14 = new Cell("7a");
var cell15 = new Cell("1b");
var cell16 = new Cell("2b");
var cell17 = new Cell("3b");
var cell18 = new Cell("4b");
var cell19 = new Cell("5b");
var cell20 = new Cell("6b");
var cell21 = new Cell("7b");
var cell22 = new Cell("1c");
var cell23 = new Cell("2c");
var cell24 = new Cell("3c");
var cell25 = new Cell("4c");
var cell26 = new Cell("5c");
var cell27 = new Cell("6c");
var cell28 = new Cell("7c");
var cell29 = new Cell("1d");
var cell30 = new Cell("2d");
var cell31 = new Cell("3d");
var cell32 = new Cell("4d");
var cell33 = new Cell("5d");
var cell34 = new Cell("6d");
var cell35 = new Cell("7d");
var cell36 = new Cell("1e");
var cell37 = new Cell("2e");
var cell38 = new Cell("3e");
var cell39 = new Cell("4e");
var cell40 = new Cell("5e");
var cell41 = new Cell("6e");
var cell42 = new Cell("7e");

var gameBoard = [[cell1, cell8, cell15, cell22, cell29, cell36], [cell2, cell9, cell16, cell23, cell30, cell37], [cell3, cell10, cell17, cell24, cell31, cell38], [cell4, cell11, cell18, cell25, cell32, cell39], [cell5, cell12, cell19, cell26, cell33, cell40], [cell6, cell13, cell20, cell27, cell34, cell41], [cell7, cell14, cell21, cell28, cell35, cell42]];

var numMoves = 1;