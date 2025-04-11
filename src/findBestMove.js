// findBestMove.js
const { Chess } = require("chess.js");

console.log("findBestMove.js loaded");

function findBestMove(fen, depth) {
  const game = new Chess(fen);

  function minimax(depth, maximizing) {
    if (depth === 0 || game.game_over()) return evaluateBoard();

    const moves = game.moves();
    if (maximizing) {
      let best = -Infinity;
      for (const move of moves) {
        game.move(move);
        best = Math.max(best, minimax(depth - 1, false));
        game.undo();
      }
      return best;
    } else {
      let best = Infinity;
      for (const move of moves) {
        game.move(move);
        best = Math.min(best, minimax(depth - 1, true));
        game.undo();
      }
      return best;
    }
  }

  function evaluateBoard() {
    // Tạm thời đơn giản: random thôi
    return Math.random();
  }

  let bestMove = null;
  let bestScore = -Infinity;

  for (const move of game.moves()) {
    game.move(move);
    const score = minimax(depth - 1, false);
    game.undo();

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

module.exports = findBestMove;