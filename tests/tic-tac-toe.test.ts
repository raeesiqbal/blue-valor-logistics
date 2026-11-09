import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chooseBlueTurn, getWinner, isBeatableGame, type Board } from '../src/lib/tic-tac-toe';

function outcomes(board: Board, allowWeak: boolean, visitorMoves: number[] = []): Array<{ winner: string; moves: number[] }> {
  const winner = getWinner(board);
  if (winner || board.every(Boolean)) return [{ winner: winner?.mark ?? 'draw', moves: visitorMoves }];
  const results: Array<{ winner: string; moves: number[] }> = [];
  for (let index = 0; index < 9; index++) {
    if (board[index]) continue;
    const next = [...board];
    next[index] = 'X';
    const moves = [...visitorMoves, index];
    if (getWinner(next) || next.every(Boolean)) {
      results.push({ winner: getWinner(next)?.mark ?? 'draw', moves });
      continue;
    }
    const { move, usedWeakMove } = chooseBlueTurn(next, allowWeak);
    assert.notEqual(move, null);
    next[move!] = 'O';
    results.push(...outcomes(next, allowWeak && !usedWeakMove, moves));
  }
  return results;
}

test('games 1 and 2 are unbeatable across every possible visitor sequence', () => {
  for (const game of [1, 2]) {
    assert.equal(isBeatableGame(game), false);
    const results = outcomes(Array(9).fill(null), false);
    assert.ok(results.length > 100);
    assert.ok(results.every(result => result.winner !== 'X'));
    assert.ok(results.some(result => result.winner === 'draw'));
  }
});

test('game 3 offers a strategic winning route, not an automatic visitor win', () => {
  assert.equal(isBeatableGame(3), true);
  const results = outcomes(Array(9).fill(null), true);
  const win = results.find(result => result.winner === 'X');
  assert.ok(win);
  assert.ok(results.some(result => result.winner === 'O'));
  console.log('Game 3 winning visitor squares (1-based):', win.moves.map(move => move + 1));
});

test('later games choose beatability once with a 20 percent threshold', () => {
  for (let game = 4; game <= 20; game++) {
    assert.equal(isBeatableGame(game, () => .1999), true);
    assert.equal(isBeatableGame(game, () => .2), false);
    assert.equal(isBeatableGame(game, () => .99), false);
  }
});

test('every legal computer position takes a win or blocks an immediate threat, even in beatable games', () => {
  const visited = new Set<string>();
  function winningMoves(board: Board, mark: 'X' | 'O') {
    return board.flatMap((value, index) => {
      if (value) return [];
      const next = [...board];
      next[index] = mark;
      return getWinner(next)?.mark === mark ? [index] : [];
    });
  }
  function visit(board: Board, turn: 'X' | 'O') {
    if (getWinner(board) || board.every(Boolean)) return;
    const key = board.map(value => value ?? '-').join('');
    if (visited.has(key)) return;
    visited.add(key);
    if (turn === 'O') {
      const wins = winningMoves(board, 'O');
      const threats = winningMoves(board, 'X');
      for (const allowWeak of [false, true]) {
        const copy = [...board];
        const { move, usedWeakMove } = chooseBlueTurn(board, allowWeak);
        assert.deepEqual(board, copy, 'evaluation must not mutate the board');
        if (wins.length) assert.ok(wins.includes(move!));
        else if (threats.length) assert.ok(threats.includes(move!));
        if (wins.length || threats.length) assert.equal(usedWeakMove, false);
      }
    }
    for (let index = 0; index < 9; index++) {
      if (board[index]) continue;
      const next = [...board];
      next[index] = turn;
      visit(next, turn === 'X' ? 'O' : 'X');
    }
  }
  visit(Array(9).fill(null), 'X');
  assert.ok(visited.size > 4000);
});
