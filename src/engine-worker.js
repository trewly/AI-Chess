import findBestMove from "../findBestMove.js"; 

console.log("✅ engine-worker.js loaded");

self.addEventListener("message", ({ data: [fen, depth] }) => {
  try {
    console.log("Worker received FEN:", fen);
    const bestMove = findBestMove(fen, depth);
    console.log("Worker calculated best move:", bestMove);
    self.postMessage(bestMove);
  } catch (error) {
    console.error("Worker error calculating move:", error);
    self.postMessage(null); // Send null to indicate an error
  }
});
