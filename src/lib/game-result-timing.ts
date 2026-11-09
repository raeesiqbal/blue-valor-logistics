export type GameResult = 'visitor' | 'blue' | 'draw';

export const RESULT_FADE_MS = 500;

export function resultHoldMs(result: GameResult, reducedMotion: boolean) {
  if (result === 'visitor') return 5000;
  if (result === 'draw') return 3000;
  // Loss: finish the entrance, then keep the solid stamp visible for 3 seconds.
  return reducedMotion ? 3200 : 400 + 1100 + 3000;
}
