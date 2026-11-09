import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'wouter';

type WinCelebrationProps = {
  message: string;
  onDismiss: () => void;
  homeLabel: string;
  playAgainLabel: string;
  clearing: boolean;
  onReplay: () => void;
};

const confettiPieces = Array.from({ length: 280 }, (_, index) => {
  const angle = (index * 137.5 * Math.PI) / 180;
  const distance = 32 + ((index * 19) % 47);
  return {
    index,
    style: {
      '--confetti-w': `${11 + (index % 4) * 2}px`,
      '--confetti-h': `${22 + (index % 5) * 3}px`,
      '--confetti-color': ['#62c0de', '#3b82bb', '#ffffff'][index % 3],
      '--confetti-x': `${Math.cos(angle) * distance}vw`,
      '--confetti-y': `${Math.sin(angle) * distance}vh`,
      '--confetti-rotate': `${(index % 2 ? 1 : -1) * (190 + index * 13)}deg`,
      '--confetti-delay': `${(index % 10) * 18}ms`,
    } as CSSProperties,
  };
});

export default function WinCelebration({ message, homeLabel, playAgainLabel, clearing, onReplay, onDismiss }: WinCelebrationProps) {
  const [portal, setPortal] = useState<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const dismissRef = useRef(onDismiss);
  dismissRef.current = onDismiss;
  const dismissedRef = useRef(false);

  useEffect(() => {
    const mount = document.createElement('div');
    mount.dataset.winCelebrationPortal = 'true';
    document.body.appendChild(mount);

    const inertSiblings = Array.from(document.body.children)
      .filter((child): child is HTMLElement => child instanceof HTMLElement && child !== mount)
      .map(element => ({
        element,
        inert: element.inert,
        ariaHidden: element.getAttribute('aria-hidden'),
      }));
    inertSiblings.forEach(({ element }) => {
      element.inert = true;
      element.setAttribute('aria-hidden', 'true');
    });
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    setPortal(mount);

    return () => {
      inertSiblings.forEach(({ element, inert, ariaHidden }) => {
        element.inert = inert;
        if (ariaHidden === null) element.removeAttribute('aria-hidden');
        else element.setAttribute('aria-hidden', ariaHidden);
      });
      document.body.style.overflow = previousOverflow;
      mount.remove();
      if (previouslyFocused?.isConnected) previouslyFocused.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    if (!portal) return;
    dialogRef.current?.focus({ preventScroll: true });

    const dismiss = () => {
      if (dismissedRef.current) return;
      dismissedRef.current = true;
      dismissRef.current();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        event.preventDefault();
        const controls = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button, a') ?? []);
        const index = controls.indexOf(document.activeElement as HTMLElement);
        const next = event.shiftKey
          ? (index <= 0 ? controls.length - 1 : index - 1)
          : (index + 1) % controls.length;
        controls[next]?.focus({ preventScroll: true });
      } else if (event.key === 'Escape' ||
          ((event.key === 'Enter' || event.key === ' ') && event.target === dialogRef.current)) {
        event.preventDefault();
        dismiss();
      }
    };
    const keepFocusInside = (event: FocusEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        dialogRef.current.focus({ preventScroll: true });
      }
    };
    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('focusin', keepFocusInside, true);

    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('focusin', keepFocusInside, true);
    };
  }, [portal]);

  if (!portal) return null;

  return createPortal(
    <div
      ref={dialogRef}
      className={`win-celebration${clearing ? ' is-clearing' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={message}
      tabIndex={0}
      onClick={() => {
        if (dismissedRef.current) return;
        dismissedRef.current = true;
        dismissRef.current();
      }}
      onTouchStart={() => {
        if (dismissedRef.current) return;
        dismissedRef.current = true;
        dismissRef.current();
      }}
    >
      <div className="win-celebration-road" aria-hidden="true" />
      <div className="win-celebration-confetti" aria-hidden="true">
        {confettiPieces.map(({ index, style }) => (
          <i key={index} style={style} />
        ))}
      </div>
      <div className="win-celebration-banner">{message}</div>
      <div className="win-celebration-actions" onClick={event => event.stopPropagation()} onTouchStart={event => event.stopPropagation()}>
        <button className="not-found-action" type="button" onClick={onReplay}>[ {playAgainLabel} ]</button>
        <Link className="not-found-action" href="/">[ {homeLabel} ]</Link>
      </div>
    </div>,
    portal,
  );
}
