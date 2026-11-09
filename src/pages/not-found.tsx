import { useEffect } from 'react';
import TicTacToe404 from '../components/not-found/TicTacToe404';

export default function NotFound() {
  useEffect(() => {
    const existingRobots = document.querySelector('meta[name="robots"]');
    const hadRobots = Boolean(existingRobots);
    const previousRobots = existingRobots?.getAttribute('content') === 'noindex, follow'
      ? 'index, follow' : existingRobots?.getAttribute('content') ?? null;
    const robots = (existingRobots as HTMLMetaElement | null) ?? document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, follow';
    if (!existingRobots) document.head.appendChild(robots);

    return () => {
      if (!hadRobots) robots.remove();
      else if (previousRobots === null) robots.removeAttribute('content');
      else robots.content = previousRobots;
    };
  }, []);

  return <TicTacToe404 />;
}
