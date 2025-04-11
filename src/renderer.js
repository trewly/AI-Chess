const Chess = require('chess.js').Chess;
let game = new Chess();
let selectedSquare = null; // Biến lưu trữ ô vuông đang chọn
const worker = new Worker("engine-worker.js", { type: "module" });

function renderBoard() {
    //cap nhat gameturn
    showTurnPopup() 

    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';  // Xóa bàn cờ trước khi vẽ lại
    
    const squares = game.board();  // Lấy bàn cờ từ chess.js
    squares.forEach((row, rowIndex) => {
        row.forEach((square, colIndex) => {
            const squareElement = document.createElement('div');
            squareElement.classList.add('square');
            
            // Thêm thuộc tính data-square - đây là phần quan trọng bị thiếu
            const squareId = `${String.fromCharCode(97 + colIndex)}${8 - rowIndex}`;
            squareElement.setAttribute('data-square', squareId);
            
            if ((rowIndex + colIndex) % 2 === 1) {
                squareElement.classList.add('dark');
            } else {
                squareElement.classList.add('light');
            }
            
            // Thêm quân cờ vào mỗi ô vuông nếu có
            if (square) {
                const pieceImage = document.createElement('img');
                pieceImage.src = `pieces-png/${square.color}-${square.type}.png`;
                pieceImage.alt = `${square.color}-${square.type}`;
                pieceImage.classList.add('piece');
                
                squareElement.appendChild(pieceImage);
            }
            
            // Lắng nghe sự kiện click vào ô vuông
            squareElement.addEventListener('click', () => handleSquareClick(squareId, square));
            
            boardElement.appendChild(squareElement);
        });
    });
    
    // Nếu có ô được chọn, highlight nó và các nước đi hợp lệ
    if (selectedSquare) {
        highlightMoves(selectedSquare);
    }
}

function showTurnPopup() {
    const popup = document.getElementById('turn-popup');
    const turnText = document.getElementById('turn-text');
    
    // Xác định lượt đi
    const currentTurn = game.turn();
    
    // Cập nhật nội dung và kiểu
    if (currentTurn === 'w') {
      turnText.textContent = 'Lượt: Trắng đi';
      popup.className = 'popup white-turn';
    } else {
      turnText.textContent = 'Lượt: Đen đi';
      popup.className = 'popup black-turn';
    }
    
    // Hiển thị popup
    popup.style.display = 'block';
    
    // Tự động ẩn sau 1.5 giây
    setTimeout(() => {
      popup.style.display = 'none';
    }, 1500);
  }

// Hàm xử lý sự kiện click
function handleSquareClick(squareId, square) {
    // Xóa highlight cũ
    document.querySelectorAll('.highlight').forEach(el => el.classList.remove('highlight'));
    document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
    
    // Nếu đã chọn quân cờ trước đó, thực hiện di chuyển
    if (selectedSquare) {
        const move = game.move({
            from: selectedSquare,
            to: squareId,
            promotion: 'q'  // Mặc định phong cấp thành hậu
        });
        
        if (move) {
            console.log('Move successful:', move.san);  // In ra nước đi đã thực hiện
            selectedSquare = null;
            renderBoard();  // Vẽ lại bàn cờ sau khi di chuyển

            //chieu tuong
            if (game.in_check()) {
                // hoặc hiện thông báo lên popup:
                document.getElementById("turn-text").innerText = "⚠️ Chiếu tướng!";
            }

            if (!game.game_over() && game.turn() === 'b') {
                console.log("Máy đang suy nghĩ...");
                try {
                    console.log("Sending FEN to worker:", game.fen());
                    worker.postMessage([game.fen(), 2]);
                } catch (error) {
                    console.error("Error sending to worker:", error);
                }
                worker.onmessage = function(event) {
                    const bestMove = event.data;
                    console.log("Received move from engine:", bestMove);
                    
                    try {
                        // Try to apply the move
                        const moveResult = game.move(bestMove);
                        console.log("Move applied:", moveResult);
                        renderBoard();  // Vẽ lại bàn cờ sau khi máy đi
                    } catch (error) {
                        console.error("Error applying engine move:", error, bestMove);
                    }
                }
            }

        } else {
            // Nếu nước đi không hợp lệ, kiểm tra xem có thể chọn quân mới không
            if (square && square.color === game.turn()) {
                selectedSquare = squareId;
                highlightSelectedSquare();
                highlightMoves(selectedSquare);
            } else {
                selectedSquare = null;
            }
        }
    } else {
        // Nếu chưa chọn quân cờ nào, chọn quân cờ từ ô clicked
        if (square && square.color === game.turn()) {
            selectedSquare = squareId;
            highlightSelectedSquare();
            highlightMoves(selectedSquare);
        }
    }
}

// Highlight ô vuông đã chọn
function highlightSelectedSquare() {
    const selectedElement = document.querySelector(`[data-square="${selectedSquare}"]`);
    if (selectedElement) {
        selectedElement.classList.add('selected');
    }
}

// Hàm highlight các nước đi hợp lệ
function highlightMoves(squareId) {
    // Lấy các nước đi hợp lệ từ ô đã chọn
    const moves = game.moves({ square: squareId, verbose: true });
    
    if (Array.isArray(moves) && moves.length > 0) {
        moves.forEach(move => {
            const targetSquare = document.querySelector(`[data-square="${move.to}"]`);
            if (targetSquare) {
                targetSquare.classList.add('highlight');
            }
        });
    } else {
        console.log("No legal moves found");
    }
}

// Khởi tạo bàn cờ
renderBoard();