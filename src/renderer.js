const Chess = require('chess.js').Chess;
let game = new Chess();

function renderBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';  // Xóa bàn cờ trước khi vẽ lại

    const squares = game.board();
    squares.forEach((row, rowIndex) => {
        row.forEach((square, colIndex) => {
            const squareElement = document.createElement('div');
            squareElement.classList.add('square');
            if ((rowIndex + colIndex) % 2 === 1) {
                squareElement.classList.add('dark');
            }

            // Thêm quân cờ vào mỗi ô vuông nếu có
            if (square) {
                squareElement.innerText = square.type.toUpperCase();  // Hiển thị quân cờ
            }

            boardElement.appendChild(squareElement);
        });
    });
}

renderBoard();
