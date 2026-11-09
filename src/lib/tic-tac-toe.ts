export type Mark = 'X' | 'O';
export type Board = Array<Mark | null>;

export const WINNING_LINES: number[][] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

export function getWinner(board: Board): { mark: Mark; line: number[] } | null {
  for (const line of WINNING_LINES) {
    const [first, second, third] = line;
    if (board[first] && board[first] === board[second] && board[first] === board[third]) {
      return { mark: board[first] as Mark, line };
    }
  }
  return null;
}

function scorePosition(board: Board, depth: number, turn: Mark): number {
  const winner = getWinner(board);
  if (winner?.mark === 'O') return 10 - depth;
  if (winner?.mark === 'X') return depth - 10;
  if (board.every(Boolean)) return 0;

  const maximizing = turn === 'O';
  let best = maximizing ? -Infinity : Infinity;
  for (let index = 0; index < board.length; index += 1) {
    if (board[index]) continue;
    board[index] = maximizing ? 'O' : 'X';
    const score = scorePosition(board, depth + 1, maximizing ? 'X' : 'O');
    board[index] = null;
    best = maximizing ? Math.max(best, score) : Math.min(best, score);
  }
  return best;
}

/** Returns the optimal open square for Blue Valor (O), or null on a finished board. */
export function getBestMove(board: Board): number | null {
  if (getWinner(board) || board.every(Boolean)) return null;
  let bestScore = -Infinity;
  let bestMove: number | null = null;
  for (let index = 0; index < board.length; index += 1) {
    if (board[index]) continue;
    board[index] = 'O';
    const score = scorePosition(board, 0, 'X');
    board[index] = null;
    if (score > bestScore) {
      bestScore = score;
      bestMove = index;
    }
  }
  return bestMove;
}

export function isBeatableGame(gameNumber: number, random = Math.random): boolean {
  return gameNumber === 3 || (gameNumber > 3 && random() < 0.2);
}

function immediateWin(board: Board, mark: Mark): number | null {
  for (let index = 0; index < board.length; index += 1) {
    if (board[index]) continue;
    board[index] = mark;
    const wins = getWinner(board)?.mark === mark;
    board[index] = null;
    if (wins) return index;
  }
  return null;
}

export type BlueMove = { move: number | null; usedWeakMove: boolean };

/** One strategic concession is allowed, but never a missed immediate win or block. */
export function chooseBlueTurn(board: Board, allowWeakMove = false): BlueMove {
  if (getWinner(board) || board.every(Boolean)) return { move: null, usedWeakMove: false };
  const forced = immediateWin(board, 'O') ?? immediateWin(board, 'X');
  if (forced !== null) return { move: forced, usedWeakMove: false };
  if (allowWeakMove) {
    const open = board.flatMap((mark, index) => mark === null ? [index] : []);
    if (open.length > 1) {
      for (const move of open) {
        board[move] = 'O';
        const score = scorePosition(board, 0, 'X');
        board[move] = null;
        if (score < 0) return { move, usedWeakMove: true };
      }
    }
  }
  return { move: getBestMove(board), usedWeakMove: false };
}
