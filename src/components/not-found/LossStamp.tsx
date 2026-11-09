import { useId } from 'react';

export default function LossStamp() {
  const id = useId().replace(/:/g, '');
  const ring = `bv-loss-ring-${id}`;
  return (
    <div className="not-found-loss-stamp">
      <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Blue Valor wins">
        <defs>
          <path id={ring} d="M200 200 m-142 0 a142 142 0 1 1 284 0 a142 142 0 1 1 -284 0" />
        </defs>
          <g fill="#64BFE0" stroke="#64BFE0">
            <circle cx="200" cy="200" r="190" fill="none" strokeWidth="10" />
            <circle cx="200" cy="200" r="176" fill="none" strokeWidth="3.5" />
            <text fontFamily="'Oswald', sans-serif" fontSize="38" stroke="none" dy="13">
              <textPath href={`#${ring}`} textLength="884" lengthAdjust="spacing">BLUE VALOR WINS • BLUE VALOR WINS •</textPath>
            </text>
            <circle cx="200" cy="200" r="110" fill="none" strokeWidth="3.5" />
            <circle cx="200" cy="200" r="100" stroke="none" />
          </g>
          <g fill="#2F6DB3" stroke="none">
            <rect x="110" y="164" width="116" height="52" rx="3" />
            <rect x="110" y="216" width="116" height="4" />
            <rect x="230" y="172" width="18" height="50" rx="3" />
            <rect x="248" y="180" width="18" height="42" />
            <path d="M266 198 L280 200 L286 208 L286 222 L266 222 Z" />
            <rect x="226" y="222" width="62" height="5" rx="1" />
            <rect x="244" y="160" width="4" height="22" rx="1" />
            <circle cx="128" cy="230" r="9" /><circle cx="150" cy="230" r="9" />
            <circle cx="238" cy="231" r="9" /><circle cx="258" cy="231" r="9" /><circle cx="278" cy="231" r="9" />
          </g>
          <g fill="#64BFE0" stroke="none">
            <rect x="252" y="186" width="11" height="12" rx="1" />
            <rect x="114" y="168" width="108" height="2" />
            <circle cx="128" cy="230" r="3.5" /><circle cx="150" cy="230" r="3.5" />
            <circle cx="238" cy="231" r="3.5" /><circle cx="258" cy="231" r="3.5" /><circle cx="278" cy="231" r="3.5" />
          </g>
      </svg>
    </div>
  );
}
