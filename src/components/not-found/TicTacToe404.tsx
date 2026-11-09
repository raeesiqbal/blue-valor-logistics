import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { useI18n } from '../../lib/i18n';
import { chooseBlueTurn, isBeatableGame, getWinner, type Board, type Mark } from '../../lib/tic-tac-toe';
import { resultHoldMs, RESULT_FADE_MS, type GameResult } from '../../lib/game-result-timing';
import Truck from './Truck';
import WinCelebration from './WinCelebration';
import LossStamp from './LossStamp';
import './tic-tac-toe-404.css';

type Result = GameResult;
type Score = { blue: number; visitor: number };
type IntroPhase = 'drive' | 'grid' | 'ready';

const BLANK_BOARD: Board = Array(9).fill(null);

const words = {
  en: {
    headlineOne: 'THIS PAGE GOT LOST IN TRANSIT.',
    headlineTwo: 'PLAY A ROUND WHILE WE TRACK IT DOWN.',
    yourTurn: 'YOUR TURN · PLACE AN X',
    blueTurn: 'BLUE VALOR IS PICKING A SQUARE',
    intro: 'A Blue Valor truck is tracing the route to your page.',
    visitorWin: 'YOU WON! SHIP WITH US AND YOU ALWAYS WILL.',
    blueWin: 'BLUE VALOR WINS. WE ALWAYS DELIVER.',
    draw: 'DRAW. CLOSE ONE.',
    playAgain: 'PLAY AGAIN',
    home: 'TAKE ME HOME',
    score: (blue: number, visitor: number) => `BLUE VALOR ${blue} · YOU ${visitor}`,
    square: (position: number, value: Mark | null) => `Square ${position}${value ? `, ${value === 'X' ? 'your X' : 'Blue Valor truck'}` : ', empty'}`,
    board: 'Tic-tac-toe. You play X; Blue Valor plays a truck.',
    fourOhFour: '404',
  },
  es: {
    headlineOne: 'ESTA PÁGINA SE PERDIÓ EN EL CAMINO.',
    headlineTwo: 'JUEGA UNA RONDA MIENTRAS LA ENCONTRAMOS.',
    yourTurn: 'TU TURNO · COLOCA UNA X',
    blueTurn: 'BLUE VALOR ESTÁ ELIGIENDO',
    intro: 'Un camión de Blue Valor está trazando la ruta a tu página.',
    visitorWin: '¡GANASTE! ENVÍA CON NOSOTROS Y SIEMPRE GANARÁS.',
    blueWin: 'GANA BLUE VALOR. SIEMPRE CUMPLIMOS.',
    draw: 'EMPATE. POR POCO.',
    playAgain: 'JUGAR DE NUEVO',
    home: 'IR AL INICIO',
    score: (blue: number, visitor: number) => `BLUE VALOR ${blue} · TÚ ${visitor}`,
    square: (position: number, value: Mark | null) => `Casilla ${position}${value ? value === 'X' ? ', tu X' : ', camión de Blue Valor' : ', vacía'}`,
    board: 'Tres en raya. Tú juegas con X; Blue Valor juega con un camión.',
    fourOhFour: '404',
  },
};

export default function TicTacToe404({ variant = '404' }: { variant?: '404' | 'play' }) {
  const { language } = useI18n();
  const copy = words[language];
  const isPlay = variant === 'play';
  const [score, setScore] = useState<Score>({ blue: 0, visitor: 0 });
  const [celebrating, setCelebrating] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const [board, setBoard] = useState<Board>(() => [...BLANK_BOARD]);
  const [result, setResult] = useState<Result | null>(null);
  const [intro, setIntro] = useState<IntroPhase>(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'ready' : 'drive',
  );
  const [gameId, setGameId] = useState(0);
  const [turn, setTurn] = useState<Mark>('X');
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const scoredGame = useRef<number | null>(null);
  const activeGame = useRef(gameId);
  const gamesPlayed = useRef(0);
  const beatable = useRef(false);
  const weakMoveUsed = useRef(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => setReducedMotion(media.matches);
    media.addEventListener('change', syncMotion);
    return () => media.removeEventListener('change', syncMotion);
  }, []);

  useEffect(() => {
    activeGame.current = gameId;
  }, [gameId]);

  useEffect(() => {
    const timers: number[] = [];
    if (intro === 'drive') {
      timers.push(window.setTimeout(() => setIntro('grid'), 1900));
    } else if (intro === 'grid') {
      timers.push(window.setTimeout(() => setIntro('ready'), 850));
    }
    return () => timers.forEach(window.clearTimeout);
  }, [intro]);

  const finishGame = (nextBoard: Board, currentGame: number) => {
    const winner = getWinner(nextBoard);
    const nextResult: Result | null = winner ? (winner.mark === 'X' ? 'visitor' : 'blue') :
      nextBoard.every(Boolean) ? 'draw' : null;
    if (!nextResult || activeGame.current !== currentGame) return false;
    setResult(nextResult);
    if (winner) setWinningLine(winner.line);
    if (scoredGame.current !== currentGame) {
      scoredGame.current = currentGame;
      gamesPlayed.current += 1;
      if (nextResult === 'visitor') setCelebrating(true);
      if (winner) {
        setScore(previous => {
          const scoreKey = nextResult === 'visitor' ? 'visitor' : 'blue';
          return { ...previous, [scoreKey]: previous[scoreKey] + 1 };
        });
      }
    }
    return true;
  };

  const playSquare = (index: number) => {
    if (intro !== 'ready' || result || celebrating || turn !== 'X' || board[index]) return;
    const nextBoard = [...board];
    nextBoard[index] = 'X';
    setBoard(nextBoard);
    if (!finishGame(nextBoard, gameId)) setTurn('O');
  };

  useEffect(() => {
    if (intro !== 'ready' || result || turn !== 'O') return;
    const scheduledGame = gameId;
    const timer = window.setTimeout(() => {
      if (activeGame.current !== scheduledGame) return;
      const nextBoard = [...board];
      const { move, usedWeakMove } = chooseBlueTurn(nextBoard, beatable.current && !weakMoveUsed.current);
      if (usedWeakMove) weakMoveUsed.current = true;
      if (move === null) return;
      nextBoard[move] = 'O';
      setBoard(nextBoard);
      if (!finishGame(nextBoard, scheduledGame)) setTurn('X');
    }, 500);
    return () => window.clearTimeout(timer);
  }, [board, gameId, intro, result, turn]);

  const replay = useCallback(() => {
    const nextGame = activeGame.current + 1;
    activeGame.current = nextGame;
    // Replaying an unfinished board does not count as completing a game.
    beatable.current = isBeatableGame(gamesPlayed.current + 1);
    weakMoveUsed.current = false;
    setGameId(nextGame);
    setCelebrating(false);
    setClearing(false);
    setBoard([...BLANK_BOARD]);
    setResult(null);
    setWinningLine(null);
    setTurn('X');
    setIntro('ready');
    scoredGame.current = null;
  }, []);

  useEffect(() => {
    if (!result) return;
    const scheduledGame = gameId;
    const hold = resultHoldMs(result, reducedMotion);
    const fadeTimer = window.setTimeout(() => {
      if (activeGame.current === scheduledGame) setClearing(true);
    }, hold);
    const resetTimer = window.setTimeout(() => {
      if (activeGame.current === scheduledGame) replay();
    }, hold + RESULT_FADE_MS);
    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(resetTimer);
    };
  }, [result, gameId, reducedMotion, replay]);

  const status = result ? (result === 'visitor' ? copy.visitorWin : result === 'blue' ? copy.blueWin : copy.draw) :
    intro !== 'ready' ? copy.intro : turn === 'X' ? copy.yourTurn : copy.blueTurn;
  const cellSize = 300 / 3;

  return (
    <section className="not-found-page" aria-labelledby="not-found-title">
      <div className="not-found-inner">
        <header className="not-found-heading">
          {!isPlay && <p className="not-found-kicker">{copy.fourOhFour} <span aria-hidden="true">/</span> BLUE VALOR LOGISTICS</p>}
          <h1 id="not-found-title">
            <span>{isPlay ? (language === 'es' ? '10-4. SU TURNO.' : 'WE READ YOU LOUD AND CLEAR.') : copy.headlineOne}</span>
            <span>{isPlay ? (language === 'es' ? 'RECIBIDO. VEAMOS QUÉ TIENE.' : "NOW MAKE YOUR MOVE.") : copy.headlineTwo}</span>
          </h1>
          <p className="not-found-score" aria-label={copy.score(score.blue, score.visitor)}>
            {copy.score(score.blue, score.visitor)}
          </p>
        </header>

        <section className="not-found-game" aria-label={copy.board}>
          <div className={`not-found-404${isPlay ? ' not-found-104' : ''}`}>
            <span className="not-found-four" aria-hidden="true">{isPlay ? '1' : '4'}</span>
            <div className={`not-found-center not-found-center--${intro}`}>
              {intro !== 'ready' && (
                <svg className="not-found-route" viewBox="0 0 240 250" aria-hidden="true">
                  <path className="not-found-route-path" d="M120 35 C169 35 207 75 207 125 C207 175 169 215 120 215 C71 215 33 175 33 125 C33 75 71 35 120 35Z" />
                  <g className="not-found-truck-orbit">
                    <animateMotion dur="1.75s" path="M120 35 C169 35 207 75 207 125 C207 175 169 215 120 215 C71 215 33 175 33 125 C33 75 71 35 120 35Z" rotate="auto" fill="freeze" />
                    <g className="not-found-truck-departure">
                    <Truck x={-30} y={-16} width={60} height={32} />
                    </g>
                  </g>
                </svg>
              )}
              {intro !== 'drive' && (
                <div className={`not-found-board ${intro === 'grid' ? 'is-drawing' : 'is-ready'}${clearing ? ' is-clearing' : ''}`}>
                  {Array.from({ length: 9 }, (_, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`not-found-cell ${board[index] ? `not-found-cell--${board[index]?.toLowerCase()}` : ''}`}
                      disabled={intro !== 'ready' || Boolean(result) || turn !== 'X' || Boolean(board[index])}
                      aria-label={copy.square(index + 1, board[index])}
                      onClick={() => playSquare(index)}
                    >
                      {board[index] === 'X' ? <span className="not-found-x">X</span> : board[index] === 'O' ? <Truck className="not-found-cell-truck" aria-hidden="true" focusable="false" /> : null}
                    </button>
                  ))}
                  <svg className="not-found-board-lines" viewBox="0 0 300 300" aria-hidden="true">
                    <path className="not-found-grid-line line-one" d="M100 8 L100 292" />
                    <path className="not-found-grid-line line-two" d="M200 8 L200 292" />
                    <path className="not-found-grid-line line-three" d="M8 100 L292 100" />
                    <path className="not-found-grid-line line-four" d="M8 200 L292 200" />
                  </svg>
                  {winningLine && result && (
                    <svg className="not-found-winning-overlay" viewBox="0 0 300 300" aria-hidden="true">
                      <path className="not-found-win-stroke" d={(() => {
                        const first = winningLine[0];
                        const last = winningLine[2];
                        const point = (cell: number) => ({ x: cell % 3, y: Math.floor(cell / 3) });
                        const start = point(first);
                        const end = point(last);
                        const center = (position: { x: number; y: number }) => ({ x: position.x * cellSize + 50, y: position.y * cellSize + 50 });
                        const a = center(start);
                        const b = center(end);
                        const dx = b.x - a.x;
                        const dy = b.y - a.y;
                        const norm = Math.hypot(dx, dy);
                        const sx = a.x - dx / norm * 38;
                        const sy = a.y - dy / norm * 38;
                        const ex = b.x + dx / norm * 38;
                        const ey = b.y + dy / norm * 38;
                        return `M${sx} ${sy} Q${(sx + ex) / 2 + (dy / norm) * 5} ${(sy + ey) / 2 - (dx / norm) * 5} ${ex} ${ey}`;
                      })()} />
                    </svg>
                  )}
                  {result === 'blue' && <LossStamp />}
                </div>
              )}
            </div>
            {isPlay && <span className="not-found-four" aria-hidden="true">-</span>}
            <span className="not-found-four" aria-hidden="true">4</span>
          </div>
          <p className={`not-found-status ${result ? 'not-found-status--result' : ''}`} aria-live="polite" role="status">{status}</p>
          <span className="sr-only" aria-live="polite" aria-atomic="true">{result === 'blue' ? 'Blue Valor wins' : ''}</span>
          <div className="not-found-actions">
            <button className="not-found-action" type="button" onClick={replay}>[ {copy.playAgain} ]</button>
            <Link className="not-found-action not-found-home" href="/">[ {copy.home} ]</Link>
          </div>
        </section>
      </div>
      {celebrating && <WinCelebration
        message={copy.visitorWin}
        homeLabel={copy.home}
        playAgainLabel={copy.playAgain}
        clearing={clearing}
        onReplay={replay}
        onDismiss={() => setCelebrating(false)}
      />}
    </section>
  );
}
